import os
import json

files = [f for f in os.listdir('/Users/malvers/IdeaProjects/forloop/HTML/resources/screenshots') if f.endswith('.png')]
print(json.dumps(files))
