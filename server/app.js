// Main server for the application. Handles routing to the handler and building
// the parameters for each request.
var express = require('express'),

var router = express();
router.use(express.bodyParser());

router.use(express.cookieParser());
router.use(express.session({
	store: new MongoStore({url: conf.dbSettings.sessionConnectString}),
	cookie: {
		secure: conf.envSettings.sessionSecure,
		domain: "semipho.com"
	},
	secret: conf.envSettings.sessionSecret}
));

router.all("/*", function(req, res, next) {
	//res.header("Access-Control-Allow-Origin", conf.serverSettings.rootUrl);
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
	next();
});

router.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        router.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        if (loggingSettings.logging == true)  {
        	console.log('%s %s', key, route);
		}
        router[key](route, a[key]);
        break;
    }
  }
};

router.map({

});

router.use(router.router);

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

router.use(function(req, res, next){
  // the status option, or res.statusCode = 404
  // are equivalent, however with the option we
  // get the "status" local available as well
  //res.render('404', { status: 404, url: req.url });
  params = { structure: "notfound", next: next };
  processRequest(req, res, params);
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

router.listen(conf.serverSettings.apiPort);
