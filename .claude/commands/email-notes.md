Send the given file(s) by email using the project's mail script.

Run: `python3 tools/email-notes.py <files> [-s "Subject"]`

- The files to send are in: $ARGUMENTS
  If no files are given, default to the three tracker notes:
  `HTML/tracker/bug-geschwindigkeitsanzeige.md HTML/tracker/geo-erkennung-und-voice-spur.md HTML/tracker/gps-nachbearbeitung-ppk-ppp.md`
- Credentials (RESEND_API_KEY, MAIL_TO) come ONLY from environment variables or the
  git-ignored tools/email-notes.local.env — never put a key in any file you commit.
- After sending, report the script's success/error output. If it fails with a network
  error, tell the user the sandbox network policy may be blocking api.resend.com.
- See tools/email-notes.README.md for setup.
