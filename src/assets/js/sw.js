if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
	.then(function() {
 		console.log('sw registered!');
	})
    .catch(function(error) {
    	console.log('service worker: ', error);
    });
} else {
	console.log('不支持sw');
}
