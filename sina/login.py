# from https://login.sina.com.cn/signup/signin.php

import re
import execjs
import base64
import requests
from time import time
from json import loads
from random import random
from settings import sina_pw, user


def login(file='sina/login.js'):
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())

    headers = {
        'Host': 'login.sina.com.cn',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Referer': 'https://login.sina.com.cn/signup/signin.php',
    }

    su = base64.b64encode(user.encode()).decode()
    url = f'https://login.sina.com.cn/sso/prelogin.php?entry=account&callback=sinaSSOController.preloginCallBack&' \
        f'su={su}&rsakt=mod&client=ssologin.js(v1.4.15)&_={int(time() * 1000)}'
    res = requests.get(url, headers=headers, verify=True)
    print(url)
    # print(res.text)
    temp = loads(re.search('{.*?}', res.text).group())
    print(temp)
    data = {
        'entry': 'account', 'gateway': '1', 'from': 'null', 'savestate': '0', 'useticket': '0', 'pagerefer': '',
        'vsnf': '1', 'service': 'account', 'pwencode': 'rsa2', 'sr': '1920*1080',
        'su': su,
        'servertime': temp.get('servertime'),
        'nonce': temp.get('nonce'),
        'rsakv': temp.get('rsakv'),
        'sp': '',
        'encoding': 'UTF-8', 'cdult': '3', 'domain': 'sina.com.cn', 'prelt': '30', 'returntype': 'TEXT'}
    retcode = 0
    tim = 1
    while True:
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        data['sp'] = js.call('getPw', sina_pw, temp)
        print(data['sp'])
        url = f'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)&_={int(time() * 1000)}'
        print(url)
        res = requests.post(url, headers=headers, data=data, verify=True)
        print(res.text)
        retcode = res.json().get('retcode')
        if retcode != 4049 or tim == 1:
            break
        url = f'https://login.sina.com.cn/cgi/pin.php?r={int(random() * 100000000)}&s=0'
        # door
        tim += 1


if __name__ == '__main__':
    login(file='login.js')
