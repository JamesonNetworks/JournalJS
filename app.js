var spawn = require('child_process').spawn;

process.chdir('client/bin/');
child = spawn('node', ['client.js']);
child.stdout.on('data', function (data) { process.stdout.write(data.toString()); });
child.stderr.on('data', function (data) { process.stdout.write(data.toString()); });
child.on('error', function(err) { process.stdout.write(err); process.stdout.write(arguments); });

process.chdir('../../server/');
child = spawn('node', ['journal_server.js']);
child.stdout.on('data', function (data) { process.stdout.write(data.toString()); });
child.stderr.on('data', function (data) { process.stdout.write(data.toString()); });
child.on('error', function(err) { process.stdout.write(err); process.stdout.write(arguments); });

console.log('JournalJS is running!');
