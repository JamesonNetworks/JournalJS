var conf = require('../conf.json'),
	fs = require('fs'),
	blogEntries = [];

exports = module.exports = new jsonFiles();

/**
 * Expose `LibraryManager`.
 */

exports.jsonFiles = jsonFiles;

function jsonFiles() {
}

jsonFiles.prototype.posts_count = function() {
	return fs.readdirSync(process.cwd() + conf.entries).length;
}

jsonFiles.prototype.entries = function(current_count) {
	var files = fs.readdirSync(process.cwd() + conf.entries);
	var entries = [];
	for(var i = 0; i < files.length; i++) {
		var entry = fs.readFileSync('./' + conf.entries + '/' + files[i], 'utf-8');
		var jsonEntry = JSON.parse(entry);
		entries.push(jsonEntry);
	}
	return entries;
}

jsonFiles.prototype.get_entry = function(entry) {
	throw new Error('getEntry not supported for static files');
}