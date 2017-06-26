'use strict';

const Yelp = require('node-yelp-api-v3');
var removeAccents=require("remove-accents");
var Going= require('../models/going.js');
var Users = require('../models/users.js');
function Search(){
    
    const yelp = new Yelp({
          consumer_key: process.env.Yelp_apiKey,
          consumer_secret: process.env.Yelp_apiSecret
        });
   
    

    this.callApiByCityName=function(req,res){
        var city=req.params.city;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10}).then(function(result){
            if(req.user){
               sendJson(result,req.user.userName,res);
            }
            else{
                sendJson(result,null,res);
           }
        });
        
    };
    
    this.checkError=function(req,res){
        var city=req.query.city;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10}).then(function(result){
            res.redirect('/res/'+city);
           
        })
        .catch(function(e){
            req.flash('error_msg',JSON.parse(e.data).error.description.toString());
            res.redirect('/');
        } );
    };
    
    
    this.getMore=function(req,res){
        var city=req.params.city;
        var offset=req.params.count*10;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10, offset:offset}).then(function(results) {
            if(req.user){
                sendJson(results,req.user.userName,res);
            }
            else{
                sendJson(results,null,res);
            }
        });
    };
    
    
    this.callApiById=function(req,res){
        var id=req.params.id;
        console.log(id);
        yelp.getBusinessById(removeAccents(id)).then(function(results) {
            if(req.user){
                sendOneJson(results,req.user.userName,res);
            }
            else{
                sendOneJson(results,null,res);
            }
        });
    };
    
    
    
    this.checkLocation=function(req,res){
        var loc=req.params.lat+','+req.params.long;
        yelp.searchBusiness({location:loc}).then(function(results) {
            var city=results.businesses[0].location.city;
            res.json({route:'/res/'+city});
        });
        
    };
    
    
    this.reviews=function(req,res){
        yelp.getReviews(removeAccents(req.params.id), { locale: req.params.lang }).then((results) => res.json(results));
    };
    
    
    
    this.isGoing=function(req,res){
        var cityId=req.params.id;
        Users.findOne({'userName':req.user.userName,'isGoingTo':cityId}).exec(function(err,user){
            if (err) throw err;
            if (user){
                Going.findOneAndUpdate({id:cityId},{$inc:{peopleGoing:-1}}).exec(function(err,data){
                    if (err) throw err;
                    user.update({$pull:{'isGoingTo':cityId}}).exec(function(err,updateUser){
                        if (err)throw err;
                        sendOneJson(data,req.user.userName,res);
                    });
                });
            }
            else{
                Users.findOneAndUpdate({'userName':req.user.userName},{$push :{'isGoingTo':cityId}}).exec(function(err,user){
                    if (err)throw err;
                    Going.findOne({id:cityId}).exec(function(err,data){
                        if (err)throw err;
                        if(data){
                            data.update({$inc:{peopleGoing:1}}).exec(function(err,newdata){
                                if (err)throw err;
                                sendOneJson(data,req.user.userName,res);
                            });
                        }
                        else{
                            var going=new Going( {id:cityId,peopleGoing:1});
                            going.save(function(err,go){
                                if (err)throw err;
                                sendOneJson(go,req.user.userName,res);
                            });
                        }
                        
                    });
                });
                
            }
        });
        
    };
    
    this.filter=function(req,res){
        var city=req.params.city;
        var price=req.params.price;
        var cat=req.params.categorie;
        var count=req.params.count;
        var search={location:city,limit:10,offset:count*10};
        if (price!='Price'){
            search.price=price;
        }
        if (cat!='Categories'){
            search.term=cat;
        }
        yelp.searchBusiness(search).then(function(result){
            if(req.user){
               sendJson(result,req.user.userName,res);
            }
            else{
                sendJson(result,null,res);
           }
        })
        .catch((e)=> console.log(e)&res.json({error:'no result'}));
    };
    
    this.catSearch=function(req,res){
        var city=req.params.city;
        var cat=req.params.categorie;
        yelp.searchBusiness({location:city,limit:10,categorie:cat}).then(function(result){
            if(req.user){
               sendJson(result,req.user.userName,res);
            }
            else{
                sendJson(result,null,res);
           }
        });
    };
    
    function sendJson(data,userName,res){
        Going.find().exec(function(err,going){
            if (err)throw err;
            if(going){
                if(userName){
                    Users.findOne({userName:userName}).exec(function(err, user){
                        if (err)throw err;
                        for (var i=0;i<data.businesses.length;i++){
                            var nbrGoing=personGoing(going,data.businesses[i].id);
                            if (userIsGoing(user.isGoingTo,data.businesses[i].id)){
                                if(nbrGoing<2){
                                    data.businesses[i]["nbrGoing"]='You';
                                }
                                else{
                                    data.businesses[i]["nbrGoing"]='You and '+Number(nbrGoing-1)+' person';
                                }
                            }
                            else{
                                data.businesses[i]["nbrGoing"]=nbrGoing+' person';
                            } 
                        }
                        res.json(data);
                    });
                }
                else{
                    console.log('no user')
                    for (var i=0;i<data.businesses.length;i++){
                        var nbrGoing=personGoing(going,data.businesses[i].id);
                            data.businesses[i]["nbrGoing"]=nbrGoing+' person';
                    }
                    res.json(data);
                }
            }
            else{
                console.log('no going');
                for (var i=0;i<data.businesses.length;i++){
                    data.businesses[i]["nbrGoing"]='0 person';
                }
                res.json(data);
            } 
        });
    }
    
    
    function sendOneJson(data,userName,res){
        Going.findOne({id:data.id}).exec(function(err,going){
                    if (err)throw err;
                    if(going){
                        var nbrGoing=going.peopleGoing;
                        if(userName){
                            Users.findOne({userName:userName,'isGoingTo':data.id}).exec(function(err, user){
                                if (err)throw err;
                                if (user){
                                    if (nbrGoing<2){
                                    data.nbrGoing='You';
                                    }
                                    else{
                                        data.nbrGoing='You and ' + Number(nbrGoing-1)+' person';
                                    }
                                    res.json(data);
                                }
                                else{
                                    data.nbrGoing=nbrGoing+' person';
                                    res.json(data);
                                }
                               
                            });
                        }
                        else{
                            data.nbrGoing=nbrGoing+' person';
                            res.json(data);
                        }
                    }
                    else{
                    data.nbrGoing='0 person';
                    res.json(data);
                } 
        });
    }
    
    
    function userIsGoing(userCityId,Id){
        for (var i=0; i<userCityId.length;i++){
            if(userCityId[i]==Id){
                return true;
            }
        }
        return false;
    }
    
    
    function personGoing(going,Id){
        for (var i=0; i<going.length;i++){
            if (removeAccents(going[i].id)==removeAccents(Id)){
                if (going[i].peopleGoing&&going[i].peopleGoing<=1){
                    return going[i].peopleGoing;
                }
                else {return 0}
            }
        }
        return 0;
    }
}

module.exports=Search;