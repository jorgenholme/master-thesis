import yaml
import json

connection_yaml = open("connection-profile.yaml")
connection_json = yaml.safe_load(connection_yaml)
with open('connection-profile3.json', 'w', encoding='utf-8') as f:
    json.dump(connection_json, f, ensure_ascii=False, indent=4)