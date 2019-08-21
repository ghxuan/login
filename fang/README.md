# 房天下
该文件夹是房天下模拟登录，解析登录页面加密js代码，操作运行js代码处理密码加密，并发送请求。<br>


* RSA.min.js 从 [RSA.min.js](https://static.soufunimg.com/passport/commonjs/RSA.min.js) 获取，主要是 soufunimg 网登录处理的js。
* login.js 从 RSA.min.js 获取密码加密代码，并根据 encryptedString 方法写 getPw 方法，以 getPw 来处理代码，返回加密后的密码。
* login.py 通过 PyExecJS 模块运行 login.js 里面的 getPw 方法获取加密后的代码，并通过 requests 模块 post 请求模拟登录 房天下。
