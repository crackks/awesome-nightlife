'use strict';

(function(){
    
    var result=document.querySelector('.results');
    var moreBtn=document.querySelector('.getMore-btn')
    var more=document.querySelector('.more');
    var apiUrl=window.location.href+'/getInfo';
    var count=0;
    
    Lights();
    
    function Lights(){
        for (var i=0; i<3;i++){
            result.insertAdjacentHTML('beforeend',"<div class='light'></div>")
        }
    }
    
    function showInfo(data){
        var info=JSON.parse(data);
        console.log(info)
        var business=info.businesses;
        console.log(business[0])
        for (var i=0;i<business.length;i++){
            var txt="<div class='oneResult'><a href='/goTo/"+business[i].id+"'><img class='resImg' src="+business[i].image_url+" /></a><div class='resContent'><p style='font-family:Lobster'><a style='color:rgb(50,50,50)' href='/goTo/"+business[i].id+"'>" +business[i].name+"</a> ("+business[i].categories[0].title+")</p><p>"+dispAddress(business[i].location)+"</p><p> Rating :"+business[i].rating+" / 5</p><button class='going-btn btn'><span id='going'>0 </span> Going</button></div></div>";
            result.insertAdjacentHTML('beforeend', txt);
            Lights();
        }
        
        if (info.total>count*10){
            more.style.display='flex';
        }
    }
    
    moreBtn.addEventListener('click',function(){
        count++;
        var apiUrl=window.location.href+'/'+count+'/getMore';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    });
    
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