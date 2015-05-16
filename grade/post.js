$(document).ready(function() {
 	
	//$("#divform").css("display","none");
	//$("#content_menu").css("display","block");
	$(function() {
	$('#submit').click(function(e){
		if ($('#SID').val() == '') 
 			$("#error").html("<span style='color:red'>请输入学号!</span>");
 		else if ($('#password').val() == '')
 			$('#error').html("<span style='color:red'>请输入密码!</span>");
 		else
 		{
			
	 		

			var teamnumber;
		 	var select = $("#select").val();
		 	if (select == "2014-2015 第一学期")teamnumber = "0";
		 	else if (select == "2014-2015 第二学期")teamnumber = "1";
		 	e.preventDefault();
		 	var l = Ladda.create(this);
		 	l.start();

		 	$.post("http://112.74.93.4:8001/grade", 
		 	    { "SID":$("#SID").val(),
		 	      "password":$("#password").val(),
		 	      "teamnumber":teamnumber 
		 	  	},
		 	  function(response){
		 	  	console.log(response);
		 	  	if (response.errcode && response.errcode == 1){
		 	  		if (response.errmsg == "wrong SID or password"){
	                	$("#body").html("<div align=center>帐号或密码输入有误,请重新输入!</div>")
	                }
	                else if (response.errmsg == "cannot search"){
	                	$("#body").html("<div align=center>成绩无法查询,请登录教务网查看原因!</div>")
	                }										
		 	  	}else{
			 	  	$("#divform").css("display","none");
		 			$("#content_menu").css("display","block");
			 	    grade_info = response;
			 	    grade();
		 	  	}
		 	  	
		 	  }, "json")
		 	.always(function() { l.stop(); });
		 	return false;
		 }
	});
});

});

String.format = function() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for ( var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
	};	