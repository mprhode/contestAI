
// take a screenshot
function takeScreenshot() {
	var screenshot = document.documentElement
		.cloneNode(true);
	screenshot.style.pointerEvents = 'none';
	screenshot.style.overflow = 'hidden';
	screenshot.style.webkitUserSelect = 'none';
	screenshot.style.mozUserSelect = 'none';
	screenshot.style.msUserSelect = 'none';
	screenshot.style.oUserSelect = 'none';
	screenshot.style.userSelect = 'none';
	screenshot.dataset.scrollX = window.scrollX;
	screenshot.dataset.scrollY = window.scrollY;
	var blob = new Blob([screenshot.outerHTML], {
		type: 'text/html'
	});
	return blob;
}

function generate() {
	window.URL = window.URL || window.webkitURL;
	window.open(window.URL
		.createObjectURL(takeScreenshot()));
}

// get user data 
function send_data(redirectUrl) {
	console.log("send_data called")
	post_data = {
        "timestamp": Date.now(),
        // "screenshot": takeScreenshot(),
        "product": document.title,
        "url": window.location.href,
		"redirect_url": redirectUrl,
    }
	console.log(post_data)
    // send current data to url
    // $.post(userDataUrl,
	// 	post_data,
	// 	function(post_data, status){
	// 		console.log("getdatanow status: " + status);
	// 	}
	// );
	// $.ajax({
	// 	url: userDataUrl,
	// 	type: "get", //send it through get method
	// 	data: post_data,
	// 	// success: function(response) {
	// 	// 	console.log("success send_data")
	// 	// },
	// 	error: function(xhr) {
	// 		console.log("error send_data")
	// 	}
		
	// })

	// var util = {};
	// util.post = function(url, fields) {
	// 	var $form = $('<form>', {
	// 		action: userDataUrl,
	// 		method: 'post'
	// 	});
	// 	$.each(post_data, function(key, val) {
	// 		$('<input>').attr({
	// 			type: "hidden",
	// 			name: key,
	// 			value: val
	// 		}).appendTo($form);
	// 	});
	// 	console.log("submit")
	// 	$form.appendTo('body').submit();
	// }
	/// none of these redirect b/c ajax...

};

function reportInternal() {
	console.log("test internal report", reportInternalUrl)
	send_data(reportInternalUrl);
}

function downloadData() {
	console.log("test getmydata", downloadDataUrl)
	send_data(downloadDataUrl);
}