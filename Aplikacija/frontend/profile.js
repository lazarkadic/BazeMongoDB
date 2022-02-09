import { AuthenticationService } from './authservice.js';

$(function () {

    const service = new AuthenticationService();
    service.setDefaultHeader();

    var user = {};

    $("#logout").click(function () {
        service.logout();
    });

    $.get(service.BASE_URL + "/user/u/" + atob(localStorage.getItem('user')), function (data) {

        user = data;
        fillInfoAndForm(data);

        if (data.role === 'UPRAVNIK') {
            $(".tabEditUsers").css('display','inline');
        }
    });

    $("#modalUpdateConfirm").click(function () {

        if ($("#confirmpass").val() === $("#newpass").val() && $("#newpass").val() != '') {

            var luser = user;

            luser.username = $("#username").val();
            luser.name = $("#name").val();
            luser.surname = $("#lastname").val();
            luser.password = $("#newpass").val();

            var body = JSON.stringify(luser)
            $.ajax({
                type: "PUT",
                url: service.BASE_URL + "/user/" + user.id,
                data: body,
                success: function (data) {
                    fillInfoAndForm(data);
                    $("#mismatch").html(``);
                    $("#updateModal").modal('hide');
                    $("#newpass").val('');
                    $("#confirmpass").val('');
                    window.location.href = './login.html'
                }
            }).fail(function () {
                var alert = `<div class="alert alert-danger fade show" role="alert">
                Username taken!</div>`;
                $("#mismatch").html(alert);
            });
        }
        else {
            var alert = `<div class="alert alert-danger fade show" role="alert">
            Passwords do not match!</div>`;
            $("#mismatch").html(alert);
        }
        $("#confirmpass").val('');
    });


    $("#nevermind").click(function () {
        $("#mismatch").html('');
        $("#newpass").val('');
    });


    $("#editTab").click(function () {
        $("#newpass").val('');
    });

    getAndFillTable();

    var editid = '';
    var edituser = {};

    $(".tabela").on('click', '.edituser', function () {

        setEditModalForEdit();
        $("#editingError").html('');
        editid = $(this).prop('id');

        $.get(service.BASE_URL + "/user/" + editid, function (data) {

            edituser = data;
            fillEditForm(data);
        });
    });

    $("#buttons").on('click', '#btnEditConfirm', function () {

        $("#editingError").html('');

        if ($("#editusername").val() === '' || $("#editfirstname").val() === '' || $("#editlastname").val() === '' || ($("#editrole").val() != 'UPRAVNIK' && $("#editrole").val() != 'STANAR') || $("#editApnumber").val() === '') {
            var alert = `<div class="alert alert-danger fade show" role="alert">
                Form invalid!</div>`;
            $("#editingError").html(alert);
        }
        else {
            if ($('#editpass').val() === $('#editconfirmpass').val() && $('#editpass').val() != '') {

                edituser.username = $("#editusername").val();
                edituser.name = $("#editfirstname").val();
                edituser.surname = $("#editlastname").val();
                edituser.password = $("#editconfirmpass").val();
                edituser.role = ($("#editrole").val());
                edituser.apartmentNumber = $("#editApnumber").val();

                var body = JSON.stringify(edituser)

                $.ajax({
                    type: "PUT",
                    url: service.BASE_URL + "/user/" + editid,
                    data: body,
                    success: function (data) {

                        fillEditForm(data);
                        getAndFillTable();

                        $("#editingError").html(``);
                        $("#editUserModal").modal('hide');
                    }
                }).fail(function () {
                    var alert = `<div class="alert alert-danger fade show" role="alert">
                Username taken!</div>`;
                    $("#editingError").html(alert);
                });
            }
            else {
                var alert = `<div class="alert alert-danger fade show" role="alert">
            Passwords do not match!</div>`;
                $("#editingError").html(alert);
            }
        }
        $("#editconfirmpass").val('');
        $('#editpass').val('');
    });

    $("#btnClose").click(function () {
        $("#editingError").html('');
    });

    var delId = "";

    $('.tabela').on('click', '.deleteuser', function () {
        delId = $(this).prop('id');
        console.log(delId);
    });

    $("#nevermind").click(function () {
        delId = "";
    });

    $("#modalRemove").click(function () {

        if (delId != "") {
            $.ajax({
                type: "DELETE",
                url: service.BASE_URL + "/user/" + delId,
                success: function (data) {
                    getAndFillTable();
                }
            });
        }
        else {
            delId = "";
        }
        $("#deleteUserModal").modal("hide");
    });

    $("#newuser").click(function () {

        setEditModalForAdd();
        $("#editingError").html('');
        $("#editUserModal").modal('show');
    });

    $("#buttons").on('click', '#btnAddClose', function () {

        $("#editUserModal").modal('hide');
    });

    $("#buttons").on('click', '#btnAddConfirm', function () {

        var adduser = {};

        if ($("#editusername").val() === '' || $("#editfirstname").val() === '' || $("#editlastname").val() === '' || ($("#editrole").val() != 'UPRAVNIK' && $("#editrole").val() != 'STANAR') || $("#editApnumber").val() === '') {
            var alert = `<div class="alert alert-danger fade show" role="alert">
                Form invalid!</div>`;
            $("#editingError").html(alert);
        }
        else {
            if ($('#editpass').val() === $('#editconfirmpass').val() && $('#editpass').val() != '') {

                adduser.username = $("#editusername").val();
                adduser.name = $("#editfirstname").val();
                adduser.surname = $("#editlastname").val();
                adduser.password = $("#editconfirmpass").val();
                adduser.apartmentNumber = $("#editApnumber").val();
                adduser.role = ($("#editrole").val());                

                var body = JSON.stringify(adduser)

                $.ajax({
                    type: "POST",
                    url: service.BASE_URL + "/user",
                    data: body,
                    success: function (data) {

                        getAndFillTable();

                        $("#editingError").html(``);
                        $("#editUserModal").modal('hide');

                    }
                }).fail(function () {
                    var alert = `<div class="alert alert-danger fade show" role="alert">
                Username taken!</div>`;
                    $("#editingError").html(alert);
                });
            }
            else {
                var alert = `<div class="alert alert-danger fade show" role="alert">
            Passwords do not match!</div>`;

                $("#editingError").html(alert);
            }
        }
        $("#editconfirmpass").val('');
        $('#editpass').val('');
    });


    function getAndFillTable() {

        var currentId = '';

        $.get(service.BASE_URL + "/user/u/" + atob(localStorage.getItem('user')), function (data) {

            currentId = data.id;

        }).done(function () {

            $.get(service.BASE_URL + "/user", function (data, status) {

                fillTable(data);
                $("." + currentId).remove();
            });
        });
    }
})

function setEditModalForAdd() {

    $("#editModalLabel").html('Add new user');

    var buttons = `<button id="btnAddClose" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="btnAddConfirm" type="button" class="btn btn-primary">Add new user</button>`;

    $("#buttons").html(buttons);

    $("#editusername").val('');
    $("#editfirstname").val('');
    $("#editlastname").val('');
    $("#editApnumber").val('');
    $("#editrole").val('');
    $("#editpass").val('');
    $("#editconfirmpass").val('');
}

function setEditModalForEdit() {
    $("#editModalLabel").html('Edit user info');

    var buttons = `<button id="btnClose" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button id="btnEditConfirm" type="button" class="btn btn-primary">Confirm</button>
                    `;

    $("#buttons").html(buttons);
}

function fillEditForm(data) {

    $("#editusername").val(data.username);
    $("#editfirstname").val(data.name);
    $("#editlastname").val(data.surname);
    $("#editApnumber").val(data.apartmentNumber);
    $("#editrole").val(data.role);
    $("#editpass").val('');
    $("#editconfirmpass").val('');
}

function fillInfoAndForm(data) {
    $("#naslov").html(data.name + ' ' + data.surname);
    $("#numbera").html(data.apartmentNumber)

    $("#pusername").html(data.username);
    $("#pfirstname").html(data.name);
    $("#plastname").html(data.surname);
    $("#papnumber").html(data.apartmentNumber);

    $("#username").val(data.username);
    $("#name").val(data.name);
    $("#lastname").val(data.surname);
    $("#newpass").val('');
}

function fillTable(data) {

    var tableEntry = ``;

    for (const d of data) {
        tableEntry += `<tr class="${d.id}">
                        <td>${d.username}</td>
                        <td>${d.name}</td>
                        <td>${d.surname}</td>
                        <td>${d.apartmentNumber}</td>
                        <td>${d.role}</td>
                        <td><a id='${d.id}' 
                                type="button" 
                                class='btn btn-info btn-xs edituser m-1' 
                                data-toggle="modal" 
                                data-target="#editUserModal">Edit</a> 
                            <a id='${d.id}' 
                                class="deleteuser btn btn-danger btn-xs m-1"
                                data-toggle="modal" 
                                data-target="#deleteUserModal">Del</a></td>
                    </tr>`
    }
    $(".tabela").html(tableEntry);
}