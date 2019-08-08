import re

with open(r'migu\test.js', 'r+', encoding='utf-8') as f:
    t = f.read()
print(re.findall(r'define\("lib/rsa/rsa",\[\],function\(a,b,c\)\{(.*?),c\.exports=\{', t, re.S | re.M))
