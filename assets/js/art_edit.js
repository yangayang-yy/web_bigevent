$(function () {
    var layer = layui.layer
    var form = layui.form

    /* 实现封面裁剪上传--star */
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 10 / 7,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件按钮
    $('#chosePic').on('click', function () {
        $('#up_pic').click();
    })

    // 将图片渲染到裁剪区
    $('#up_pic').on('change', function (e) {
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
    /* 实现封面裁剪上传--end */

    // 初始化富文本编辑器
    initEditor()
    




})