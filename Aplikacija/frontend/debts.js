import { AuthenticationService } from './authservice.js';

$(function () {

    const service = new AuthenticationService();
    var a = "";
    var user = {};

    service.setDefaultHeader();
    getAllDebts();
    addOptions();


    $("#logout").click(function () {
        service.logout();
    });


    //  EDIT
    $('.tabela').on('click', '.edit', function () {
        a = $(this).prop('id');
        $.get(service.BASE_URL + "/debt/" + a, function (data) {
            $("#electricity").val(data.electricity);
            $("#water").val(data.water);
            $("#unitedBills").val(data.unitedBills);
            $("#buildingBills").val(data.buildingBills);
            $("#other").val(data.other);
            var user = $.parseJSON($.ajax({
                url: service.BASE_URL + "/user/" + data.userId,
                dataType: "json",
                async: false
            }).responseText);
            var apNum = user.apartmentNumber;
            (document.querySelector('#default')).selected = false;
            document.getElementById(apNum).selected = true;
            (document.querySelector('#forSelect')).style.visibility = 'hidden';
            (document.querySelector('#forLabel')).style.visibility = 'hidden';
            $("#modalTitle").html("Edit debt");
            $("#modal").modal('show');
        });
    });


    //  ADD
    $("#add").click(function () {
        (document.querySelector('#forSelect')).style.visibility = 'visible';
        (document.querySelector('#forLabel')).style.visibility = 'visible';
        (document.querySelector('#default')).selected = true;
        $("#modalTitle").html("Add debt");
        $("#electricity").val("");
        $("#water").val("");
        $("#unitedBills").val("");
        $("#buildingBills").val("");
        $("#other").val("");
        $("#modal").modal('show');
    });


    //  SAVE
    $("#saveDebt").click(function () {
        var uid = (document.querySelector('#select')).value;
        var el = $("#electricity").val();
        var wa = $("#water").val();
        var ub = $("#unitedBills").val();
        var bb = $("#buildingBills").val();
        var ot = $("#other").val();
        var user = $.parseJSON($.ajax({
            url: service.BASE_URL + "/user/a/" + uid,
            dataType: "json",
            async: false
        }).responseText);
        if (el != "" && wa != "" && ub != "" && bb != "" && ot != "" && uid != "default") {
                var json = "{\"electricity\":" + el + ", \"water\":" + wa + ", \"unitedBills\":" + ub + ", \"buildingBills\":" + bb + ", \"other\":" + ot + ", \"userId\":\"" + user.id + "\"}";
                $.ajax({
                    type: "POST",
                    url: service.BASE_URL + "/debt",
                    data: json,
                    success: function (data) {                
                        $("#modal").modal('hide');
                        getAllDebts();
                    }
                }).fail(function () {
                    $("#tekst").html("Debt that already exists cannot be added!");
                    $("#alertModal").modal('show');
                    $("#modal").modal('hide');
                    });
        } else if (el != "" && wa != "" && ub != "" && bb != "" && ot != "" && uid == "default") {
                var json = "{\"electricity\":" + el + ", \"water\":" + wa + ", \"unitedBills\":" + ub + ", \"buildingBills\":" + bb + ", \"other\":" + ot + "}";
                $.ajax({
                    type: "PUT",
                    url: service.BASE_URL + "/debt/" + a,
                    data: json,
                    success: function () {
                        $("#modal").modal('hide');
                        getAllDebts();
                    }
                });
        } else {
            $("#tekst").html("Incorrectly filled out form!");
            $("#alertModal").modal('show');
        }
    });


    $("#okay").click(function () {
        $("#alertModal").modal("hide");
    });


    //  DELETE
    var delId = "";
    $('.tabela').on('click', '.del', function () {  //zato sto su docrtavana mora da se pristupi prvo roditelju
        delId = $(this).prop('id');
        $("#deleteModal").modal('show');
    });


    $("#nevermind").click(function () {
        delId = "";
    });


    $("#modalRemove").click(function () {
        if (delId != "") {
            $.ajax({
                type: "DELETE",
                url: service.BASE_URL + "/debt/" + delId,
                success: function (data) {
                    getAllDebts();
                }
            });
        }
        else {
            delId = "";
        }
        $("#deleteModal").modal("hide");
    });


    //Dodavanje broja stana u padajucem meniju
    function addOptions() {
        $.get(service.BASE_URL + "/user", function (data) {
            var tableHTML = "<option id=\"default\" value=\"default\" =>Open this select menu</option>";
            for (var i = 0; i < data.length; i++) {
                tableHTML += "<option id=\"" + data[i].apartmentNumber + "\" value=\"" + data[i].apartmentNumber + "\">" + data[i].apartmentNumber + "</option>";
            }
            $("#select").html(tableHTML);
        }
        );
    }


    //prikaz svih dugovanja
    function getAllDebts() {

        $.get(service.BASE_URL + "/debt", function (data) {
            fillTable(data);
        }).done(function () {

            $.get(service.BASE_URL + "/user/u/" + atob(localStorage.getItem('user')), function (data) {
                
                var role = data.role
                if (role === 'UPRAVNIK') {
                    $(".dugmici").show();
                }
            });
        });
    }



    function fillTable(data) {
        var zaSortiranje = new Array();
        var HTML = ``;

        for (var d of data) {
            var apNum = "";
            $.ajax({
                url: service.BASE_URL + "/user/" + d.userId,
                async: false,
                success: function (data) {
                    apNum = data.apartmentNumber;
                }
            });

            var tableHTML = `
            <tr id=${apNum} class="tableRow">
                <td>${apNum}</td>                                
                <td>${d.electricity}</td>
                <td>${d.water}</td>
                <td>${d.buildingBills}</td>
                <td>${d.unitedBills}</td>
                <td>${d.other}</td> 
                <td class="dugmici" style="display: none;"><button id="${d.id}" type="button" class="edit btn btn-info m-1">Edit</button> <button id="${d.id}" type="button" class="del btn btn-danger m-1">Del</button></td>
            </tr>`;
            var unos= { apartNum:apNum, text:tableHTML };
            zaSortiranje.push(unos);
        }
        zaSortiranje.sort(function(a,b){
            if(a.apartNum < b.apartNum){
                return -1;
            }
            if(a.apartNum > b.apartNum){
                return 1;
            }
            return 0;
        });
        for(var o of zaSortiranje){
            HTML += o.text;
        }
        
        $(".tabela").html(HTML);
    }
});