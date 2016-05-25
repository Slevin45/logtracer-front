$(document).ready(function(){
	if(localStorage.getItem('token') == null){
		window.location = "login";
	}
	var appId = getParameterByName('appId');
	var logsData = {};
	$.ajaxSetup({
		headers: {'token': localStorage.getItem('token') }
	});

	var table = $('#logs').DataTable( {
		"searching": false,
		"processing": true,
		"serverSide": true,
		"ajax":{
			"url": 'http://localhost:8080/api/api/logs/' + appId,
			"data": function ( d ) {
				return  $.extend(d, logsData);
			},
			"dataSrc" : "logs",
			"error" : errorHandler
		},
		// paging : $("#logs").find('tbody tr').length>10,
		"columns": [
		{ "data": "appId"},
		{ "data": "createTimestamp" ,
		"render": function(data){
			var date = new Date(data);
			var month = date.getMonth() + 1;
			return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
		}},
		{ "data": "message"},
		{ "data": "exception"},
		{ "data": "tag"}
		]
	});
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	$('#logs-form').submit(function(){
		var message = $("#message").val();
		var startDate = Date.parse($("#startDate").val());
		var endDate = Date.parse($("#endDate").val());
		if(message == ""){
			message = undefined;
		}
		if(isNaN(startDate)){
			startDate = undefined;
		}
		if(isNaN(endDate)){
			endDate = undefined;
		}
		logsData.startDate = startDate;
		logsData.endDate = endDate;
		logsData.message = message;
		table.ajax.reload();
		return false;
	});
	function errorHandler(error){
		if(JSON.parse(error.responseText).errorCode == 3){
			window.location = "login";
		}
		if(JSON.parse(error.responseText).errorCode == 4){
			alert('Application not existst');
		}

	}

});