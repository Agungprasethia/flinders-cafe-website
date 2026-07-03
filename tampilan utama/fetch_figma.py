import urllib.request
import json
import sys

def main():
    req = urllib.request.Request(
        'https://api.figma.com/v1/files/Si3w1UJU3xV3V6kipIvdIa/nodes?ids=1:2',
        headers={'X-Figma-Token': 'YOUR_FIGMA_TOKEN_HERE'}
    )

    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            node = data.get('nodes', {}).get('1:2', {}).get('document', {})
            print('Node name:', node.get('name'))
            
            def extract_info(n, depth=0):
                if not n: return
                if n.get('type') == 'TEXT':
                    print('  '*depth + 'TEXT:', n.get('characters', '').replace('\n', ' '))
                    if 'style' in n:
                        font_family = n["style"].get("fontFamily")
                        font_weight = n["style"].get("fontWeight")
                        font_size = n["style"].get("fontSize")
                        print('  '*(depth+1) + f'FONT: {font_family} {font_weight} SIZE: {font_size}')
                        if 'fills' in n and len(n['fills']) > 0 and n['fills'][0].get('type') == 'SOLID':
                            c = n['fills'][0].get('color', {})
                            print('  '*(depth+1) + f'COLOR: rgba({c.get("r", 0)*255:.0f}, {c.get("g", 0)*255:.0f}, {c.get("b", 0)*255:.0f}, {c.get("a", 1)})')
                elif n.get('type') in ['FRAME', 'GROUP', 'COMPONENT', 'INSTANCE', 'RECTANGLE']:
                    print('  '*depth + n.get('type') + ':', n.get('name'))
                    if 'fills' in n and len(n['fills']) > 0 and n['fills'][0].get('type') == 'SOLID':
                        c = n['fills'][0].get('color', {})
                        if n.get('type') == 'RECTANGLE' or n.get('type') == 'FRAME':
                            print('  '*(depth+1) + f'BG COLOR: rgba({c.get("r", 0)*255:.0f}, {c.get("g", 0)*255:.0f}, {c.get("b", 0)*255:.0f}, {c.get("a", 1)})')
                
                for c in n.get('children', []):
                    extract_info(c, depth+1)
                    
            extract_info(node)
    except Exception as e:
        print('Error:', e)

if __name__ == "__main__":
    # Ensure stdout handles utf-8 properly
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    main()
