
    // 调用获取用户信息函数
    getUserinfo();
    // 设置点击退出功能
    $('#exit').on('click', function (e) {
        var layer = layui.layer
        layer.confirm('确定要退出吗？?', { icon: 3, title: '提示' }, function (index) {
            //1.清空 localStorage 中的token
            localStorage.removeItem('token')
            // 2.跳转网页
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });
        /* layer.confirm('您确定要退出吗？', {
            btn: ['确定', '取消'] //可以无限个按钮
            , btn2: function (index, layero) {
                //按钮【按钮二】的回调
                return
            }
        }, function (index, layero) {
            //按钮【按钮一】的回调
            location.href = '/login.html'
        }, */

    })





    // 获取用户信息函数
    function getUserinfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            // headers之前保存的 res.token，写在baseAPI.js中 
            /* headers:{
                Authorization: localStorage.getItem('token') || '',
            }, */
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                renderAvatar(res.data)
            },
            error() {
                console.log('发起请求失败');
            },
            // 无论成功还是失败都会调用这个回调函数,可写在写在baseAPI.js中 
            /* complete(res) {
                // 一定要log下看下条件
                console.log('我是complate', res);
                if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') { 
                    // 1.清空一下token
                    localStorage.removeItem('token')
                    // 2.跳转界面
                    location.href = '/login.html'
                }
            } */
        })
    }

    // 渲染结构
    function renderAvatar(user) {
        var uname = user.nickname || user.username;
        $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)
        if (user.user_pic == null) {
            // 未设置照片时 隐藏照片
            $('.userinfo img').hide()
            // 替换span里面的文字 可直接用 str[0]方式,没必要用截取字符串
            // $('.userinfo .text-avatar').html(uname.substr(0, 1))
            $('.userinfo .text-avatar').html(uname[0].toUpperCase()).show()
        } else {
            // 设置照片时 修改图片的src 属性
            $('.userinfo .text-avatar').hide()
            $('.userinfo img').prop('src', user.user_pic).show()
        }
    }

