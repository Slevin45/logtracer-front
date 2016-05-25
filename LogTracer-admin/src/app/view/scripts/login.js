$('document').ready(function() { 
  $.validator.addMethod("regx", function(value, element, regexpr) {          
    return regexpr.test(value);
}, "Password should contains 5 characters at least 1 Alphabet and 1 Number");
  $("#login-form").validate({
    rules:
    {
     password: {
       required: true,
       minlength: 5,
       regx : /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/
     },
     login: {
      required: true,
      minlength: 4
    },
  },
  messages:
  {
    password:{
      required: "please enter your password",
      minlength: "password should consists at least of 5 symbols"
    },
    login: { 
      required: "please enter your login address",
      minlength: "login should consists at least of 4 symbols"

    }
  },
  submitHandler: submitForm 
});
  function submitForm()
  {  
   var login = $("#login").val();
   var encodedPassword = md5($("#password").val());

   $.ajax({
     type : 'POST',
     url  : 'https://secret-forest-89408.herokuapp.com/api/anon/login',
     contentType: "application/json",
     dataType : 'json', 
     data : JSON.stringify({login : login, password : encodedPassword}),
   }).fail(function(error){
    if(JSON.parse(error.responseText).errorCode == 2){
      $("#error").html('Bad credentials');
    }
    if(JSON.parse(error.responseText).errorCode == 10){
      $("#error").html(JSON.parse(error.responseText).errors);

    }
  }).done(function(response){
    localStorage.setItem('token', response.token);
    window.location = "main";
  })
  return false;
}

});