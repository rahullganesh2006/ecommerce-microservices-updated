import os
import glob
import io

files = glob.glob('*/requirements.txt')

for path in files:
    with io.open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
        for line in lines:
            if 'pytest' in line or 'moto' in line:
                continue
            f.write(line)
    print(f"Cleaned {path}")
