// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    //  options.url = 'http://www.liulongbin.top:3007' + options.url
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 为有权限 的接口加 headers
    if (options.url.includes('/my/')) {//options.url.indexof('/my/')!==-1 
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        },
            // 全局统一无论成功还是失败都会调用这个回调函数
            options.complete = function (res) {
                // 一定要log下看下条件
                // console.log('我是complate', res);
                if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
                    // 1.清空一下token
                    localStorage.removeItem('token')
                    // 2.跳转界面
                    location.href = '/login.html'
                }
            }
    }
});