'use strict';

const Yelp = require('node-yelp-api-v3');

function Search(){
    
    this.callApiByCityName=function(req,res){
        var city=req.params.city;
        
        const yelp = new Yelp({
          consumer_key: '4ZOfZXBV3Q9HQYrvGxnFcg',
          consumer_secret: 't3M1TgZJWs97kDI1a6DKW0M28cuDJaCe8Ut5p4SyoU52RMjImlLLQ8ICrHdIHR62'
        });
              
        yelp.searchBusiness({ location: city ,categorie:'Nightlife'}).then((results) =>res.json(results));
        
    };
    
    this.redirectTo=function(req,res){
        res.redirect('/res/'+req.query.city);
    };    
    
}

module.exports=Search;