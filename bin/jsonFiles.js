var conf = require('../conf.json'),
	fs = require('fs'),
	logger = require('./logging.js'),
	blogEntries = [];

exports = module.exports = new jsonFiles();

/**
 * Expose `LibraryManager`.
 */

exports.jsonFiles = jsonFiles;

var allEntries;

function findEntry(entries, keys, key, callback) {
	var found = false;
	debugger;
	logger.log('Finding value for the following potential keys: ' + JSON.stringify(keys));
	logger.log('Searching for ' + key);

	for(var i = 0; i < keys.length; i++) {
		logger.log('Testing for configured key: ' + keys[i]);
		for(var k = 0; k < entries.length; k++) {
			logger.log('Testing entry: ' + JSON.stringify(entries[k]), 7);
			if(entries[k][keys[i]] === key) {
				logger.log('Key was found for: ' + keys[i]);
				logger.log('Returning entry: ' + JSON.stringify(entries[k]));
				found = true;
				callback(entries[k]);
			}
		}
		if(!found && (i === keys.length-1)) {
			callback(null);
		}
	}
}

function jsonFiles() {
}

jsonFiles.prototype.posts_count = function() {
	logger.log('In posts_count method');
	logger.log('Reading directory: ' + process.cwd() + conf.entries);
	var entries = fs.readdirSync(process.cwd() + conf.entries);
	logger.log('There are ' + entries.length + ' files.');
	return entries;
}

jsonFiles.prototype.entries = function() {
	logger.log('In entries method for jsonFiles');
	var files = fs.readdirSync(process.cwd() + conf.entries);
	var entries = [];
	for(var i = 0; i < files.length; i++) {
		if(JSON.stringify(files[i]).indexOf('.json') > 0) {
			var entry = fs.readFileSync('./' + conf.entries + '/' + files[i], 'utf-8');
			var jsonEntry = JSON.parse(entry);
			//console.log(JSON.stringify(jsonEntry));
			if(jsonEntry.title !== 'template') {
				entries.push(jsonEntry);
			}
		}
	}
	allEntries = entries.reverse();
	logger.log('Entries returned: ' + JSON.stringify(entries.reverse()), 7);
	return entries.reverse();
}

jsonFiles.prototype.get_entry = function(key) {
	logger.log('In get_entry method');
	logger.log('All entries are:' + JSON.stringify(allEntries), 7);

	var entries = allEntries;

	if(typeof(key) === 'undefined') {
		logger.log('Key was null');
		logger.log('Returning first entry which is: ' + JSON.stringify(allEntries[0]), 7);
		return allEntries[0];
	}

	logger.log('Current key is ' + key);

	// Entries are all of the entries for the journal
	var entries = allEntries;
	// valuesToFetchEntriesBy is all of the keys in the entries that could possibly be 
	// looked through on the entries. For instance, if you want to be able to request
	// the entry by the date, then the date needs to be one of the values to fetch the 
	// entries by. I'm going to allow the date and the title. 
	var keys = conf.valuesToFetchEntriesBy;

	findEntry(entries, keys, key, function(entry) {
		return entry;
	});
}