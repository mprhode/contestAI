
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
function getdatanow(redirectUrl) {
	post_data = {
        "timestamp": Date.now(),
        // "screenshot": takeScreenshot(),
        "product": document.title,
        "url": window.location.href,
		"redirect_url": redirectUrl,
    }
	console.log(post_data)
    // send current data to url
    $.post(userDataUrl,
		post_data,
    function(post_data, status){
        console.log("getdatanow status: " + status);
    });
};

function reportInternal() {
	console.log("test internal report", reportInternalUrl)
	getdatanow(reportInternalUrl);
}

function downloadData() {
	console.log("test getmydata", downloadDataUrl)
	getdatanow(downloadDataUrl);
}