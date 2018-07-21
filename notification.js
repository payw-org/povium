const notifier = require('node-notifier');

// print process.argv
process.argv.forEach(function (val, index, array) {
	// console.log(index + ': ' + val);
	notifier.notify({
		title: "test",
		message:index + ': ' + val
	});
});

// Object
// notifier.notify({
// 	title: 'My notification',
// 	message: 'Hello, there!'
// });