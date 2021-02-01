var layer = layui.layer
var form = layui.form

// 定义一个查询的参数对象，将请求数据的时候，需呀将请求参数对象提交到服务器
var q = {
    pagenum: '1',//页码值
    pagesize: '2',//	每页显示多少条数据
    cate_id: '',//	文章分类的 Id
    state: '',//文章的状态，可选值有：已发布、草稿
}


// 获取列表渲染到页面--初始化表格
renderHtml()

function renderHtml() {
    $.ajax({
        type: 'get',
        url: '/my/article/list',
        data: q,
        success(res) {
            if (res.status !== 0) {
                return console.log(res);
            }
            var row = []
            $.each(res.data, function (index, value) {
                // <button type="button" data_id="${value.Id}" class="layui-btn layui-btn-sm btn_edit">编辑</button>
                // 实现编辑效果跳转,加a标签 

                row.push(
                    `<tr>
                        <td>${value.title}</td>
                        <td>${value.cate_name}</td>
                        <td>${getTimer(value.pub_date)}</td>
                        <td>${value.state}</td>
                        <td>
                            <button type="button" data_id="${value.Id}" class="layui-btn layui-btn-sm btn_edit">编辑</button>
                            <button type="button" data_id="${value.Id}" class="layui-btn layui-btn-sm layui-btn-danger btn_del">删除</button>
                            </td>
                    </tr>
                    `
                )
            });
            $('tbody').html(row);
            console.log(res);
            // 将数据的总条数传送到分页渲染中
            renderPage(res.total)
        }
    })
}

// 处理发布时间函数--美化时间数据
function getTimer(dtstr) {
    var date = new Date(dtstr);

    var y = date.getFullYear().toString().padStart(2, 0);
    var m = (date.getMonth() + 1).toString().padStart(2, 0);
    var d = date.getDate().toString().padStart(2, 0);

    var hh = date.getHours().toString().padStart(2, 0);
    var mm = date.getMinutes().toString().padStart(2, 0);
    var ss = date.getSeconds().toString().padStart(2, 0);
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// 获取文章分类列表--下拉框内容
getClassify()
function getClassify() {
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

// 监听表单实现筛选
$('.layui-form').on('submit', function (e) {
    e.preventDefault();
    // 获取表单里面的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 给q对象里面的值进行赋值--获得筛选后的数据
    q.cate_id = cate_id;
    q.state = state;
    // 重新渲染界面--实现筛选
    renderHtml()

})





// 渲染分页结构
function renderPage(total) {
    // 分页页码
    layui.use('laypage', function () {
        var laypage = layui.laypage;

        //执行一个laypage实例
        laypage.render({
            elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total //数据总数，从服务端得到
            , limit: q.pagesize//每页显示数据
            , limits: [2, 4, 6, 8]
            , curr: q.pagenum //默认所在页面
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            // 触发jump回调两种方式: 1.点击页码触发,     2.执行aypage.render()方法触发
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // renderHtml();写这里会出现死闭包现像
                //首次不执行
                if (!first) {//点击页码时，first值为undefined
                    //do something
                    renderHtml();//根据最新的q渲染列表
                }
            }
        });
    });
}



//实现删除操作
$('tbody').on('click', '.btn_del', function () {
    var id = $(this).attr('data_id')
    // 获取删除按钮的个数
    var num = $('.btn_del').length
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
        //do something
        $.ajax({
            type: 'get',
            url: '/my/article/delete/' + id,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 当数据删除完成后，需要判断当前这一也中是否还有数据
                // --怎样判断当前页面中还有数据？-----判断页面中的删除按钮个数---获取删除按钮个数
                if (num == 1) {
                    // 页码值最必须是1
                    q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                }
                renderHtml()

            }
        })
        layer.close(index);
    });


})

