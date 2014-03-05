var express = require('express'),
	conf = require('./client.json');

var router = express();
router.use(express.bodyParser());

router.use('/', express.static(__dirname + '/../site/deploy'));

router.listen(conf.port);
