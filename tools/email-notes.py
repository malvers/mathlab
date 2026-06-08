#!/usr/bin/env python3
"""Email one or more files as attachments via the Resend HTTPS API.

Repo is PUBLIC — NO secret lives in this file. The API key and recipient come
ONLY from environment variables (or a git-ignored local env file), never the source.

Required configuration (set as environment variables, or in a git-ignored
tools/email-notes.local.env file as KEY=VALUE lines):
  RESEND_API_KEY   Resend API key      (https://resend.com → API Keys)   [required]
  MAIL_TO          recipient address                                     [required]
Optional:
  MAIL_FROM        sender; default "Tracker Notes <onboarding@resend.dev>"
                   (the resend.dev test sender works without a verified domain,
                    but Resend then only delivers to your own account address)
  MAIL_SUBJECT     subject line; default lists the attached filenames

Usage:
  python3 tools/email-notes.py FILE [FILE ...] [-s "Subject"] [-m "Body text"]

Example:
  python3 tools/email-notes.py HTML/tracker/*.md -s "Tracker-Notizen"
"""

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.request

RESEND_ENDPOINT = "https://api.resend.com/emails"
DEFAULT_FROM = "Tracker Notes <onboarding@resend.dev>"
LOCAL_ENV = os.path.join(os.path.dirname(__file__), "email-notes.local.env")


def load_local_env(path):
    """Merge KEY=VALUE lines from a git-ignored local env file into os.environ
    (without overwriting values already set in the real environment)."""
    if not os.path.isfile(path):
        return
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def die(msg, code=1):
    print(f"email-notes: {msg}", file=sys.stderr)
    sys.exit(code)


def main():
    load_local_env(LOCAL_ENV)

    ap = argparse.ArgumentParser(description="Email files via Resend.")
    ap.add_argument("files", nargs="+", help="file(s) to attach")
    ap.add_argument("-s", "--subject", help="subject line")
    ap.add_argument("-m", "--message", help="plain-text body")
    args = ap.parse_args()

    api_key = os.environ.get("RESEND_API_KEY")
    mail_to = os.environ.get("MAIL_TO")
    mail_from = os.environ.get("MAIL_FROM", DEFAULT_FROM)
    if not api_key:
        die("RESEND_API_KEY is not set — add it as an env var (see header). Refusing to run.")
    if not mail_to:
        die("MAIL_TO is not set — add the recipient as an env var.")

    attachments = []
    names = []
    for fp in args.files:
        if not os.path.isfile(fp):
            die(f"file not found: {fp}")
        with open(fp, "rb") as fh:
            content = base64.b64encode(fh.read()).decode("ascii")
        name = os.path.basename(fp)
        names.append(name)
        attachments.append({"filename": name, "content": content})

    subject = args.subject or ("Notizen: " + ", ".join(names))
    body = args.message or ("Anbei:\n- " + "\n- ".join(names))

    payload = json.dumps({
        "from": mail_from,
        "to": [mail_to],
        "subject": subject,
        "text": body,
        "attachments": attachments,
    }).encode("utf-8")

    req = urllib.request.Request(
        RESEND_ENDPOINT,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"email-notes: sent → {mail_to} (id {data.get('id', '?')}): {', '.join(names)}")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        die(f"Resend HTTP {e.code}: {detail}", code=2)
    except urllib.error.URLError as e:
        die(f"network error (sandbox policy may block api.resend.com): {e.reason}", code=3)


if __name__ == "__main__":
    main()
