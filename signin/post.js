var global;
var sglobal;
var gglobal;
var localtime;
$(document).ready(function() {
 	$('#submit').click(function () {
 		//console.log($(this).val());
 		//$(this).attr("value","c");
 		//console.log($(this).attr("value"));
 		if ($('#SID').val() == '') 
 			$("#error").html("<span style='color:red'>请输入学号!</span>");
 		else if ($('#password').val() == '')
 			$('#error').html("<span style='color:red'>请输入密码!</span>");
 		else {
 			document.getElementById("divform").style.display="none";
 			document.getElementById("container").removeAttribute("style");
 			var xhr = new XMLHttpRequest(); 
		    xhr.onload = function () { 
		        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
		            var res = JSON.parse(xhr.responseText);
		            //alert(xhr.responseText);
		            global = res.mkebiao;
		            sglobal = res.skebiao;
		            gglobal = res.gkebiao;
		      
		         	kebiao();
		            //console.log(global)
		            if (res.errcode && res.errcode == 1) {
		                alert('Something wrong! Try again later');
		                alert(res.errmsg);
		            } 
		        }else{alert("try again");}
		    }
		    var purl = "http://202.202.5.174:8000/search";
		    //var data = new FormData();
		    if ($('#tpassword').val() == '') tpassword = $('#password').val()
		    else tpassword = $('#tpassword').val()
		    	
		    var postdata = "SID=" + $('#SID').val() + "&password=" + $('#password').val() + "&tpassword=" + tpassword
		    url = purl + "?" + postdata
		    xhr.open('post', url, false); // synchronous
		    xhr.send();

		    //xhr.open('HEAD',purl,false);
		    //xhr.send();
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