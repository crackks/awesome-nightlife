'use strict';

var path = process.cwd();
var Search=require(path+'/app/controllers/search.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		
		if (req.isAuthenticated()) {
			
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var search=new Search();
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/myindex.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		
	app.route('/results?:q')	
		.get(search.redirectTo);
		
	app.route('/res/:city')
		.get(function(req,res) {
			res.sendFile(path+'/public/results.html');
		});
	
	app.route('/res/:city/getInfo')
		.get(search.callApiByCityName);	


	
}
