# from https://mail.163.com/

import re
import execjs
import requests
from time import time
from json import dumps
from urllib import parse
from settings import pw, m_user


def login(file='mail163/login.js'):
    pd = "mail163"
    js = execjs.compile(open(file, 'r+', encoding='utf-8').read())
    topURL = "https%3A%2F%2Fmail.163.com%2F"
    rtid = js.call('getRtid')
    pkid = "CvViHzl"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Host': 'dl.reg.163.com',
        'Referer':
            f'https://dl.reg.163.com/webzj/v1.0.1/pub/index_dl2_new.html?'
            f'cd=https%3A%2F%2Fmimg.127.net%2Fp%2Ffreemail%2Findex%2Funified%2Fstatic%2F2019%2Fcss%2F&'
            f'cf=urs.163.bc0e7491.css&MGID={round(time() * 1000, 4)}&wdaId=&pkid=CvViHzl&product=mail163',
    }

    url = f'https://dl.reg.163.com/dl/ini?pd={pd}&pkid={pkid}&pkht=mail.163.com&channel=0&' \
        f'topURL={topURL}&rtid={rtid}&nocache={int(time() * 1000)}'
    res = requests.get(url, headers=headers, verify=True)
    # res = requests.get(url, headers=headers, verify=False)
    l_s_mail163CvViHzl = re.search(r'l_s_mail163CvViHzl=(.*?);', res.headers.get('Set-Cookie', ''))
    if not l_s_mail163CvViHzl:
        return
    cookies = {'l_s_mail163CvViHzl': l_s_mail163CvViHzl.group(1)}

    url = f'https://dl.reg.163.com/dl/gt?un={parse.quote(m_user)}&pkid={pkid}&pd=mail163&channel=0&' \
        f'topURL={topURL}&rtid={rtid}&nocache={int(time() * 1000)}'
    res = requests.get(url, headers=headers, cookies=cookies, verify=True)
    # res = requests.get(url, headers=headers, cookies=cookies, verify=False)
    res = res.json()

    url = 'https://dl.reg.163.com/dl/l'
    data = {
        "un": m_user,
        "pw": js.call('getPw', pw),
        "pd": pd,
        "l": 0, "d": 10, "t": int(time() * 1000), "pkid": pkid, "domains": "",
        "tk": res.get('tk', ''),
        "pwdKeyUp": 1, "channel": 0,
        "topURL": topURL,
        "rtid": rtid}
    headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
        'Origin': 'dl.reg.163.com',
        'Referer': headers.get('Referer'),
    }

    res = requests.post(url, headers=headers, data=dumps(data), cookies=cookies, verify=True)
    # res = requests.post(url, headers=headers, data=dumps(data), cookies=cookies, verify=False)

    # print(data)
    print(res.text)


if __name__ == '__main__':
    login(file='login.js')
