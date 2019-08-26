# from https://mail.163.com/

import re
import execjs
import base64
import requests
from time import time
from json import loads
from random import random
from settings import sina_pw, user


def login(file='mail163/login.js'):
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())

    headers = {
        'Host': 'login.sina.com.cn',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Referer': '',
    }

    url = f''
    res = requests.get(url, headers, verify=True)
    print(url)
    print(res.text)

if __name__ == '__main__':
    login(file='login.js')
