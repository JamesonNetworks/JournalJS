// Main server for the application. Handles routing to the handler and building
// the parameters for each request.
var express = require('express'),
	conf = require('./conf.json'),
	adapter = require('./bin/' + conf.adapter);

var router = express();

var current_posts_count = 0;
var entries = [];
var list = [];

router.all("/*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, X-Requested-With, Content-Type, Content-Range, Content-Disposition");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
	res.header('Access-Control-Allow-Credentials', 'true');
	// if(hasRequiredRole("validUser", req.session)) {
	// 	next();
	// }
	// else {
	// 	res.send(403);
	// 	res.end();
	// }
	var new_posts_count = adapter.posts_count();
	if(current_posts_count !== new_posts_count) {
		current_posts_count = new_posts_count;
		entries = adapter.entries();
		for(var i = 0; i < entries.length; i++) {
			console.log(JSON.stringify(entries));
			list.push({ 'title': entries[i].title, 'date': entries[i].date });
		}
	}

	next();
});

router.use(router.router);

if(conf.adapter === 'jsonFiles') {
	router.use('/', express.static(__dirname + conf.entries));	
}
else {
	router.use('/', function(req, res) {
		var adapter = require('./bin/' + conf.adapter);
		var entry = adapter.get_entry(req.url);
	});
}

router.use('/list', function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'cache-control':'no-cache'
	});

	var responseObj = {};
	responseObj.list = JSON.stringify(list);
	responseObj.count = entries.count;

	res.write(JSON.stringify(responseObj));
	res.end();
});
router.listen(conf.port);
