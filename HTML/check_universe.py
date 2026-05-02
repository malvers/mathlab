import re

with open('js/labs-config.js', 'r') as f:
    config_content = f.read()

match = re.search(r'const\s+LABS_DATA\s*=\s*(\[.*?\]);', config_content, re.DOTALL)
if match:
    labs_data_str = match.group(1)
    hrefs_config = re.findall(r'"href":\s*[\'"]([^\'"]+)[\'"]', labs_data_str)
    labels_config = re.findall(r'"title":\s*[\'"]([^\'"]+)[\'"]', labs_data_str)
    print("Found", len(hrefs_config), "in config")
    config_labs = [{'href': h, 'label': l} for h, l in zip(hrefs_config, labels_config)]
else:
    config_labs = []

with open('universe.html', 'r') as f:
    universe_content = f.read()

match_u = re.search(r'const\s+UNIVERSE_LABS\s*=\s*(\[.*?\]);', universe_content, re.DOTALL)
if match_u:
    universe_str = match_u.group(1)
    hrefs_universe = re.findall(r'href:\s*[\'"]([^\'"]+)[\'"]', universe_str)
    print("Found", len(hrefs_universe), "in universe")
else:
    hrefs_universe = []

missing = [l for l in config_labs if l['href'] not in hrefs_universe]
print('Missing in universe.html:')
for m in missing:
    print(m)
