$(document).ready(function() {
 	$('#submit').click(function () {

 		if ($('#SID').val() == '') 
 			$("#error").html("<span style='color:red'>请输入学号!</span>");
 		else if ($('#password').val() == '')
 			$('#error').html("<span style='color:red'>请输入密码!</span>");
 		else
 		{
			

	 		$("#divform").css("display","none");
	 		$("#content_menu").css("display","block");

			var xhr = new XMLHttpRequest(); 
		    xhr.onload = function () { 
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
			
	            var res = JSON.parse(xhr.responseText);
	            //alert(xhr.responseText);
	            //console.log(global)
	            if (res.errcode && res.errcode == 1) {
	                if (res.errmsg == "wrong SID or password"){
	                	$("#insubmit").css("display","none");
	                	$("#body").html("<div align=center>帐号或密码输入有误,请重新输入!</div>")
	                }
	                else if (res.errmsg == "cannot search"){
	                	$("#insubmit").css("display","none");
	                	$("#body").html("<div align=center>成绩无法查询,请登录教务网查看原因!</div>")
	                }										
	            }else{
	            	grade_info = res;
	            	//console.log(grade_info);
	            	grade(); 
	            }

	        }else{alert("try again");}
	   		}

		    var purl = "http://112.74.93.4:8001/grade";
		    var teamnumber;
	 		var select = $("#select").val();
	 		//alert(select);
	 		if (select == "2014-2015 第一学期")teamnumber = "0";
	 		else if (select == "2014-2015 第二学期")teamnumber = "1";

		    var postdata = "SID=" + $('#SID').val() + "&password=" + $('#password').val() + "&teamnumber=" + teamnumber
		    url = purl + "?" + postdata
		    xhr.open('post', url, false); // synchronous
		    xhr.send();

		    String.format();
	 	}
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