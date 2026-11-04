#!/usr/bin/env python3
"""Post a message with a file into MS Teams channels via Microsoft Graph, as Doc.

    python3 tools/teams-post.py login                 (once: device code, see below)
    python3 tools/teams-post.py teams                 (Doc's teams and their main channel)
    python3 tools/teams-post.py send "TEAM A" "TEAM B" --file x.pdf --text "Hallo ..."
        --subject "Betreff"      (optional headline of the post)
        --channel "Name"         (default: the team's main channel, "Allgemein")
        --replace                (overwrite a file of the same name in the channel's files)
        --dry                    (only show what would go where, send nothing)

Doc, 04.11.2026: "Wenn ich sage, schick den das und das ins Teams, dass er das macht."
The file goes into the channel's "Dateien" folder, the post links it as an attachment.
Every team name must match exactly one of Doc's own teams, or nothing is sent.

First run: prints a device code - open https://microsoft.com/devicelogin, enter it,
sign in with the IBB account. The refresh token is cached OUTSIDE the repo in
~/.config/teams-post/token.json (chmod 600), so later runs need no login.
Uses the public "Microsoft Graph Command Line Tools" client id, like onedrive-links.py,
no app registration needed. No secrets in here.
"""
import argparse, html, json, os, re, stat, sys, time, urllib.request, urllib.parse, urllib.error

CLIENT_ID = "14d82eec-204b-4c2f-b7e8-296a70dab67e"      # Microsoft Graph Command Line Tools (public client)
AUTH = "https://login.microsoftonline.com/common/oauth2/v2.0"
GRAPH = "https://graph.microsoft.com/v1.0"
SCOPE = " ".join("https://graph.microsoft.com/" + s for s in (
    "User.Read", "Team.ReadBasic.All", "Channel.ReadBasic.All",
    "ChannelMessage.Send", "Files.ReadWrite.All")) + " offline_access"
CACHE = os.path.expanduser("~/.config/teams-post/token.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) teams-post/1.0"


def post_form(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(),
                                 headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode() or "{}")


def graph(method, path, token, body=None, raw=None, ctype="application/json"):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(path if path.startswith("https:") else GRAPH + path, method=method,
                                 data=data, headers={"Authorization": "Bearer " + token,
                                                     "User-Agent": UA, "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            txt = r.read().decode()
            return json.loads(txt) if txt else {}
    except urllib.error.HTTPError as e:
        if e.code == 404 and method == "GET":
            return None
        sys.exit(f"Graph {method} {path}: HTTP {e.code} {e.read().decode()[:400]}")


def save_cache(tok):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w") as f:
        json.dump(tok, f)
    os.chmod(CACHE, stat.S_IRUSR | stat.S_IWUSR)


def login_device_code():
    dc = post_form(AUTH + "/devicecode", {"client_id": CLIENT_ID, "scope": SCOPE})
    if "user_code" not in dc:
        sys.exit("device code failed: " + json.dumps(dc))
    print("\n=== ANMELDUNG NÖTIG ===", flush=True)
    print(dc["message"], flush=True)
    print(f"CODE: {dc['user_code']}   URL: {dc['verification_uri']}\n", flush=True)
    interval = int(dc.get("interval", 5))
    deadline = time.time() + int(dc.get("expires_in", 900))
    while time.time() < deadline:
        time.sleep(interval)
        tok = post_form(AUTH + "/token", {
            "client_id": CLIENT_ID, "device_code": dc["device_code"],
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code"})
        if "access_token" in tok:
            tok["obtained"] = time.time()
            save_cache(tok)
            print("angemeldet.", flush=True)
            return tok
        err = tok.get("error")
        if err == "authorization_pending":
            continue
        if err == "slow_down":
            interval += 5
            continue
        sys.exit("login failed: " + json.dumps(tok))
    sys.exit("login timed out - bitte noch einmal starten")


def get_token():
    if os.path.exists(CACHE):
        tok = json.load(open(CACHE))
        if time.time() < tok.get("obtained", 0) + tok.get("expires_in", 0) - 120:
            return tok["access_token"]
        if tok.get("refresh_token"):
            new = post_form(AUTH + "/token", {
                "client_id": CLIENT_ID, "grant_type": "refresh_token",
                "refresh_token": tok["refresh_token"], "scope": SCOPE})
            if "access_token" in new:
                new["obtained"] = time.time()
                save_cache(new)
                return new["access_token"]
    return login_device_code()["access_token"]


def my_teams(token):
    out, url = [], "/me/joinedTeams?$select=id,displayName"
    while url:
        page = graph("GET", url, token)
        out += page.get("value", [])
        url = page.get("@odata.nextLink")
    return out


def resolve(names, teams):
    """Each name must be exactly one of Doc's teams - two teams of the same name exist at the IBB."""
    found, bad = [], []
    for n in names:
        hits = [t for t in teams if t["displayName"] == n]
        if len(hits) == 1:
            found.append(hits[0])
        else:
            bad.append(f"{n} ({len(hits)} Treffer)")
    if bad:
        sys.exit("Nicht eindeutig oder nicht gefunden, nichts gesendet: " + "; ".join(bad))
    return found


def channel_of(token, team, name):
    if not name:
        return graph("GET", f"/teams/{team['id']}/primaryChannel", token)
    chans = graph("GET", f"/teams/{team['id']}/channels", token).get("value", [])
    hits = [c for c in chans if c["displayName"] == name]
    if len(hits) != 1:
        sys.exit(f"Kanal '{name}' in '{team['displayName']}': {len(hits)} Treffer, nichts gesendet")
    return hits[0]


def target(token, team, chan, path):
    """Where the file goes in the channel's files, and whether one of that name is already there."""
    folder = graph("GET", f"/teams/{team['id']}/channels/{chan['id']}/filesFolder", token)
    where = f"/drives/{folder['parentReference']['driveId']}/items/{folder['id']}:/" \
            + urllib.parse.quote(os.path.basename(path))
    return where, graph("GET", where, token) is not None


def upload(token, where, path):
    with open(path, "rb") as f:
        return graph("PUT", where + ":/content", token, raw=f.read(), ctype="application/octet-stream")


def post(token, team, chan, item, text, subject):
    guid = re.search(r"[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}",
                     item["eTag"]).group(0)
    body = html.escape(text).replace("\n", "<br>") + f'<attachment id="{guid}"></attachment>'
    msg = {"body": {"contentType": "html", "content": body},
           "attachments": [{"id": guid, "contentType": "reference",
                            "contentUrl": item["webUrl"], "name": item["name"]}]}
    if subject:
        msg["subject"] = subject
    return graph("POST", f"/teams/{team['id']}/channels/{chan['id']}/messages", token, body=msg)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["login", "teams", "send"])
    ap.add_argument("names", nargs="*", help="exact team names (send)")
    ap.add_argument("--file")
    ap.add_argument("--text")
    ap.add_argument("--subject")
    ap.add_argument("--channel")
    ap.add_argument("--replace", action="store_true")
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    token = get_token()
    me = graph("GET", "/me", token)
    print("Konto:", me.get("userPrincipalName"), flush=True)
    if a.cmd == "login":
        return
    teams = my_teams(token)
    if a.cmd == "teams":
        for t in sorted(teams, key=lambda t: t["displayName"].lower()):
            print(" ", t["displayName"])
        print(len(teams), "Teams", flush=True)
        return
    if not (a.names and a.file and a.text):
        sys.exit("send braucht Teamnamen, --file und --text")
    if not os.path.isfile(a.file):
        sys.exit("Datei fehlt: " + a.file)
    # check every team first, so a stop never leaves half the teams sent
    targets = []
    for t in resolve(a.names, teams):
        c = channel_of(token, t, a.channel)
        where, there = target(token, t, c, a.file)
        targets.append((t, c, where))
        print(f"{'TROCKEN ' if a.dry else ''}→ {t['displayName']} / {c['displayName']}: "
              f"{os.path.basename(a.file)}{' (liegt schon dort)' if there else ''}", flush=True)
        if there and not (a.replace or a.dry):
            sys.exit(f"'{os.path.basename(a.file)}' liegt schon in '{t['displayName']}' (Dateien), "
                     "nichts gesendet - mit --replace überschreiben")
    if a.dry:
        return
    for t, c, where in targets:
        m = post(token, t, c, upload(token, where, a.file), a.text, a.subject)
        print(f"gesendet: {t['displayName']} / {c['displayName']}  {m.get('webUrl', '')}", flush=True)


if __name__ == "__main__":
    main()
