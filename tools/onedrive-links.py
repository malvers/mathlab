#!/usr/bin/env python3
"""Create view-only OneDrive share links via Microsoft Graph.

    python3 tools/onedrive-links.py "UNTERRICHT/INFO FO 12/er-modell-1.pptx" [...]
        --scope anonymous|organization   (default anonymous = "Anyone with the link")
        --type view|edit                 (default view = not editable)
        --json out.json                  (write {path: url} there as well)

First run: prints a device code - open https://microsoft.com/devicelogin, enter it,
sign in with the IBB account. The refresh token is cached OUTSIDE the repo in
~/.config/onedrive-links/token.json (chmod 600), so later runs need no login.
Uses the public "Microsoft Graph Command Line Tools" client id, no app registration needed. No secrets in here.
"""
import argparse, json, os, stat, sys, time, urllib.request, urllib.parse, urllib.error

CLIENT_ID = "14d82eec-204b-4c2f-b7e8-296a70dab67e"      # Microsoft Graph Command Line Tools (public client)
AUTH = "https://login.microsoftonline.com/common/oauth2/v2.0"
GRAPH = "https://graph.microsoft.com/v1.0"
SCOPE = "https://graph.microsoft.com/Files.ReadWrite offline_access"
CACHE = os.path.expanduser("~/.config/onedrive-links/token.json")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) onedrive-links/1.0"


def post_form(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(),
                                 headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode() or "{}")


def graph(method, path, token, body=None):
    req = urllib.request.Request(GRAPH + path, method=method,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": "Bearer " + token, "User-Agent": UA,
                                          "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def save_cache(tok):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w") as f:
        json.dump(tok, f)
    os.chmod(CACHE, stat.S_IRUSR | stat.S_IWUSR)


def login_device_code():
    dc = post_form(AUTH + "/devicecode", {"client_id": CLIENT_ID, "scope": SCOPE})
    if "user_code" not in dc:
        sys.exit("device code failed: " + json.dumps(dc))
    print("\n=== ANMELDUNG NOETIG ===", flush=True)
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("paths", nargs="+", help="path inside OneDrive, e.g. 'UNTERRICHT/x.pptx'")
    ap.add_argument("--scope", default="anonymous", choices=["anonymous", "organization"])
    ap.add_argument("--type", default="view", choices=["view", "edit"])
    ap.add_argument("--json", help="also write {path: url} to this file")
    a = ap.parse_args()
    token = get_token()
    me = graph("GET", "/me", token)
    print("Konto:", me.get("userPrincipalName"), flush=True)
    out = {}
    for p in a.paths:
        enc = urllib.parse.quote(p)
        link = graph("POST", f"/me/drive/root:/{enc}:/createLink", token,
                     {"type": a.type, "scope": a.scope})
        url = link["link"]["webUrl"]
        out[p] = url
        print(f"{p}\n  {a.type}/{a.scope}: {url}", flush=True)
    if a.json:
        with open(a.json, "w") as f:
            json.dump(out, f, indent=1, ensure_ascii=False)


if __name__ == "__main__":
    main()
