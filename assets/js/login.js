$(function () {
    // 实现登陆与注册界面切换
    $('#login-box').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#reg-box').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 实现表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        psw: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 通过形参拿到的是确认密码框中的内容
        // 还需要拿到密码框中的内容
        // 然后进行一次等于的判断
        // 如果判断失败,则return一个提示消息即可
        repwd: function (value) {
            var psd = $('.reg-box [name=password]').val()
            if (psd !== value) {
                return '两次输入密码一致'
            }
        }
    })

    // 发起ajax请求用户注册
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                layer.msg(res.message + '请登录')
                $('#reg-box').click()
            }
        })
    })

    // 发起ajax实现用户登录请求
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: {
                username: $('#form_login [name=uname]').val(),
                password: $('#form_login [name=password]').val()
            },
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // console.log(res);
                // console.log(res.token);
                // 将登录成功得到的 token 字符串，保存到 localStorage 中,后面要用
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })

})