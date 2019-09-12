# from https://passport.baidu.com/v2/?login 

import re
import execjs
import base64
import requests
from time import time
from json import loads
from random import random
from settings import pw, user


def login(file='baidu/login.js'):
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())

    headers = {
        'Host': 'passport.baidu.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Referer': 'https://passport.baidu.com/v2/?login',
    }

    url = 'https://passport.baidu.com/v2/?login'
    res = requests.get(url, headers=headers, verify=True)
    baiduid = re.search(r'BAIDUID=(.*?);', res.headers.get('Set-Cookie', ''))
    if not baiduid:
        return
    cookies = {'BAIDUID': baiduid.group(1)}

    # gid = '1DE8DF0-90CF-429A-A062-C8C18D8FE2ED'
    # callback = 'bd__cbs__jv1vfp'
    gid = js.call('getGid')
    callback = js.call('getCall')
    url = f'https://passport.baidu.com/v2/api/?getapi&tpl=pp&apiver=v3&tt={int(time() * 1000)}&class=login&' \
        f'gid={gid}&loginversion=v4&logintype=basicLogin&traceid=&callback={callback}'
    res = requests.get(url, headers=headers, cookies=cookies, verify=True)
    # print(url)
    # print(res.text)
    temp = loads(re.search(r'\(({.*})\)', res.text.replace("'", '"')).group(1))
    token = temp['data']['token']
    print(token)
    callback = js.call('getCall')
    url = f'https://passport.baidu.com/v2/getpublickey?token={token}&tpl=pp&apiver=v3&tt={int(time() * 1000)}' \
        f'&gid={gid}&loginversion=v4&traceid=&callback={callback}'
    res = requests.get(url, headers=headers, cookies=cookies, verify=True)
    temp = loads(re.search(r'\(({.*})\)', res.text.replace("'", '"')).group(1))
    key = temp['key']
    print(key)
    password = js.call('getPw', pw, temp)
    print(password)


if __name__ == '__main__':
    login(file='login.js')
