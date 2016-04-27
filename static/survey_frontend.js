$(document).ready(function() {
    $.ajax({
        url: "http://localhost:9000/get-courses",
        method: "GET",
        success: function(res) {
            var courses = $.parseJSON(res);
            $("#survey-parts").prepend(
                `<div class='well'>
                  <div class="row">
                    <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-0">
                      <h3 class="text-center">What course are you enrolled in?</h3>
                    </div>
                    <div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0">
                      <div class='form-group' id='part0'>
                        <select class="form-control input-lg" name="c_id">
                          <option disabled >Select one</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>`);
            for (var i = 0; i<courses.length; i++) {
              $("#part0 select").append(`<option value='${courses[i].c_ID}'>
                  ${courses[i].course_code.toUpperCase()} taught by ${courses[i].professor}</option>`);
            }
        }
    });
    $.ajax({
        url: "http://localhost:9000/get-questions",
        method: "GET",
        success: function(res) {
            var questions = $.parseJSON(res);
            for (var i = 0; i<questions.length; i++){
                var question = $(`
<div class="well">
  <div class="row">
    <div class="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-0">
      <h3 class='text-center'>${questions[i].q_text}</h3>
    </div>
    <div class="col-xs-10 col-xs-offset-1 col-md-4 col-md-offset-0">
      <div class='form-group' id='part${i+1}'>
        <select class="form-control input-lg" name="q${i + 1}">
          <option disabled >Select one</option>
        </select>
      </div>
    </div>
  </div>
</div>`);
                $("#survey-parts").append(question);
                for (var j = 1; j <= 5; j++) {
                    $(("#part" + (i+1)) + " select").append(
                        `<option value="${j}">
${questions[i]["R" + j]}</option>`);
                }
            }
        }
    });
    $(".formSubmit").click(function(e) {
        e.preventDefault();
        function validQuestion(resp) {
            return 0 < resp && resp <= 5;
        }
        function validateForm(form) {
            return Boolean($(form).find("#part0 select").val());
        }
        $.ajax({
            url: "http://localhost:9000/post-responses?" + $("#survey").serialize(),
            method: "POST",
            data: $("#survey").serialize(),
            success: function (res) {
                alert("Thank you!");
            }
        })
    })
})
