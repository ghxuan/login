# from https://passport.migu.cn/login

import execjs
import requests
from settings import migu_pw, user


def login(file='migu/login.js'):
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())

    headers = {
        'Host': 'passport.migu.cn',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Origin': 'https://passport.migu.cn',
        'Referer': 'https://passport.migu.cn/login',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'sourceID': '100001',
        'loginID': str(user),
        'enpassword': js.call('getPw', migu_pw),
    }
    url = 'https://passport.migu.cn/authn'
    res = requests.post(url, headers=headers, data=data)
    print(res.text)


if __name__ == '__main__':
    login(file='login.js')
