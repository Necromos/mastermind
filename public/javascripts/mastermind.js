$(document).ready(function(){
	var size;
	var dim;
	var now = 0;
	var max;
	var rowNumber;
	var json;
	$("#start").click(function(){
		var str = "/play/";
		if($("#size").val().match(/\d+/)){
			str = str + "size/" + $("#size").val() + "/";
		}
		if ($("#dim").val().match(/\d+/)){
			str = str + "dim/" + $("#dim").val() + "/";
		}
		if($("#max").val().match(/\d+/)){
			str = str + "max/" + $("#max").val() + "/";
		}
		$.ajax({
			url: str
		}).done(function(data){
			$("#setup").remove();
			json = $.parseJSON(data);
			size = json.size;
			dim = json.dim;
			max = json.max;
			if (max === null){
				max = "inf";
			}
			makeText();
		});
	});
	$(document).on('click','#check', function(){
		var str = "/mark/";
		var send = true;
		$(rowNumber).children(".boxxy").each(function(element){
			str = str + $(this).val() + "/";
			if ($(this).val() === ""){
				send = false;
			}
		});
		if (send){
			$("#notice").text("");
			$.ajax({
				url: str
			}).done(function(data){
				json = $.parseJSON(data);
				$("#check").remove();
				now++;
				if (json.done === 0){
					makeText();
				}
				else {
					$("<p>").text(json.retMsg).appendTo(rowNumber);
				}
			});
		}
		else {
			$("#notice").text("Wszystkie pola muszą być pełne!");
		}
	});
	var makeText = function(){
		$("#gameInfo").text("Rozmiar tabeli: " + size + " Zakres liczb: 0 - " + dim + " Ilość prób: (" + now + "/" + max + ")");
		$("<p>").text(json.retMsg + " Trafione: " + json.hit + " Obecne: " + json.closeHit).appendTo(rowNumber);
		rowNumber = "row"+now;
		$("<form>").attr("id",rowNumber).attr("action","#").appendTo("#content");
		rowNumber = "#" + rowNumber;
		for (var i = 0; i < size; i++){
			$("<input>").attr("class","boxxy").attr("type","text").appendTo(rowNumber);
		}
		$("<input>").attr("id","check").attr("type","submit").appendTo(rowNumber);
	};
});
