
var conf = require('./client.json');

if(process.env.NODE_ENVIRONMENT='dev') {
	var exec = require('child_process').execFile;

	var spawn = require('child_process').spawn;

    child = spawn('nirodha', ['-s', '../site']);
	child.stdout.on('data', function (data) { process.stdout.write(data.toString()); });
	child.stderr.on('data', function (data) { process.stdout.write(data.toString()); });
	child.on('error', function(err) { process.stdout.write(err); process.stdout.write(arguments); });

	// var nirodha = function() {
	//    process.stdout.write("Nirodha() start");
	//    debugger;
	//    exec('nirodha -s ../site', function(err, data, stderr) {  
	//    		debugger;
	//         process.stdout.write(err);
	//         process.stdout.write(data.toString());                       
	//     });  
	// }
	// nirodha();
}
else {
    child = spawn('nirodha', ['-d', '../site/index']);
	child.stdout.on('data', function (data) { process.stdout.write(data.toString()); });
	child.stderr.on('data', function (data) { process.stdout.write(data.toString()); });
	child.on('error', function(err) { process.stdout.write(err); process.stdout.write(arguments); });

	var express = require('express');
	var router = expres
	router.use(express.bodyParser());
	router.use('/', express.static(__dirname + '/../site/deploy'));	
	router.listen(conf.port);
}