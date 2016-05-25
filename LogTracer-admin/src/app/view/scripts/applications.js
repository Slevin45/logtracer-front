$(document).ready(function() {
	if(localStorage.getItem('token') == null){
		window.location = "login";
	}
	$.ajaxSetup({
		headers: {'token': localStorage.getItem('token') }
	});
	var table = $('#applications').DataTable( {
		"searching": false,
		"processing": true,
		"serverSide": true,
		"ajax": {
			"url": "http://localhost:8080/api/application",
			"dataSrc" : "applications",
			"error" : errorHandler,
			"dataFilter" : function(data){
            var json = jQuery.parseJSON( data );
            json.recordsTotal = json.recordsTotal;
            json.recordsFiltered = json.recordsTotal;
            json.data = json.list;
 
            return JSON.stringify( json ); // return JSON string
        }
		},

		"columns": [
		{ "data": "id" },
		{ "data": function (data, type, row, meta) {
			return '<a href="logs?appId=' + data.id + '">' + data.name + '</a>';
		} },
		{ "data": "createTimestamp" ,
		"render": function(data){
			var date = new Date(data);
			var month = date.getMonth() + 1;
			return (month.length > 1 ? month : "0" + month) + "/" + date.getDate() + "/" + date.getFullYear();
		}}
		]
		
	} );
	function errorHandler(error){
		if(JSON.parse(error.responseText).errorCode == 3){
			window.location = "login";
		}
		
	}
} );