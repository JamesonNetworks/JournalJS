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
		if(JSON.stringify(files[i]).indexOf('.json') > 0) {
			var entry = fs.readFileSync('./' + conf.entries + '/' + files[i], 'utf-8');
			var jsonEntry = JSON.parse(entry);
			console.log(JSON.stringify(jsonEntry));
			if(jsonEntry.title !== 'template') {
				entries.push(jsonEntry);			
			}			
		}
	}
	return entries.reverse();
}

jsonFiles.prototype.get_entry = function(entry) {
	throw new Error('getEntry not supported for static files');
}