'use strict';

const Yelp = require('node-yelp-api-v3');
var removeAccents=require("remove-accents");
var Going= require('../models/going.js');
var Users = require('../models/users.js');
var GoogleMapsAPI=require('googlemaps');
function Search(){
    
    const yelp = new Yelp({
          consumer_key: '4ZOfZXBV3Q9HQYrvGxnFcg',
          consumer_secret: 't3M1TgZJWs97kDI1a6DKW0M28cuDJaCe8Ut5p4SyoU52RMjImlLLQ8ICrHdIHR62'
        });
        
    const publicConfig = {
          key: 'AIzaSyDxlnjOoQ3MxbYjhj6lOantzO-WcnPPn6A',
          stagger_time:       1000, 
          encode_polylines:   false,
          secure:             true
        };
   
    

    this.callApiByCityName=function(req,res){
        var city=req.params.city;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10}).then(function(result){
            if(req.user){
               sendJson(result,req.user.userName,res);
            }
            else{
                sendJson(result,null,res);
           }
        })
        
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
    }
    
    
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
    }
    
    this.showMap=function(req,res){
        var lat=req.params.lat;
        var lng=req.params.lng;
        var gmAPI = new GoogleMapsAPI(publicConfig);
        var latlng=lat+","+lng;
        var reverseGeocodeParams = {
          "latlng":        latlng,
          "result_type":   "postal_code",
          "language":      "en",
          "location_type": "APPROXIMATE"
        };
         
        
        var params = {
          center: '444 W Main St Lock Haven PA',
          zoom: 15,
          size: '500x400',
          maptype: 'roadmap',
          markers: [
            {
              location: '300 W Main St Lock Haven, PA',
              label   : 'A',
              color   : 'green',
              shadow  : true
            },
            {
              location: '444 W Main St Lock Haven, PA',
              icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
            }
          ],
          style: [
            {
              feature: 'road',
              element: 'all',
              rules: {
                hue: '0x00ff00'
              }
            }
          ],
          path: [
            {
              color: '0x0000ff',
              weight: '5',
              points: [
                '41.139817,-77.454439',
                '41.138621,-77.451596'
              ]
            }
          ]
        };

        gmAPI.staticMap(params, function(err, binaryImage) {
        if(err){console.log(err);
            console.log('oups');
        };
          res.json(binaryImage);
        });
    };
    
    this.isGoing=function(req,res){
        var cityId=req.params.id;
        var city=req.params.city;
        var layer=req.params.layer;
        Users.findOne({'userName':req.user.userName,'isGoingTo':cityId}).exec(function(err,user){
            if (err) throw err;
            if (user){
                Going.findOneAndUpdate({cityId:cityId},{$inc:{peopleGoing:-1}}).exec(function(err,data){
                    if (err) throw err;
                    user.update({$pull:{'isGoingTo':cityId}}).exec(function(err,updateUser){
                        if (err)throw err;
                        console.log('1 less');
                        if (layer==0){
                            res.redirect('/res/'+city);
                            
                        }
                        else{
                            res.redirect('/goTo/'+city+'/'+cityId);
                        }
                    });
                });
            }
            else{
                console.log('not found');
                Users.findOneAndUpdate({'userName':req.user.userName},{$push :{'isGoingTo':cityId}}).exec(function(err,data){
                    if (err)throw err;
                    Going.findOne({cityId:cityId}).exec(function(err,data){
                        if (err)throw err;
                        if(data){
                            data.update({$inc:{peopleGoing:1}}).exec(function(err,resp){
                                if (err)throw err;
                                console.log('1 more');
                                if (layer==0){
                                    res.redirect('/res/'+city);
                                    
                                }
                                else{
                                    res.redirect('/goTo/'+city+'/'+cityId);
                                }
                                    });
                        }
                        else{
                            var going=new Going( {cityId:cityId,peopleGoing:1});
                            going.save(function(err,go){
                                if (err)throw err;
                                console.log('1 new');
                                if (layer==0){
                                    res.redirect('/res/'+city);
                                    
                                }
                                else{
                                    res.redirect('/goTo/'+city+'/'+cityId);
                                }
                            });
                        }
                        
                    });
                });
                
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
        Going.findOne({cityId:data.id}).exec(function(err,going){
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
                                        data.nbrGoing='You and' + Number(nbrGoing-1)+' person';
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
            if (going[i].cityId==Id){
                if (going[i].peopleGoing&&going[i].peopleGoing<1){
                    return going[i].peopleGoing;
                }
                else {return 0}
            }
        }
        return 0;
    }
}

module.exports=Search;