# 模拟登录
练习模拟登录不同的网站，通过阅读不同网站js代码，熟练模拟登陆及js代码。<br>
## 初始化
1、虚拟环境<br>
虚拟环境初始化需要运行一下代码<br>
win: 
```
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```
linux:
```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
2、文件了解<br>

venv\ 虚拟环境 <br>
.gitignore git禁止上传 <br>
settings.py 密码等变量 <br>

## 一、咪咕音乐
[migu](https://github.com/ghxuan/login/tree/master/migu) 文件夹是咪咕音乐模拟登录，解析登录页面加密js代码，操作运行js代码处理密码加密，并发送请求。