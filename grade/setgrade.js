function grade () {
	var team = grade_info.学年学期;
	var GPA = grade_info.GPA;
	$("#gpa").html(team + "   " + "综合绩点: " + GPA);
	count = grade_info.课程总数
	for (var i=1; i<=count; i++){
		var tr = "<tr class='tr' align='center'  style='font-size:1vw'>" +
				"<td class='order section{0}' width='20%'></td>" +
				"<td class='my subject{1}' width='40%'></td>" +
				"<td class='my credit{2}' width='20%'></td>" +
				"<td class='my grade{3}' width='20%'></td>" +
			"</tr>"
		String.format();
		minetr = String.format(tr,i,i,i,i);
		$("table#day").append(minetr);
	}
	//console.log(count);
	for (var j=0; j<count; j++){
		order = j+1;
		$(".section" + order).append(order.toString());
		$(".subject" + order).append(grade_info.课程名称[j].split("]")[1]);
		$(".credit" + order).append(grade_info.学分[j]);
		$(".grade" + order).append(grade_info.成绩[j]);
	}
}