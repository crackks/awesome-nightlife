'use strict';

(function(){
    
    var result=document.querySelector('.results');
    var apiUrl=window.location.href+'/getInfo';
    
    
    
    
    function showInfo(data){
        var info=JSON.parse(data);
        var business=info.businesses
        console.log(business[0])
        for (var i=0;i<business.length;i++){
            var txt="<div class='oneResult'><img class='resImg' src="+business[i].image_url+" /><div class='resContent'><p style='font-family:Lobster'>" +business[i].name+" ("+business[i].categories[0].title+")</p><p>"+dispAddress(business[i].location)+"</p><p> Rating :"+business[i].rating+" / 5</p></div></div>"
            result.insertAdjacentHTML('beforeend', txt);
        }
    }
    
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    
    function dispAddress(addresses){
        if (addresses.address2){
            return addresses.address1+", "+addresses.address2;
        }
        else{
            return addresses.address1;
        }
    }
    
    
})();