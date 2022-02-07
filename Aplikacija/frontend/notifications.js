import { AuthenticationService } from './authservice.js';

$(function () {

    const service = new AuthenticationService();

    service.setDefaultHeader();

    getAndPrintNotifications();

    $("#logout").click(function () {
        service.logout();
    });

    $('#newnotice').click(function () {
        $("#pollModal").modal('show');
        $(".noticeTitle").val('');
        $(".noticeText").val('');
    });

    $('#btnAddNotice').click(function () {

        var notice = {};
        notice.title = $(".noticeTitle").val();
        notice.text = $(".noticeText").val();

        if (notice.title != '' && notice.text != '') {

            $.post(service.BASE_URL + "/notification", JSON.stringify(notice))
                .done(function (data) {
                    getAndPrintNotifications();
                });
        }
        $("#pollModal").modal('hide');
    });

    $('.cards').on('click', '.likeBttn', function () {

        var id = $(this).prop('id');

        $.ajax({
            type: "PUT",
            url: service.BASE_URL + "/notification/" + id,
            success: function (data) {
                getAndPrintNotifications();
            }
        });
    });

    var delId = "";

    $('.cards').on('click', '.removeBttn', function () {

        delId = $(this).prop('id');
    });

    $("#nevermind").click(function () {

        delId = "";
    });

    $("#modalRemove").click(function () {

        if (delId != "") {

            $.ajax({
                type: "DELETE",
                url: service.BASE_URL + "/notification/" + delId,
                success: function (data) {
                    getAndPrintNotifications();
                }
            });
        }
        else {
            delId = "";
        }
        $("#deleteModal").modal("hide");
    });

    function getAndPrintNotifications() {

        var authorId = '';
        var user = {};

        $.get(service.BASE_URL + "/user/u/" + atob(localStorage.getItem('user')), function (data) {

            user = data;

        }).done(function () {
            $.get(service.BASE_URL + "/user/u/" + atob(localStorage.getItem('user')), function (data) {

                authorId = data.id;

            }).done(function () {

                $.get(service.BASE_URL + "/notification", function (data, status) {

                    printNotifications(data);

                    if (user.roles.pop() === 'UPRAVNIK') {
                        $(".removeBttn").show();
                    }
                    else {
                        $('.' + authorId).show();
                    }
                });
            });
        });
    }

    function printNotifications(data) {

        var notice = ``;

        data.reverse();

        for (var d of data) {

            var name = " ";
            $.ajax({
                url: service.BASE_URL + "/user/" + d.userId,
                async: false,
                success: function (data) {
                    name = data.name + " " + data.surname;
                }
            });

            var miniDate = new Date(d.created);
            var dateonly = miniDate.toString().substring(0, 15);
            var timeonly = miniDate.toString().substring(15, 21);
            miniDate = dateonly + " /" + timeonly;

            notice += `
        <div class="containter">
            <div class="card card-inverse card-info">
                <div class="card-footer">
                    <label>Posted by: ${name}</label>                    
                    <button type="button" class="removeBttn close ${d.userId}" id=${d.id} data-toggle="modal" data-target="#deleteModal">                    
                    <span aria-hidden="true">&times;</span></button>
                    <br>
                    <label>Creation date: ${miniDate.toString()}</label>
                </div>
                <div class="card-body">
                    <h4 class="card-title">${d.title}</h4>
                    <br/>
                    <p class="card-text">${d.text}</p>
                </div>
                <div class="card-footer">
                    <small>${d.likes} hearts</small>                    
                    <button type="button" id="${d.id}" class="likeBttn btn btn-danger btn-round float-right btn-sm "><i class="fa fa-heart"></i></button>                  
                </div>
            </div>
        </div>`;
        }
        $(".cards").html(notice);
        $(".removeBttn").hide();
    }
});

