$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 上传文件按钮
    var layer = layui.layer
    $('#upload').on('click', function () {
        $('#up').click();
    })

    // 将图片渲染到裁剪区
    $('#up').on('change', function (e) {
        if (e.target.files.length === 0) {
            return layer.msg("请上传图片")
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    $('#sure').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "post",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL ,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                window.parent.getUserinfo();
                layer.msg(res.message)
            }
        });
    })


})


/*
var layer = layui.layer
layui.use('upload', function () {
    var upload = layui.upload;

    //执行实例
    var uploadInst = upload.render({
        elem: '#upload',//绑定元素
        method: 'post'
        , url: '/my/update/avatar' //上传接口
        , done: function (res) {
            //上传完毕回调
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            console.log(res);
        }
        , error: function () {
            //请求异常回调
            console.log(res.message);
        }
    });
}); */