import re
import os

with open('universe.html', 'r') as f:
    universe_content = f.read()

match_u = re.search(r'const\s+UNIVERSE_LABS\s*=\s*(\[.*?\]);', universe_content, re.DOTALL)
if match_u:
    universe_str = match_u.group(1)
    files_universe = set(re.findall(r'file:\s*[\'"]([^\'"]+)[\'"]', universe_str))
else:
    files_universe = set()

screenshots = set([f for f in os.listdir('resources/screenshots') if f.endswith('.png')])

missing_in_universe = screenshots - files_universe
print("Screenshots not in universe.html:")
for m in sorted(missing_in_universe):
    print(m)

missing_on_disk = files_universe - screenshots
print("\nIn universe.html but missing on disk:")
for m in sorted(missing_on_disk):
    print(m)
