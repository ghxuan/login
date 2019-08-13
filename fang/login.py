# from https://passport.fang.com/

import execjs
import requests
from settings import fang_pw, user


def login():
    js = execjs.compile(open('fang/login.js', 'r+', encoding='utf-8').read())

    headers = {
        'Host': 'passport.fang.com',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Origin': 'https://passport.fang.com',
        'Referer': 'https://passport.fang.com/',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
    url = 'https://passport.fang.com/GetLoginErrorCount.api'
    data = {
        'uid': str(user),
        'Service': 'soufun-passport-web',
    }
    # res = requests.post(url, headers=headers, data=data, verify=False)
    res = requests.post(url, headers=headers, data=data, verify=True)
    print(res.text)
    data.update({
        'pwd': js.call('getPw', fang_pw),
        'AutoLogin': '0',
    })
    # data = {
    #     'uid': str(user),
    #     'enpassword': js.call('getPw', fang_pw),
    #     'Service': 'soufun-passport-web',
    #     'AutoLogin': '0',
    # }
    # print(data)
    url = 'https://passport.fang.com/login.api'
    res = requests.post(url, headers=headers, data=data, verify=True)
    print(res.text)


if __name__ == '__main__':
    login()
