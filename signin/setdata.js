
var global_week;
var global_day;
var global_subject;
var global_address;
var global_section;
var bool = new Array();
for (var i=1; i<=6; i++)bool[i] = false;
var now = new Date();
var global_year = now.getFullYear();
var global_month = now.getMonth()+1;
var global_day = now.getDate();

//console.log(global_arr);
function kebiao(){
	for (var i=1; i<=6; i++){
		var tr = "<tr class='tr'>" +
				"<td class='myday section{0}' width='20%'></td>" +
				"<td class='myday subject{1}' width='40%'></td>" +
				"<td class='myday address{2}' width='20%'></td>" +
				"<td class='myday teacher{3}' width='20%'></td>" +
			"</tr>"
		String.format();
		minetr = String.format(tr,i,i,i,i);
		$("table#day").append(minetr)
	}

	//gtime(gglobal);
	setsection();
	setdate();
	mkebiao(global);
	skebiao(sglobal);
	gkebiao(gglobal);
	//mysearch();
}

function setsection(){
	for (var i=1; i<=6; i++){
		var s = 2*i -1;
		var j = s+1;
		var section = s.toString() + "-" + j.toString() + "节";
		$("td.section" + i).append(section)
	}
}
//处理当前时间
function setdate(){
	var date_json = {1:31,2:28,3:31,4:30,5:31,6:31,7:31,8:31,9:30,10:31,11:30,12:31};
	var num_json2 = {"1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","7":"日"}
	var arr = new Array();
	var init_date = new Array();
	var sum=0;
	init_date = [3,2];
	//console.log(global_year);
	arr = [global_month,global_day,global_year];
	var selYear = document.getElementById("selYear");
    var selMonth = document.getElementById("selMonth");
    var selDay = document.getElementById("selDay");
    new DateSelector(selYear, selMonth, selDay, parseInt(arr[2]),parseInt(arr[0]),parseInt(arr[1]));
	for (var i=init_date[0]; i<parseInt(arr[0]); i++) 
		sum += date_json[i];
	now_week = Math.floor((sum+parseInt(arr[1])-init_date[1])/7+1);
	now_day = (sum+parseInt(arr[1])-init_date[1])%7+1;
	global_week = now_week;
	global_day = now_day;
	$("p#date").append("当前查询时间为: " + arr[2] + "年" + arr[0] + "月" + arr[1] + "日" + "  " +"第" + now_week+"周/"+"星期"+num_json2[now_day])
}
//处理主课表
function mkebiao(global){
	var flag_section = new Array();
	var flag_subject = new Array();
	var flag_address = new Array();
	var flag_teacher = new Array();
	var flag_week_two = new Array();
	//var flag_week_three = new Array();
	//to judge what subject is this week
	//console.log(global)
	for (var j=0; j<global.周次.length; j++){
		
		if (global.周次[j].length > 5){
			flag_week_two = global.周次[j].split(",");
			//console.log(flag_week_two.length);
			length = flag_week_two.length;
			for (var t=0; t<length; t++){
				var flag_week_three = new Array();
				var flag_week_four = new Array();
				//console.log(flag_week_two[t]);
				if (flag_week_two[t].indexOf("-") != -1){
					flag_week_three = flag_week_two[t].split("-");
					//console.log(flag_week_two[t]);
					for (var e=parseInt(flag_week_three[0]); e<=parseInt(flag_week_three[1]); e++){
						flag_week_four.push(e.toString());
					}
					//flag_week_two.remove(flag_week_two[t]);
					//console.log(flag_week_three);
					for (var r=0; r<flag_week_four.length; r++)flag_week_two.push(flag_week_four[r]);
				}
			}
			//console.log(flag_week_two);
			for (var q=0; q<flag_week_two.length; q++){
				//
				if (now_week == parseInt(flag_week_two[q])){
					//console.log(parseInt(flag_week_two[q]))
					//console.log(global.课程[j]);
					//console.log(global.地点[j]);
					if (global.课程[j].length == 0){
						//console.log(j);
						//console.log(judge(j));
						judge_num = judge(j);
						global.课程[j] = global.课程[judge_num];
						global.任课教师[j] = global.任课教师[judge_num];
					}
					//处理空课程名的情况
					//console.log(global.任课教师[2]);
					//if (global.任课教师[j].length == 0){global.任课教师[j] = global.任课教师[judge(j)];}
					flag_section.push(global.节次[j]);
					flag_subject.push(global.课程[j]);
					flag_address.push(global.地点[j]);
					flag_teacher.push(global.任课教师[j]);
				}
			}
		}else if (global.周次[j].indexOf("-") != -1) {
			for (var s=parseInt(global.周次[j].split("-")[0]); s<=parseInt(global.周次[j].split("-")[1]); s++){
				if (now_week == s) {
					flag_section.push(global.节次[j]);
					if (global.课程[j].length == 0){
						//console.log(j);
						//console.log(judge(j));
						judge_num = judge(j);
						global.课程[j] = global.课程[judge_num];
						global.任课教师[j] = global.任课教师[judge_num];
					}
					//处理空课程名的情况
					//flag_section.push(global.节次[j]);
					flag_subject.push(global.课程[j]);
					flag_address.push(global.地点[j]);
					flag_teacher.push(global.任课教师[j]);
				}	
			}
		}
		else {
			if (now_week == parseInt(global.周次[j])){
				//console.log(global.课程[j])
				//console.log(global.节次[j])
				if (global.课程[j].length == 0){
						//console.log(j);
						//console.log(judge(j));
					judge_num = judge(j);
					global.课程[j] = global.课程[judge_num];
					global.任课教师[j] = global.任课教师[judge_num];
					}
					//处理空课程名的情况
				flag_section.push(global.节次[j]);
				flag_subject.push(global.课程[j]);
				flag_address.push(global.地点[j]);
				flag_teacher.push(global.任课教师[j]);
			}
		}
	}
	//console.log(flag_subject)
	//console.log(flag_section)
	//to judge what subject is this day
	var num_json = {"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"日":7}
	var this_day_section = new Array();
	var this_day_subject = new Array();
	var this_day_address = new Array();
	var this_day_teacher = new Array();
	var what_week = new Array();

	for (var p=0; p<flag_section.length; p++){
		what_week.push(flag_section[p].split("[")[0]);
	}
	
	//console.log(what_week);
	for (var w=0; w<what_week.length; w++){
		//console.log(now_day)
		//console.log(num_json[what_week[w]])
		//console.log(global_day);
		if (global_day == num_json[what_week[w]]){
			this_day_section.push(flag_section[w]);
			//console.log(this_day_jie)
			this_day_subject.push(flag_subject[w]);
			this_day_address.push(flag_address[w]);
			this_day_teacher.push(flag_teacher[w]);
		}
	}
	global_subject = this_day_subject.slice(0);
	global_address = this_day_address.slice(0);
	global_section = this_day_section.slice(0);
	//console.log(this_day_subject)
	//console.log(this_day_section)
	//var judge_order = new Array();
	for (var x=0; x<this_day_section.length; x++){
		this_day_section[x] = this_day_section[x].split("[")[1].split("]")[0];
		//console.log(this_day_jie);
		left_num = this_day_section[x].split("-")[0];
		right_num = this_day_section[x].split("-")[1].split("节")[0];
		//console.log(right_num)
		//判断课程节数大于2的情况
		if (right_num - left_num >= 2){
			order1 = (parseInt(left_num)+1)/2;
			order2 = (parseInt(left_num)+3)/2;
			bool[order1] = true;
			bool[order2] = true;
			$("td.subject" + order1).append(this_day_subject[x].split("]")[1])
			$("td.address" + order1).append(this_day_address[x])
			$("td.teacher" + order1).append(this_day_teacher[x])
			$("td.subject" + order2).append(this_day_subject[x].split("]")[1])
			$("td.address" + order2).append(this_day_address[x])
			$("td.teacher" + order2).append(this_day_teacher[x])
		}
		else{
			switch (parseInt(right_num)) {
			case 2:
			bool[1] = true
				$("td.subject" + 1).append(this_day_subject[x].split("]")[1])
				$("td.address" + 1).append(this_day_address[x])
				$("td.teacher" + 1).append(this_day_teacher[x])
				break;
			case 4:
				bool[2] = true
				$("td.subject" + 2).append(this_day_subject[x].split("]")[1])
				$("td.address" + 2).append(this_day_address[x])
				$("td.teacher" + 2).append(this_day_teacher[x])
				break;
			case 6:
				bool[3] = true
				$("td.subject" + 3).append(this_day_subject[x].split("]")[1])
				$("td.address" + 3).append(this_day_address[x])
				$("td.teacher" + 3).append(this_day_teacher[x])
				break;
			case 8:
				bool[4] = true
				$("td.subject" + 4).append(this_day_subject[x].split("]")[1])
				$("td.address" + 4).append(this_day_address[x])
				$("td.teacher" + 4).append(this_day_teacher[x])
				break;
			case 10:
				bool[5] = true
				$("td.subject" + 5).append(this_day_subject[x].split("]")[1])
				$("td.address" + 5).append(this_day_address[x])
				$("td.teacher" + 5).append(this_day_teacher[x])
				break;
			default:
				bool[6] = true
				$("td.subject" + 6).append(this_day_subject[x].split("]")[1])
				$("td.address" + 6).append(this_day_address[x])
				$("td.teacher" + 6).append(this_day_teacher[x])
				break;
			}
		}
		
	}
}
//处理实验课表
function skebiao(sglobal) {
	//var s = $("td.myday").val();
	//console.log(s)
	var num_json = {"一":1,"二":2,"三":3,"四":4,"五":5,"六":6,"日":7}
	var this_day_jie = new Array();
	var this_day_subject = new Array();
	var this_day_address = new Array();
	var this_day_teacher = new Array();
	var week = new Array();
	sglobal = JSON.parse(sglobal);
	//console.log(typeof(sglobal));
	//console.log(sglobal);
	var scheduleData = sglobal.schedule;
	//console.log(scheduleData);
	for (var i=0; i<scheduleData.length; i++){
		week = scheduleData[i].w.split(",");
		//console.log(week)
		for (var j=0; j<week.length; j++){
			if (parseInt(week[j]) == global_week){
				//console.log(scheduleData[i].cn);
				the_day = scheduleData[i].ds.split("[")[0].split("周")[1]
				//console.log(the_day);
				left_section_order_string = scheduleData[i].ds.split("-")[0].split("[")[1]
				//console.log(global_subject);
				right_section_order_string = scheduleData[i].ds.split("-")[1].split("]")[0]
				for(var s=0; s<global_address.length; s++){
					//console.log(global_section[s])
					//console.log(scheduleData[i].ds)
					//if (global_section[s].indexOf(scheduleData[i].ds))
					//console.log(scheduleData[i].cn);
					if (global_subject[s].indexOf(scheduleData[i].cn) != -1){
						if (global_address[s].indexOf(scheduleData[i].l) != -1)break;
					}
					
				}
				//console.log(s);
				//console.log(global_subject.length);
				if (num_json[the_day] == global_day && s == global_address.length){
					//console.log(scheduleData[i].cn)
					if (right_section_order_string - left_section_order_string >= 2){
						var sorder = (parseInt(left_section_order_string)+1)/2;
						//console.log(sorder);
						var sorder2 = sorder+1;
						if (bool[sorder] == false){
							$("td.subject" + sorder).append(scheduleData[i].cn)
							$("td.address" + sorder).append(scheduleData[i].l)
							$("td.teacher" + sorder).append(scheduleData[i].tn)
						}else{
							$("td.subject" + sorder).append("<br />"+scheduleData[i].cn)
							$("td.address" + sorder).append("<br />"+scheduleData[i].l)
							$("td.teacher" + sorder).append("<br />"+scheduleData[i].tn)
						}
						if (bool[sorder2] == false){
							$("td.subject" + sorder2).append(scheduleData[i].cn)
							$("td.address" + sorder2).append(scheduleData[i].l)
							$("td.teacher" + sorder2).append(scheduleData[i].tn)
						}else {
							$("td.subject" + sorder2).append("<br />"+scheduleData[i].cn)
							$("td.address" + sorder2).append("<br />"+scheduleData[i].l)
							$("td.teacher" + sorder2).append("<br />"+scheduleData[i].tn)
						}	
						
					}
					else{
						//console.log(section_order_int);
						
						section_order_int = parseInt(right_section_order_string)/2;
						if (bool[section_order_int] == false){
							//console.log(section_order_int)
							$("td.subject" + section_order_int).append(scheduleData[i].cn)
							$("td.address" + section_order_int).append(scheduleData[i].l)
							$("td.teacher" + section_order_int).append(scheduleData[i].tn)
						}else {
							//console.log(section_order_int)
							$("td.subject" + section_order_int).append("<br />"+scheduleData[i].cn)
							$("td.address" + section_order_int).append("<br />"+scheduleData[i].l)
							$("td.teacher" + section_order_int).append("<br />"+scheduleData[i].tn)
						}
						
					}
					
				}
			}
		}
	}
}
//处理体育课表
function gkebiao(gglobal) {
	//console.log(gglobal.length)
	if (gglobal.length > 300)
		$("#terror").html("<span style='color:red'>由于教务系统不稳定,体育课数据暂时无法得到,请稍候再查询!</span>");
	else{
		gglobal = JSON.parse(gglobal);
		String.format();
		if (gglobal.arrangeInfo == null && gglobal.arrangeSwim == null)return;
		else if (gglobal.arrangeInfo != null){
			K =parseInt(gglobal.arrangeInfo.k.split("K")[1]);
			gday = Math.floor(K / 10);
			gsection = K % 10;
			//console.log(gday)
			//console.log(gjie)
			if (gday == global_day){
				what_section = "{0}-{1}节"
				what_section = String.format(what_section,gsection*2-1,gsection*2)
				$("td.jie" + gsection).append(what_section)
				$("td.subject" + gsection).append(gglobal.arrangeInfo.sportName)
				$("td.address" + gsection).append(gglobal.placename)
				$("td.teacher" + gsection).append(gglobal.arrangeInfo.teacher)
			}
		}
		else {
				//处理游泳课信息...
		}
	}
}

function mysearch(){
	var selYear = $("#selYear").val();
    var selMonth = $("#selMonth").val();
    var selDay = $("#selDay").val();
    global_year = selYear;
    global_month = selMonth;
    global_day = selDay;
    $(".tr").remove();
    $("p#date").empty();
    $("terror").empty();
    kebiao();
    
    
}

function judge(num){
	//console.log(num);
	if (global.课程[num].length > 0)return num;
	if (global.课程[num].length == 0)return judge(num-1);
}

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
	this.splice(index, 1);
	}
};

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

