var express = require('express');
var router = express.Router();

var crypto = require('crypto');
var User = require('../modules/user.js');
/*
 * GET home page.
 */

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("gegege\n");
  res.render('index', { title: 'Express' });
});

module.exports = router;


//检查是否登入.
function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '尚未登录，无法操作。');
		return res.redirect('/error');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已登入');
		return res.redirect('/');
	}
	next();
}

