'use strict';

var path = process.cwd();
var Search=require(path+'/app/controllers/search.server.js');
var User=require(path+'/app/controllers/user.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		
		if (req.isAuthenticated()) {
			
			return next();
		} else {
			res.redirect("/isGoingTo/"+req.params.city+'/'+req.params.layer+'/'+req.params.id+"/login");
		}
	}

	var search=new Search();
	var user= new User();
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/myindex.html');
		});


	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		
	app.route('/location/:lat/:long')
		.get(search.checkLocation);
		
	app.route('/results?:q')	
		.get(search.redirectTo);
		
	app.route('/res/:city')
		.get(function(req,res) {
			res.sendFile(path+'/public/results.html');
		});
	
	app.route('/res/:city/getInfo')
		.get(search.callApiByCityName);	
	
	app.route('/res/:city/:count/getMore')
		.get(search.getMore);
		
	app.route('/goTo/:city/:id')
		.get(function(req,res){
			res.sendFile(path+'/public/goTo.html');
		});
		
	app.route('/goTo/:city/:id/getInfo')
		.get(search.callApiById);
		
	app.route('/goTo/:city/:id/:lang/reviews')
		.get(search.reviews);	
		
	app.route('/isGoingTo/:city/:layer/:id')
		.get(isLoggedIn,search.isGoing);
		
	app.route('/isGoingTo/:city/:layer/:id/login')
		.get(function(req,res){
			res.render('myLogin');
		});
		
		
	app.route('/isGoingTo/:city/:layer/:id/sign?:q')
		.post(user.signUp);
		
		
	app.route('/test/:lat/:lng')
		.get(search.showMap);
		
	app.route('/isGoingTo/:city/:layer/:id/log?:q')
		.post(function(req, res, next) {
			  passport.authenticate('local', function(err, user, info) {
			    if (err) { return next(err); }
			    
			    if (!user) { return res.redirect('/isGoingTo/'+req.params.city+"/"+req.params.layer+'/'+req.params.id+'/login'); }
			    req.logIn(user, function(err) {
			      if (err) { return next(err); }
			      return res.redirect('/isGoingTo/'+req.params.city+"/"+req.params.layer+'/'+req.params.id);
			    });
			  })(req, res, next);
			});
	
	
};
