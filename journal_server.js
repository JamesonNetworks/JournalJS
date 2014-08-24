// Main server for the application. Handles routing to the handler and building
// the parameters for each request.
var express = require('express'),
	conf = require('./conf.json'),
	uuid = require('node-uuid'),
	adapter = require('./bin/' + conf.adapter),
	engine = require('./bin/engine.js'),
	logger = require('./bin/logging.js');

var router = express();

var current_posts_count = 0;
var entries = [];
var list = [];

router.all("/*", function(req, res, next) {
	logger.log('Request URL: ' + req.url);
	logger.log('Request Params: ' + JSON.stringify(req.params));

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, X-Requested-With, Content-Type, Content-Range, Content-Disposition");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header('Access-Control-Allow-Credentials', 'true');

	var new_posts_count = adapter.posts_count();
	if(current_posts_count !== new_posts_count) {
		current_posts_count = new_posts_count;
		entries = adapter.entries();
		for(var i = 0; i < entries.length; i++) {
			//console.log(JSON.stringify(entries));
			list.push({ 'title': entries[i].title, 'date': entries[i].date, 'uuid': uuid.v1() });
		}
	}

	next();
});

// When javascript is enabled, we'll redirect to the nirodha site,
// when its not enabled the default handler will render the content
// of the entry in an unformatted manner
router.use('/scriptEnabled', express.static(__dirname + '/client/deploy'));

router.use('/entries', function(req, res) {
	var entry = adapter.get_entry(req.params[1]);
	if(typeof(entry) === 'undefined') {
		logger.log('No entry found for ' + JSON.stringify(req.url));
		res.send(404);
	}
	else {
		logger.log('Writing entry to response...');
		res.write(JSON.stringify(entry));
		res.end();
	}
});

router.use('/list', function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'cache-control':'no-cache'
	});
	logger.log('Serving entry list with the current list of ' + JSON.stringify(list));
	res.write(JSON.stringify(list));
	res.end();
});

// Static entry point, this will serve the static page rendered
// with the latest entry and links to other entries. It will 
// default with the noscript tag and rendered article, and then
// redirect to the rich content site if javascript is enabled
router.use('/', function(req, res) {

	logger.log('In handler for slash');

	var entry = adapter.get_entry(req.params[0]);
	debugger;
	if(typeof(entry) === 'undefined') {

		logger.log('No entry found for ' + JSON.stringify(req.url));

		res.send(404);
	}
	else {
		var renderedEntry = engine.render(entry);
		logger.log('Writing entry to response...');
		res.write(JSON.stringify(renderedEntry));
		res.end();
	}
});

router.listen(conf.port);
