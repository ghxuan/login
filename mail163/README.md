# 网易邮箱
该文件夹是网易邮箱模拟登录，解析登录页面加密js代码，操作运行js代码处理密码加密，并发送请求。<br>


* pp_index_dl_c12b2887be7878c95229f475613d60d0.js 从 [pp_index_dl_c12b2887be7878c95229f475613d60d0.js](https://urswebzj.nosdn.127.net/webzj_cdn101/pp_index_dl_c12b2887be7878c95229f475613d60d0.js) 获取，主要是 网易邮箱登录处理的js。
* login.js 从 pp_index_dl_c12b2887be7878c95229f475613d60d0.js 截取密码加密部分代码，并更改部分方法为 getPw 方法，以 getPw 来处理代码，返回加密后的密码。
* login.py 通过 PyExecJS 模块运行 login.js 里面的 getPw 方法获取加密后的代码，并通过 requests 模块 post 请求模拟登录 migu。
* 网易邮箱模拟登录首先要获取 cookies 中的 l_s_mail163CvViHzl 参数及内容，然后根据 https://dl.reg.163.com/dl/gt 网址获取 tk 参数。最后post。
* 假如模拟登录的账号需要验证，post请求后会返回 {"ret":"402"}。