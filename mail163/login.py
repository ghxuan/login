# from https://mail.163.com/

import re
import execjs
import base64
import requests
from time import time
from json import loads
from random import random
from settings import pw, user


def login(file='mail163/login.js'):
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())

    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Referer': '',
    }
    topURL = "https://mail.163.com/"
    rtid = js.call('getRtid')
    pkid = "CvViHzl"

    url = f'https://dl.reg.163.com/dl/gt?un={user}&pkid={pkid}&pd=mail163&channel=0&topURL={topURL}&rtid={rtid}&nocache={int(time()*1000)}'
    res = requests.get(url, headers, verify=True)
    data = {
        "un": user,
        "pw": js.call('getPw', pw),
        "pd": "mail163",
        "l": 0, "d": 10, "t": int(time()*1000), "pkid": pkid, "domains": "",
        "tk": "945b58466d8876a86d29f781571cbc07",
        "pwdKeyUp": 1, "channel": 0,
        "topURL": topURL,
        "rtid": rtid}
    print(url)
    print(res.text)


if __name__ == '__main__':
    login(file='login.js')
