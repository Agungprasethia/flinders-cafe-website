import json
import sys

sys.setrecursionlimit(10000)

with open(r'figma_node.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)

# Find elements by name and their fill colors
results = []

def find_elements(obj, depth=0):
    if depth > 50:
        return
    if isinstance(obj, dict):
        name = obj.get('name', '')
        node_type = obj.get('type', '')
        
        # Check fills for color
        fills = obj.get('fills', [])
        bg_color = obj.get('backgroundColor', None)
        
        if fills and isinstance(fills, list):
            for fill in fills:
                if isinstance(fill, dict) and fill.get('type') == 'SOLID':
                    color = fill.get('color', {})
                    if isinstance(color, dict) and 'r' in color:
                        r = int(color['r'] * 255)
                        g = int(color['g'] * 255)
                        b = int(color['b'] * 255)
                        hex_color = f'#{r:02X}{g:02X}{b:02X}'
                        results.append(f'{name} ({node_type}) fill: {hex_color}')
        
        # Check font info
        style = obj.get('style', {})
        if isinstance(style, dict) and 'fontFamily' in style:
            font_info = f"font={style.get('fontFamily')}, size={style.get('fontSize')}, weight={style.get('fontWeight')}, style={style.get('fontStyle','')}"
            results.append(f'{name} ({node_type}) {font_info}')
        
        # Check cornerRadius
        cr = obj.get('cornerRadius', None)
        if cr and cr > 0:
            results.append(f'{name} ({node_type}) cornerRadius: {cr}')
        
        for v in obj.values():
            find_elements(v, depth + 1)
    elif isinstance(obj, list):
        for i in obj:
            find_elements(i, depth + 1)

find_elements(data)

for r in results:
    print(r)
