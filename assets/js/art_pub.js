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
    // 获取下拉框的文章类别
    choseClassify()
    function choseClassify() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return console.log(res.message);
                }
                var row1 = ["<option value=''>所有类别</option>"];
                $.each(res.data, function (index, value) {
                    row1.push(
                        `<option value="${value.Id}">${value.name}</option>`
                    )
                });
                $('select[name=cate_id]').html(row1)
                // 通过layui重新渲染layui的结构
                form.render();
            }
        })

    }

    // 给表单添加监听事件,发起请求体（FormData 格式）的ajax请求-----实现数据更改
    var art_state = '已发布';
    $('.btn_draft').on('click', function () {
        art_state = '草稿'
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 创建个FromData
        console.log($(this)[0]);
        var fd = new FormData($(this)[0])
        console.log(fd.get('content'));
        console.log(fd.get('title'));
        fd.append('state', art_state)
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作----添加到表单
                fd.append('cover_img', blob)
                // 发起ajax请求
                console.log(fd);
                /* fd.forEach(function (v, k) {
                    console.log(k, v);
                }) */
                addNewart(fd);
                console.log(fd.getAll());
                form.val("formTest");
            })

    })

    function addNewart(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            // 只要上传文件,以下两个值必须设置成  false！
            // 不修改contentType 属性，使用 FromData默认的contentType 值
            contentType: false,
            // 不对FroData中的数据  进行url编码，而是将   FormData 数据原样发送到服务器
            processData: false,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                location.href = '/article/art_list.html'
            }

        })

    }



   
})



 /*  // 将裁剪后的图片，输出为文件
     $image
     .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
         width: 400,
         height: 280
     })
     .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
         // 得到文件对象后，进行后续的操作
     }) */