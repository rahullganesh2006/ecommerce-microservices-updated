import os
import glob
import codecs

files = glob.glob('*/requirements.txt')

for path in files:
    try:
        with codecs.open(path, 'r', encoding='utf-16le') as f:
            content = f.read()
    except:
        with codecs.open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
    with codecs.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Fixed encoding for {path}")
