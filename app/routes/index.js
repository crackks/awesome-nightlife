'use strict';

var path = process.cwd();
var Search=require(path+'/app/controllers/search.server.js');
var User=require(path+'/app/controllers/user.server.js');
module.exports = function (app, passport) {

	function isLoggedIn (req, res) {
		res.send(req.isAuthenticated());
	}

	var search=new Search();
	var user= new User();
	app.route('/')
		.get(function (req, res) {
			res.render('myindex');
		});


	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		
	app.route('/location/:lat/:long')
		.get(search.checkLocation);
		
	app.route('/results?:q')	
		.get(search.checkError);
		
	app.route('/res/:city')
		.get(function(req,res) {
			if (req.query.price){
				res.redirect('/res/'+req.query.inputCity+'/'+req.query.price+'/'+req.query.categories);
			}
			else{
				res.sendFile(path+'/public/results.html');
			}
		});
		
	app.route('/res/:city/:price/:categorie')
		.get(function(req,res){
			if (req.query.price){
				res.redirect('/res/'+req.query.inputCity+'/'+req.query.price+'/'+req.query.categories);
			}
			else{
				res.sendFile(path+'/public/results.html');
			}
		});
		
	app.route('/res/:city/:price/:categorie/getInfo')
		.get(search.filter);
		
	app.route('/res/:city/:price/:categorie/:count/filter')
		.get(search.filter);
	
	app.route('/res/:city/getInfo')
		.get(search.callApiByCityName);	
		
	app.route('/goTo/:city/:id/:categorie/catSearch')
		.get(search.catSearch);
	
	app.route('/res/:city/:count/getMore')
		.get(search.getMore);
		
	app.route('/goTo/:city/:id')
		.get(function(req,res){
			res.render('goTo');
		});
		
	app.route('/goTo/:city/:id/reg')
		.get(function(req,res){
			res.render('goTo');
		});
		
	app.route('/goTo/:city/:id/log')
		.get(function(req,res){
			res.render('goTo');
		});
	
	app.route('/goTo/:city/:id/log')
		.get(function(req,res){
			res.render('goTo');
		});
		
	app.route('/goTo/:city/:id/getInfo')
		.get(search.callApiById);
		
	app.route('/goTo/:city/:id/:lang/reviews')
		.get(search.reviews);	
		
	app.route('/isGoingTo/:city/:layer/:id/check')
		.post(isLoggedIn);
		
	app.route('/isGoingTo/:city/:layer/:id')
		.post(search.isGoing);
		
	app.route('/isGoingTo/:city/:layer/:id/login')
		.get(function(req,res){
			res.render('myLogin');
		});
		
		
	app.route('/isGoingTo/:city/:layer/:id/sign?:q')
		.post(user.signUp);
		
	app.route('/goTo/:city/:id/:layer/sign?:q')	
		.post(user.signUp);
	
	
	
	app.route('/goTo/:city/:id/:layer/log?:q')
		.post(function(req, res, next) {
			  passport.authenticate('local', function(err, user, info) {
			    if (err) { return next(err); }
			    
			    if (!user) { req.flash('error_msg','Invalid user name or password');
			    	return res.redirect('/goTo/'+req.params.city+'/'+req.params.id+'/log'); }
			    req.logIn(user, function(err) {
			      if (err) { return next(err); }
			      req.flash('success_msg2','Login Successful')
			      return res.redirect('/goTo/'+req.params.city+'/'+req.params.id);
			    });
			  })(req, res, next);
			});
	
	
};
