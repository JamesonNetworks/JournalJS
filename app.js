var spawn = require('child_process').spawn;

process.chdir('client/bin/');
child = spawn('node', ['client.js']);
child.stdout.on('data', function (data) { console.log(data.toString()); });
child.stderr.on('data', function (data) { console.log(data.toString()); });
child.on('error', function(err) { console.log(err); console.log(arguments); });

var spawn = require('child_process').spawn;

process.chdir('../../server/');
child = spawn('node', ['app.js']);
child.stdout.on('data', function (data) { console.log(data.toString()); });
child.stderr.on('data', function (data) { console.log(data.toString()); });
child.on('error', function(err) { console.log(err); console.log(arguments); });

console.log('JournalJS is running!');