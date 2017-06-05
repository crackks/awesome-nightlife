'use strict'

var Users = require('../models/users.js');
var crypto=require('crypto');
var bcrypt=require("bcryptjs");
function User(){
    
    this.signUp=function(req,res){
        var userName=req.body.userName;
        var userEmail=req.body.mail;
        var ps=req.body.ps;
        
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
                                    info:{
                                        userName:userName,
	                                    Email:userEmail,
	                                    Password:hps
                                        },
	                                poll:{
	                                    pollCreated:[],
                                	    pollVoted:[],
                                        nbrVote:0,
                                         }
                                    });
            bcrypt.genSalt(10, function(err, salt) {
                if (err){throw err}
                bcrypt.hash(ps, salt, function(err, hash) {
                    if (err){throw err;}
                    newUser.info.Password=hash;
                    Users.find({'info.userName':userName}).exec(function(err,data){
                        if (err){throw err}
                        if (!data[0]){
                            Users.find({'info.Email':userEmail}).exec(function(err,data2){
                                if(err){throw err}
                                if(!data2[0]){
                                    newUser.save(function(err,data){
                                        if (err){throw err}
                                        req.flash('success_msg','You are registered! You can now login.');
                                        res.redirect('/login');
                                        
                                    });
                                }
                                else{
                                    req.flash('error_msg','This email adress is already use');
                                    res.redirect('/login');
                                }
                            });
                        }
                        else{
                            req.flash('error_msg','This user name is already use');
                            res.redirect('/login');
                        }
                    });
                    
                });
            });
        }
    };
            
    
    this.getByUserName=function(userName,callback){
        Users.findOne({'info.userName':userName},callback)};
        
    this.getById=function(id,callback){
        Users.findById(id,callback)};
        
    this.verifyPassword=function(passwordTyped,hash,callback){
        bcrypt.compare(passwordTyped, hash, function(err, match) {
            if (err)throw err;
            
            callback(null,match);
        });
    };
    
    this.getProfile=function(req,res){
        var userInfo=req.user.info;
        var userPoll=req.user.poll;
        var poll=userPoll.pollCreated;
        var nbrPoll=poll.length;
        var nbrVote=userPoll.pollVoted.length;
        res.json({userName:userInfo.userName,nbrVote:nbrVote,nbrPoll:nbrPoll});
    };
    
}

module.exports=User;