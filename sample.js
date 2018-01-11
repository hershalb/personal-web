var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/main.html');
});

router.get('/e', function(req, res) {
	// console.log(req);
	res.redirect('/?comp=e');
});

router.get('/h', function(req, res) {
	// console.log(req);
	res.redirect('/?comp=h');
});

module.exports = router;