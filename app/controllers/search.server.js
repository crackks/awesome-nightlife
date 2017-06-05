'use strict';
var Yelp = require('yelpv3');
 

function Search(){
    
    this.callApiByCityName=function(req,res){
        var city=req.query.city;
        var yelp = new Yelp({
            app_id: process.env.Yelp_apiKey,
            app_secret: process.env.Yelp_apiSecret
        });
        yelp.search({location: city, limit: 10})
            .then(function (data) {
                console.log(data);
            })
            .catch(function (err) {
                console.error(err);
            });
        
    };
    
        
    
}

module.exports=Search;