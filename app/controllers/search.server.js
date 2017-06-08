'use strict';

const Yelp = require('node-yelp-api-v3');
var removeAccents=require("remove-accents")
function Search(){
    
    const yelp = new Yelp({
          consumer_key: '4ZOfZXBV3Q9HQYrvGxnFcg',
          consumer_secret: 't3M1TgZJWs97kDI1a6DKW0M28cuDJaCe8Ut5p4SyoU52RMjImlLLQ8ICrHdIHR62'
        });
        
    this.callApiByCityName=function(req,res){
        var city=req.params.city;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10}).then((results) =>res.json(results));
    };
    
    this.getMore=function(req,res){
        console.log('ok');
        var city=req.params.city;
        var offset=req.params.count*10;
        yelp.searchBusiness({ location: city ,categorie:'Nightlife',limit:10, offset:offset}).then((results) =>res.json(results));
    };
    
    this.redirectTo=function(req,res){
        res.redirect('/res/'+req.query.city);
    };    
    
    this.callApiById=function(req,res){
        var id=req.params.id;
        console.log(id);
        yelp.getBusinessById(removeAccents(id)).then((result) => res.json(result));
    };
}

module.exports=Search;