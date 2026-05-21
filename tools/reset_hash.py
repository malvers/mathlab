#!/usr/bin/env python3
"""Generate the PBKDF2 hash for the chat.html /reset confirmation password.

The plaintext password is NEVER stored anywhere: it is read interactively (hidden
input via getpass) and only its hash is printed. Paste the printed hash into
HTML/chat.html -> RESET_PWD_HASH.

The parameters here MUST match the runtime check in chat.html (hashResetPwd):
  PBKDF2-HMAC-SHA-256, salt 'forloop-reset-salt-v1', 200000 iterations, 32-byte output.

Usage:
  python3 tools/reset_hash.py
  (enter the password when prompted — nothing is echoed or saved)
"""
import getpass
import hashlib

SALT = b'forloop-reset-salt-v1'
ITERATIONS = 200000
DKLEN = 32  # 256 bits, matches deriveBits(…, 256) in chat.html

def main():
    pwd = getpass.getpass('Reset-Passwort (versteckt): ').encode('utf-8')
    digest = hashlib.pbkdf2_hmac('sha256', pwd, SALT, ITERATIONS, dklen=DKLEN).hex()
    print('\nRESET_PWD_HASH = \'' + digest + '\';')
    print('\n→ Diesen Hash in HTML/chat.html bei RESET_PWD_HASH eintragen.')

if __name__ == '__main__':
    main()
