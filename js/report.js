// create cards
function populate(jsonobj) {
	//hide first div or remove after append using `$(".card:first").remove()`
	$(".card:first").hide()
	$(".add-btn:first").hide()
	$(".remove-btn:first").hide()

	for (var i = 0; i < jsonobj.length; i++){
		item = jsonobj[i];
		// main list
		var card1 = $(".card:first").clone() //clone first divs
		var titleId = item.title;
		var descriptionId = item.description;
		$(card1).prop("id", "main-"+i); 
		//add values inside divs
		var remBtn = $(".remove-btn:first").clone();

		$(remBtn).data("index", i)
		remBtn.click(function() {
		var idx = $(this).data("index")
		$("#main-" + idx).hide();
		$("#standby-" + idx).show();
		});
		remBtn.show().prependTo(card1);
		$(card1).find(".card-title").html(titleId);
		$(card1).find(".card-text").html(descriptionId);
		$(card1).show() //show cards
		$(card1).appendTo($(".card-container")) //append to container

		// standby list
		var card2 = $(".card:first").clone() //clone first divs
		$(card2).find(".card-subtitle").remove();
		$(card2).find(".card-text").remove();		
		$(card2).prop("id", "standby-"+i); 

		//add values inside divs
		console.log("test")
		var addBtn = $(".add-btn:first").clone();
		$(addBtn).data("index", i)
		addBtn.click(function() {
			var idx = $(this).data("index")
			$("#main-" + idx).show();
			$("#standby-" + idx).hide();
		});
		console.log(card2)
		addBtn.show().prependTo(card2);	
		$(card2).find(".card-title").html(titleId);
		$(card2).hide() //show cards
		$(card2).appendTo($(".standby-card-container")) //append to container
	};
};
