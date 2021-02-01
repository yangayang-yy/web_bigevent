var layer = layui.layer
var form = layui.form

renderHtml();

function renderHtml() {
    $.ajax({
        type: 'get',
        url: '/my/article/cates',
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            } else {
                var row = [];
                $.each(res.data, function (i, item) {
                    row.push(
                        `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                        <button type="button" data-id="${item.Id}" class="layui-btn layui-btn-sm btn_edit">编辑</button>
                        <button type="button" data-id="${item.Id}" class="layui-btn layui-btn-sm layui-btn-danger btn_del">删除</button>
                    </td>
                </tr>
                `)
                })
                $('tbody').html(row)
            }
        }
    })
}

// 给添加按钮添加事件，弹出弹框，layui
var index = null;
$('#add').on('click', function () {
    index = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '添加文章分类',
        content: $('#dialog-add').html(),
        shadeClose: true
    })
})


// 以代理的方式给添加表单表单加事件监听
$('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/my/article/addcates',
        data: $('.layui-form').serialize(),
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            layer.close(index)
            renderHtml();
        },
        error(res) {
            layer.msg(res.message);
        }
    })
})


// 绑定删除事件
$('tbody').on('click', '.btn_del', function () {
    var id = $(this).attr('data-id')
    console.log(id);
    //eg1
    layer.confirm('是否确定删除？', { icon: 3, title: '提示' }, function (index) {

        //发起ajax请求，删除数据
        $.ajax({
            type: 'GET',
            url: '/my/article/deletecate/' + id,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                renderHtml();
                layer.msg(res.message);
            },
            error() {
                layer.msg(res.message);
            }
        })
        layer.close(index);

    });

})


// 绑定编辑事件按钮
var index1 = null;
$('tbody').on('click', '.btn_edit', function () {
    index1 = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: $('#dialog-edit').html(),
        shadeClose: true
    })

    var id = $(this).attr('data-id')
    //发起ajax请求，根据 Id 获取文章分类数据
    $.ajax({
        type: 'GET',
        url: '/my/article/cates/' + id,
        success(res) {
            if (res.status !== 0) {
                return console.log(res);
            }
            //给表单赋值
            form.val("form-edit", res.data);
            console.log(res)
        },
        error() {
            console.log(res.message);
        }
    })
    layer.close(index);

});

// 为修改编辑表单添加submit事件
$('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    var data = form.val("form-edit")
    $.ajax({
        type: 'post',
        url: '/my/article/updatecate',
        data: data,
        success(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            renderHtml();
            layer.close(index1)
            layer.msg(res.message);
        },
        error() {
            layer.msg(res.message);
        }
    })
})










//给表单赋值
/* form.val("formTest", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
  "username": "贤心" // "name": "value"
  ,"sex": "女"
  ,"auth": 3
  ,"check[write]": true
  ,"open": false
  ,"desc": "我爱layui"
}); */