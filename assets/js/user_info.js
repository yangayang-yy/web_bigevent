$(function () {
    var form = layui.form
    var layer = layui.layer
    // 自定义表单验证
    form.verify({
        nickname: [
            /^[\S]{1,6}$/
            , '昵称必须1到6位之间，且不能出现空格'
        ]
    })
    // 初始化用户应用信息
    initUserInfo();



    // 初始化用户应用信息
    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 渲染数据到input框中---表单赋值---调用form.val()方法
                form.val("formUserinfo", res.data);
                resetInfo(res);
            },
            error() {
                return layer.msg('请求信息失败')
            }
        })
    }



    // 重置表单数据
    function resetInfo(res) {
        $('#btn_reset').on('click', function (e) {
            e.preventDefault();
            form.val("formUserinfo", res.data);
        })
    }

    // 跟新数据信息
    $('#userInfo').on('submit', function (e) {
        e.preventDefault();
        data = $(this).serialize();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: data,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                console.log(res);
                layer.msg('更新用户信息成功！')
                // 调用父页中方法，重新渲染图像和欢迎用户信息
                // 我们这个页面是听过iframe标签实现的，window是user_info,parent就是父页面index
                window.parent.getUserinfo();
            },
            error() {
                return layer.msg('请求信息失败')
            }
        })

    })


})




// 注：
//给表单赋值
/* form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
"username": "贤心" // "name": "value"
,"sex": "女"
,"auth": 3
,"check[write]": true
,"open": false
,"desc": "我爱layui"
}); */


 // 自定义表单验证
/*  form.verify({
    nickname: [
        /^[\S]{1,6}$/
        , '昵称必须1到6位之间，且不能出现空格'
    ]
}) */