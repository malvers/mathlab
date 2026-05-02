import os
import re

html_files = set([f for f in os.listdir('.') if f.endswith('.html')])

with open('universe.html', 'r') as f:
    universe_content = f.read()

match_u = re.search(r'const\s+UNIVERSE_LABS\s*=\s*(\[.*?\]);', universe_content, re.DOTALL)
if match_u:
    universe_str = match_u.group(1)
    hrefs_universe = set(re.findall(r'href:\s*[\'"]([^\'"]+)[\'"]', universe_str))
else:
    hrefs_universe = set()

missing = html_files - hrefs_universe
print("HTML files not in universe.html:")
for m in sorted(missing):
    print(m)
