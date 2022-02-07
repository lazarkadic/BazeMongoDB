$(function(){

    const BASE_URL = "http://localhost:8080";

    $("#logout").click(function(){
      localStorage.removeItem("authdata");
      localStorage.removeItem("user"); 
    });

    $("#btnNewPoll").click(function(){          // jos u test fazi, radi sa statickim unosom za fiksno 3 odgovora
                                                
        $("#exampleModal").modal('show');
        $(".pollQuestion").val('');
        $(".pollAnswer1").val('');
        $(".pollAnswer2").val('');
        $(".pollAnswer3").val('');
    });

    $("#btnOk").click(function(){          // jos u test fazi, radi sa statickim unosom za fiksno 3 odgovora                                   
      $("#errorModal").modal('hide');
  });

    $("#btnAdd").click(function(){         

      var poll = {};

      poll.question = $(".pollQuestion").val();

      var answers = [];
      answers[0] = $(".pollAnswer1").val();
      answers[1] = $(".pollAnswer2").val();
      answers[2] = $(".pollAnswer3").val();

      poll.answers = answers;

      // console.log(poll.question);
      //     console.log(poll.answers[0]);
      //     console.log(poll.answers[1]);
      //     console.log(poll.answers[2]);

      //console.log(JSON.stringify(poll));
      //console.log(JSON.parse(JSON.stringify(poll)));

      if(poll.question != '' && poll.answers[0] != '' && poll.answers[1] != '' && poll.answers[2] != '')
      {
          console.log(poll.question);
          console.log(poll.answers[0]);
          console.log(poll.answers[1]);
          console.log(poll.answers[2]);

          addPoll(poll);
          $("#exampleModal").modal('hide');  
      }
  }); 
          var userId = "";
          var userAndPass = window.atob(localStorage.getItem('authdata'));
          var userOnly = userAndPass.substring(0, userAndPass.search(":"));
          var getUserId = function(){
              $.ajaxSetup({
                headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
                'Accept': 'application/json',
                'Content-Type': 'application/json'}
              });
              $.get(BASE_URL + "/user/u/" + userOnly, function (data, status) {
                userId = data.id;
              });
            }

        getUserId();


    $('#polls').on('click','.btnAddVote', function () {
        var id = $(this).prop('id');     
        var checkRadio = document.querySelector(`input[name="${id}"]:checked`);

        if(checkRadio != null){
          var answ = $(checkRadio).prop('id');
          $.ajaxSetup({
            headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
            'Accept': 'application/json',
            'Content-Type': 'application/json'}
          });
          $.ajax({
            type: "PUT",
            url: BASE_URL + "/poll/" + id + "/" + answ + "/" + userId,
            success: function (data) {                
                console.log(data);
                loadPolls();
                //refresh();
            }
          }).done(function () {
            $("#errorModal").modal('show');
            $("#errorModalTitle").text("Congratulations!");
            $("#errorModalLabel").text("You successfully voted on this poll");
          }).fail(function () {
            $("#errorModal").modal('show');
            $("#errorModalTitle").text("Be careful!");
            $("#errorModalLabel").text("You already voted on this poll");
          }); 
        }
    });

    var delId = "";
    $('#polls').on('click','.removeBttn', function () {
        
      delId = $(this).prop('id');        
      console.log(delId);    

    });

    $("#btnCancel").click(function(){
        delId = "";
        console.log(delId);
    });

    $("#btnDelete").click(function(){
        if(delId != ""){
            $.ajaxSetup({
              headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
              'Accept': 'application/json',
              'Content-Type': 'application/json'}
            });
            $.ajax({
                type: "DELETE",
                url: BASE_URL + "/poll/" + delId,
                success: function (data) {                
                  console.log(data);
                  loadPolls();
                  
                }
            });
            console.log('posle ajaxa  '+delId )
        }
        else{
            delId="";
        }
    });

    var addPoll = function(poll) {
      $.ajaxSetup({
        headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      });
      $.post(BASE_URL + "/poll", JSON.stringify(poll))
      .done(function (data) {
          loadPolls();
          //alert("Proslo");
      });
    };

    var loadPolls = function(){
      $.ajaxSetup({
        headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
        'Accept': 'application/json',
        'Content-Type': 'application/json'}
      });
      $.get(BASE_URL + "/poll", function (data, status) {
        printPolls(data);
      });

    };

    loadPolls();
    var refresh = function(){
      location.href = location.href;
    };

    function printPolls(data) {

      var poll = ``;
  
      data.reverse();
      
  
      for (var p of data) {

        var name = " ";
            $.ajax({
                url: BASE_URL + "/user/" + p.userId,
                async: false,
                success: function (data) {
                    name = data.name + " " + data.surname;
                }});

        values = [];
        var totalCount = 0;
        Object.getOwnPropertyNames(p.answers).forEach(
          function (val, idx, array) {
            values[idx] = p.answers[val];
            totalCount += p.answers[val];
          }
          
        );
        var miniDate = new Date(p.created);
        var dateonly = miniDate.toString().substring(0, 15);
        var timeonly = miniDate.toString().substring(15, 21);
        miniDate = dateonly + " /" + timeonly;
        values[3] = miniDate;
        // var date = new Date(p.created);// Milliseconds to date
        // console.log(date.toString());

        //${Object.getOwnPropertyNames(p.answers)[0]} -> ${values[0]}
          poll +=`
            <div class="card card-inverse card-info">
            <div class="card-footer">
                    <label>Posted by: ${name}</label>
                    <button id=${p.id} type="button" class="removeBttn close" data-toggle="modal" data-target="#deleteModal">
                    <span aria-hidden="true">&times;</span>
              </button>
            </div>
              <div class="card-body">
                <h4 class="card-title">${p.question}</h4>
                  <p class="card-text">
                  <br>
                  <input type="radio" id="${Object.getOwnPropertyNames(p.answers)[0]}" name="${p.id}" value="${Object.getOwnPropertyNames(p.answers)[0]}">
                  <label for="${Object.getOwnPropertyNames(p.answers)[0]}">${Object.getOwnPropertyNames(p.answers)[0]}</label><label class="float-right">(${values[0]})</label>
                  <div class="progress" style="height: 10px">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${values[0]*10}" aria-valuemin="0" aria-valuemax="100" style="width: ${values[0]*10}%"></div>
                  </div><br>
                  </p>
                  <p class="card-text">
                  <input type="radio" id="${Object.getOwnPropertyNames(p.answers)[1]}" name="${p.id}" value="${Object.getOwnPropertyNames(p.answers)[1]}">
                  <label for="${Object.getOwnPropertyNames(p.answers)[1]}">${Object.getOwnPropertyNames(p.answers)[1]}</label><label class="float-right">(${values[1]})</label>
                  <div class="progress" style="height: 10px">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${values[1]*10}" aria-valuemin="0" aria-valuemax="100" style="width: ${values[1]*10}%"></div>
                  </div><br>
                  </p>
                  <p class="card-text">
                  <input type="radio" id="${Object.getOwnPropertyNames(p.answers)[2]}" name="${p.id}" value="${Object.getOwnPropertyNames(p.answers)[2]}">
                  <label for="${Object.getOwnPropertyNames(p.answers)[2]}">${Object.getOwnPropertyNames(p.answers)[2]}</label><label class="float-right">(${values[2]})</label>
                  <div class="progress" style="height: 10px">
                  <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="${values[2]*10}" aria-valuemin="0" aria-valuemax="100" style="width: ${values[2]*10}%"></div>
                  </div>
                  <br>
                  <label>Total votes: ${totalCount}</label>
                  <br>
                  <label>Creation date: ${values[3].toString()}</label>
                  <button id="${p.id}" type="button" class="btn btn-round float-right btnAddVote">Add vote</button><br>
                  </p>
              </div>
            </div>`;
      }
      $("#polls").html(poll);
  }
});              