
var conf = require('./client.json');

if(process.env.NODE_ENVIRONMENT='dev') {
	var exec = require('child_process').execFile;

	var spawn = require('child_process').spawn;

    child = spawn('nirodha', ['-s', '../site']);
	child.stdout.on('data', function (data) { console.log(data.toString()); });
	child.stderr.on('data', function (data) { console.log(data.toString()); });
	child.on('error', function(err) { console.log(err); console.log(arguments); });

	// var nirodha = function() {
	//    console.log("Nirodha() start");
	//    debugger;
	//    exec('nirodha -s ../site', function(err, data, stderr) {  
	//    		debugger;
	//         console.log(err);
	//         console.log(data.toString());                       
	//     });  
	// }
	// nirodha();
}
else {
    child = spawn('nirodha', ['-d', '../site/index']);
	child.stdout.on('data', function (data) { console.log(data.toString()); });
	child.stderr.on('data', function (data) { console.log(data.toString()); });
	child.on('error', function(err) { console.log(err); console.log(arguments); });

	var express = require('express');
	var router = expres
	router.use(express.bodyParser());
	router.use('/', express.static(__dirname + '/../site/deploy'));	
	router.listen(conf.port);
}