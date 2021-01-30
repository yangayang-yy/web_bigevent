//表单验证
var form = layui.form
var layer = layui.layer
form.verify({
    pass: [
        /^[\S]{6,12}$/
        , '密码必须6到12位，且不能出现空格'
    ],
    // 新密码和旧密码不能相同
    same: function (value) {
        if (value == $('input[name=oldPwd]').val()) {
            return '新密码不能和旧密码相同'
        }
    },
    // 确认密码
    sure: function (value) { //value：表单的值、item：表单的DOM对象
        if (value !== $('input[name=newPwd]').val()) {
            return '两次输入密码不一致';
        }

    },
})

// 发送请求修改密码
$('#userPsd').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success(res) {
            if (res.status !== 0) {
                console.log(res);
                return layer.msg(res.message)
            }
            layer.msg(res.message);
            // 重置表单内容
            $('#userPsd')[0].reset();
        }
    })
})



