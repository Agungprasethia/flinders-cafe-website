import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def traverse(node, depth=0):
    indent = "  " * depth
    node_type = node.get("type", "UNKNOWN")
    name = node.get("name", "Unnamed")
    
    info = f"{indent}- [{node_type}] {name}"
    
    if node_type == "TEXT":
        chars = node.get("characters", "").replace('\n', '\\n')
        info += f" : \"{chars}\""
        
    print(info)
    
    for child in node.get("children", []):
        traverse(child, depth + 1)

try:
    with open("figma_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    if "err" in data:
        print(f"Figma API Error: {data['err']}")
        sys.exit(1)
        
    node = data["nodes"]["1:2"]["document"]
    traverse(node)
except Exception as e:
    print(f"Error parsing: {e}")
