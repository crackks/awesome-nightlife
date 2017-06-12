'use strict'

var Users = require('../models/users.js');
var crypto=require('crypto');
var bcrypt=require("bcryptjs");
function User(){
    
    this.signUp=function(req,res){
        var userName=req.body.userName;
        var userEmail=req.body.mail;
        var ps=req.body.ps;
        var direction=req.params.city+"/"+req.params.id;
        req.checkBody('userName','The user name should have between 5 and 12 characters').len(5,12);
        req.checkBody('ps','Passwords do not match').equals(req.body.Cps);
        req.checkBody("userName","You CAN'T use symbol in your user name").matches(/[A-Za-z0-9]/);
        var errors=req.validationErrors();
        
        if (errors){
            res.render('myLogin',{errors:errors});
        }
        else{
            var hps="";
            var id=crypto.createHash('sha1').update(userName).digest('hex');
            var newUser=new Users({_id:id,
                                    userName:userName,
                                    Email:userEmail,
                                    Password:hps,
                                    isGoingTo:[]
                                    });
            bcrypt.genSalt(10, function(err, salt) {
                if (err){throw err}
                bcrypt.hash(ps, salt, function(err, hash) {
                    if (err){throw err;}
                    newUser.Password=hash;
                    Users.find({'userName':userName}).exec(function(err,data){
                        if (err){throw err}
                        if (!data[0]){
                            Users.find({'Email':userEmail}).exec(function(err,data2){
                                if(err){throw err}
                                if(!data2[0]){
                                    newUser.save(function(err,data){
                                        if (err){throw err}
                                        req.flash('success_msg','You are registered! You can now login.');
                                        res.redirect('/isGoingTo/'+direction+'/login');
                                        
                                    });
                                }
                                else{
                                    req.flash('error_msg','This email adress is already use');
                                    res.redirect('/isGoingTo/'+direction+'/login');
                                }
                            });
                        }
                        else{
                            req.flash('error_msg','This user name is already use');
                            res.redirect('/isGoingTo/'+direction+'/login');
                        }
                    });
                    
                });
            });
        }
    };
            
    
    this.getByUserName=function(userName,callback){
        Users.findOne({'userName':userName},callback)};
        
    this.getById=function(id,callback){
        Users.findById(id,callback)};
        
    this.verifyPassword=function(passwordTyped,hash,callback){
        bcrypt.compare(passwordTyped, hash, function(err, match) {
            if (err)throw err;
            
            callback(null,match);
        });
    };
    
    
    
}

module.exports=User;