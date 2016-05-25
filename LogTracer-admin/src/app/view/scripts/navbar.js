$('document').ready(function(){
	$('#logoutIcon').hide();
	if(localStorage.getItem('token') != null){
		$("#loginIcon").hide();
		$("#signupIcon").hide();
		$("#logoutIcon").show();
	}
	$("#logoutIcon").on('click', function() {
		localStorage.clear();
	});
});