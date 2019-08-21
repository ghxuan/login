# 新浪
该文件夹是新浪模拟登录，解析登录页面加密js代码，操作运行js代码处理密码加密，并发送请求。<br>未完，由于此账号长期未登录，现在需要验证码，待破解


* ssologin.js 从 [ssologin.js](https://passport.sinaimg.cn/js/sso/ssologin.js) 获取，主要是 sina 网登录处理的js。
* login.js 从 ssologin.js 截取密码加密部分代码，并更改 sinaSSOEncoder 方法为 getPw 方法，以 getPw 来处理代码，返回加密后的密码。
* login.py 通过 PyExecJS 模块运行 login.js 里面的 getPw 方法获取加密后的代码，并通过 requests 模块 post 请求模拟登录 新浪。
