var computer1IP = "";
var computer2IP = "";

function startMission()
{
	var missionId = $("#missionId").val();
	var seed = $("#seed").val();
	computer1IP = $("#computer1IP").val();
	computer2IP = $("#computer2IP").val();
	if(computer1IP != "")
	{
		$.ajax({
		  url: "http://" + computer1IP + "/startMission?missionId=" + missionId + "&seed=" + seed
		}).done(function(data) {

		});
	}
	
	if(computer2IP != "")
	{
		$.ajax({
		  url: "http://" + computer2IP + "/startMission?missionId=" + missionId + "&seed=" + seed
		}).done(function(data) {
			startPolling(2);
		});
	}
}

function startPolling(num)
{
	setTimeout(
		function()
		{
			var ip = $("#computer" + num + "IP").val();
			$.ajax({
			  url: "http://" + ip + "/bombInfo",
			  dataType: "json"
			}).done(function(data) {
				$("#bombInfo" + num).html(handleBombInfo(data));
				$("#status" + num).attr("style","color:green");
				$("#status" + num).text("connected");
			}).fail(function() {
				$("#status" + num).attr("style","color:red");
				$("#status" + num).text("not connected");
			}).always(function() {
				startPolling(num);
			});
		},
		1000
	);
}

function handleBombInfo(bombInfo)
{
	if(bombInfo['BombState'] == 'Active')
	{
		var modulesRemaining = bombInfo['SolvableModules'].length - bombInfo['SolvedModules'].length;
		var html = "";
		html += "Time : " + bombInfo['Time'] + "<br>";
		html += "Strikes : " + bombInfo['Time'] + "<br>";
		html += "Modules Remaining: " + modulesRemaining + "<br>";
		return html;
	}
	else if(bombInfo['BombState'] == 'NA')
	{
		return "<span>No Bomb</span>"
	}
	else if(bombInfo['BombState'] == 'Defused')
	{
		var html = "<h1 style='color:blue'>Defused</h1>";
		html += "<br><span>Time Remaining: " + bombInfo['Time'] + "</span>";
		
		return html;
	}
	else if(bombInfo['BombState'] == 'Exploded')
	{
		return "<h1 style='color:red'>Exploded</h1>"
	}
}

function randomizeSeed()
{
	$("#seed").val(Math.floor((Math.random() * 60000) + 1));
}

$(document).ready(function(){
	startPolling(1);
	startPolling(2);
	$("#random").click(randomizeSeed);
	$("#startMission").click(startMission);
});