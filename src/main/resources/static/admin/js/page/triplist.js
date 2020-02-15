$(function () {
    var totalRecord,currentPage,totalPage;
    //1.显示所有数据
    to_page(1);
    //2.添加用户
    addUser();
    //3.修改用户
    reviseUser();
    //4.单个删除用户
    deleteUser();

    /**
     * 1.显示所用用户
     * @param pn
     */
    function to_page(pn) {

        $.ajax({
            url: "http://localhost:8080/getalltripsforadmin",
            data:"pn="+pn,
            type: "GET",
            dataType: "json",
            contentType:"application/json;charset=UTF-8",
            success: function (result) {
                //alert(result.msg);
                //解析并显示员工数据表
                build_trips_table(result)

                //2.解析并显示分页信息
                build_page_info(result);

                //3.解析并显示分页条数据
                build_page_nav(result);
            }
        })
    }

    /**
     * 解析并显示员工数据表
     * @param data
     */
    function build_trips_table(result) {
        //清空table表格
        $("#trips_table tbody").empty();
        var trips = result.data.list;

        //遍历元素
        $.each(trips, function (index, item) {
            var checkBox=$("<td><input type='checkbox' class='check_item'/></td>");
            var id = $("<td></td>").append(item.id);
            var orginLocation = $("<td></td>").append(item.orginLocation);
            var destinationLocation = $("<td></td>").append(item.destinationLocation);
            var startTime = $("<td></td>").append(item.startTime);
            var reachTime = $("<td></td>").append(item.reachTime);
            var carNum = $("<td></td>").append(item.carNum);
            var ticketPrice = $("<td></td>").append(item.ticketPrice);
            var ticketNum = $("<td></td>").append(item.ticketNum);

            var button1 = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn").append($("<span></span>").addClass("glyphicon glyphicon-pencil").attr("aria-hidden", true)).append("编辑");
            var button2 = $("<button></button>").addClass("tn btn-danger btn-sm delete_btn").append($("<span></span>").addClass("glyphicon glyphicon-trash").attr("aria-hidden", true)).append("删除");
            var td_btn = $("<td></td>").append(button1).append(" ").append(button2);
            $("<tr></tr>").append(checkBox).append(id).append(orginLocation).append(destinationLocation).append(startTime).append(reachTime).append(carNum).append(ticketPrice).append(ticketNum)
                .append(td_btn ).appendTo("#trips_table tbody");

        })
    }

    /**
     * 解析显示分页信息
     * @param data
     */
    function build_page_info(result) {
        $("#page_info_area").empty();
        $("#page_info_area").append("当前" + result.data.pageNum + "页,总共" + result.data.pages +
            "页，总共" + result.data.total + "条记录");
        totalRecord = result.data.total;
        currentPage=result.data.pageNum;
        totalPage = result.data.pages;
    }

    /**
     * 解析显示分页导航条
     * @param data
     */
    function build_page_nav(result) {
        //console.log(result);
        $("#page_nav_area").empty();
        var ul = $("<ul></ul>").addClass("pagination");
        var firstPageLi = $("<li></li>").append($("<a></a>").append("首页").attr("href", "#"));
        var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;").attr("href", "#"));
        var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;").attr("href", "#"));
        var lastPageLi = $("<li></li>").append($("<a></a>").append("末页").attr("href", "#"));
        //如果没有前一页，前一页和首页就不能点
        if (result.data.hasPreviousPage == false) {
            firstPageLi.addClass("disabled");
            prePageLi.addClass("disabled");
        } else {
            //首页
            firstPageLi.click(function () {
                to_page(1);
            });
            prePageLi.click(function () {
                to_page(result.data.pageNum - 1);
            });
        }
        if (result.data.hasNextPage == false) {
            nextPageLi.addClass("disabled");
            lastPageLi.addClass("disabled");
        } else {
            //构建点击事件
            nextPageLi.click(function () {
                to_page(result.data.pageNum + 1);
            });
            lastPageLi.click(function () {
                to_page(result.data.lastPage);
            })
        }
        //添加首页和前一页
        ul.append(firstPageLi).append(prePageLi);
        //遍历添加页码
        $.each(result.data.navigatepageNums, function (index, item) {
            var numLi = $("<li></li>").append($("<a></a>").append(item).attr("href", "#"));
            //如果是当前选中页面，添加active标识
            if (result.data.pageNum == item) {
                numLi.addClass("active");
            }
            //给每个页码添加点击就跳转
            numLi.click(function () {
                to_page(item);
            });
            ul.append(numLi);
        });
        //添加下一页和末页
        ul.append(nextPageLi).append(lastPageLi);
        var navEle = $("<nav></nav>").append(ul);
        navEle.appendTo("#page_nav_area");
    }

    /**
     * 2.实现新增功能
     * @returns {boolean}
     */
    function addTrip() {

        //为新增按钮添加modal
        $("#trip_add_modal_btn").click(function () {
            //清除表单数据
            $("#tripAddModal form")[0].reset();
            $("#tripAddModal").modal({
                backdrop: "static"
            })
        });

        /**
         * 保存用户信息
         */
        $("#trip_save_btn").click(function () {
            var username = $("#username_add_input").val();
            var password = $("#password_add_input").val();
            var truename = $("#truename_add_input").val();
            var sex =$("input[name=sex]:checked").val();
            var idCardNum =$("#idCardNum_add_input").val();
            var phone =$("#phone_add_input").val();
            var age =$("#age_add_input").val();

            var id= $(this).parent().parent().children("td").eq(1).text();
            //将id的值传递给修改按钮的属性，方便发送Ajax请求
            $("#trip_revise_btn").attr("edit-id",id);
            var username=$(this).parent().parent().children("td").eq(2).text();
            var truename=$(this).parent().parent().children("td").eq(3).text();
            var idCardNum=$(this).parent().parent().children("td").eq(4).text();
            var phone=$(this).parent().parent().children("td").eq(5).text();
            var age=$(this).parent().parent().children("td").eq(6).text();
            var sex=$(this).parent().parent().children("td").eq(7).text();

            //2.发送ajax请求保存员工
            $.ajax({
                url: "http://localhost:8080/saveTrip",
                type: "POST",
                data: JSON.stringify({username:username,password:password, trueName:truename,sex:sex,idCardNum:idCardNum,phoneNum:phone,age:age}),
                dataType:"json",
                contentType:"application/json;charset=UTF-8",
                success: function (result) {
                    if (result.code == 200 && result.data.message == "success"){
                        //1.关闭modal框
                        $("#tripAddModal").modal('hide');
                        //2.来到最后一页，显示刚才保存的数据
                        to_page(totalPage);
                    }else {
                        //1.关闭modal框
                        $("#tripAddModal").modal('hide');
                        alert(result.data.message);
                    }
                }
            });
        });
    }

    /**
     * 3.修改用户
     */
    function reviseUser() {
        //为编辑按钮绑定弹出modal框事件
        //1.因为在按钮创建之前就绑定了click，所以用普通click方法绑定不上

        $(document).on("click",".edit_btn",function () {
            //清除表单数据
            $("#tripReviseModal form")[0].reset();
            $("#username_revise_input").next("span").text("");

            var id= $(this).parent().parent().children("td").eq(1).text();
            //将id的值传递给修改按钮的属性，方便发送Ajax请求
            $("#trip_revise_btn").attr("edit-id",id);
            var username=$(this).parent().parent().children("td").eq(2).text();
            var truename=$(this).parent().parent().children("td").eq(3).text();
            var idCardNum=$(this).parent().parent().children("td").eq(4).text();
            var phone=$(this).parent().parent().children("td").eq(5).text();
            var age=$(this).parent().parent().children("td").eq(6).text();
            var sex=$(this).parent().parent().children("td").eq(7).text();


            $("#username_revise_input").val(username);
            $("#truename_revise_input").val(truename);
            $("#idCardNum_revise_input").val(idCardNum);
            $("#phone_revise_input").val(phone);
            $("#age_revise_input").val(age);
            $("#tripReviseModal input[name=sex]").val([sex]);
            $("#tripReviseModal").modal({
                backdrop: "static"
            })
        });
        //2.为模态框中的修改按钮绑定事件，更新员工信息
        $("#trip_revise_btn").click(function () {

            //2.验证通过后发送ajax请求保存更新的员工数据
            //如果要直接发送PUT之类的请求
            //在WEB.xml配置HttpPutFormContentFilter过滤器即可
            //这里未使用如上所述方法
            //获取编辑后的
            var id = $(this).attr("edit-id");
            var username = $("#username_revise_input").val();
            var truename = $("#truename_revise_input").val();
            var sex = $("#tripReviseModal input[name=sex]").val();
            alert(sex);
            var idCardNum =$("#idCardNum_revise_input").val();
            var phone =$("#phone_revise_input").val();
            var age =$("#age_revise_input").val();
            $.ajax({
                url:"http://localhost:8080/updateUser",
                type:"POST",
                data:JSON.stringify({id:id,username:username,trueName:truename,sex:sex,idCardNum:idCardNum,phoneNum:phone,age:age}),
                dataType:"json",
                contentType:"application/json;charset=UTF-8",
                success:function () {
                    //1.关闭modal框
                    $("#tripReviseModal").modal('hide');
                    //2.来到当前页，显示刚才保存的数据
                    to_page(currentPage);

                }
            })

        })
    }

    /**
     * 4.删除用户
     */
    function deleteUser() {
        $(document).on("click",".delete_btn",function () {
            //1.弹出确认删除对话框
            var username=$(this).parents("tr").find("td:eq(2)").text();
            var id=$(this).parents("tr").find("td:eq(1)").text();
            if(confirm("确认删除用户："+username+"吗？")){
                // alert(id);
                //确认，发送ajax请求删除
                $.ajax({
                    url:"http://localhost:8080/deleteUser/"+id,
                    type:"DELETE",
                    success:function (result) {
                        if (result.code == 200 && result.data.message == "success"){
                            alert("删除成功");
                        }
                        to_page(currentPage);
                    }
                })
            }
        })
    }
});