$('document').ready(function(){
	$.ajaxSetup({
		headers: {'token': localStorage.getItem('token')}
	});
	$("#appName-form").validate({
		rules:
		{
			appName: {
				required: true
			},
		},
		messages:
		{
			appName: {
				required: "please enter application name"
			},
		},
		submitHandler: submitForm
	});

	function submitForm(){
		var appName = $("#appName").val();
		console.log(appName);
		$.ajax({
			type : 'POST',
			url  : 'http://localhost:8080/api/application',
			contentType: "application/json", 
			dataType : 'json', 
			data : JSON.stringify({name : appName}),
		}).fail(function(error){
			if(JSON.parse(error.responseText).errorCode == 5){
				$("#error").html('Application already exists');
			}
			if(JSON.parse(error.responseText).errorCode == 3){
				window.location = "login";
			}
			if(JSON.parse(error.responseText).errorCode == 10){
				$("#error").html(JSON.parse(error.responseText).errors);
			}

		}).done(function(response){
			window.location = "applications"; 
		})
		return false;
	}
});