# from https://login.sina.com.cn/signup/signin.php

import re
import execjs
import base64
import requests
from time import time
from json import loads
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
    res = requests.get(url, headers)
    print(url)
    # print(res.text)
    res = loads(re.search('{.*?}', res.text).group())
    print(res)
    sp = js.call('getPw', sina_pw, res)
    print(sp)

    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    url = f'https://login.sina.com.cn/sso/login.php?client=ssologin.js(v1.4.15)&_={int(time() * 1000)}'
    print(url)
    # res = requests.post(url, headers=headers, data=data)
    # print(res.text)


if __name__ == '__main__':
    login(file='login.js')
