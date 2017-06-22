'use strict';

(function(){
    var body=document.querySelector('body');
    var backgrounds=['/public/img/pexels-photo-110472.jpeg',
                    '/public/img/pexels-photo-198485.jpeg',
                    '/public/img/pexels-photo-424184.jpeg',
                    '/public/img/city-cars-traffic-lights.jpeg',
                    '/public/img/city-marketing-lights-night.jpg'];
    var rdm=Math.floor(Math.random()*backgrounds.length);
    var background='url('+backgrounds[rdm]+') no-repeat center center';
    body.style.background=background;
    body.style['background-size']= 'cover';
    body.style.width='100%';
    body.style.height='750px';
    
    var icon=document.querySelector('.icon-location');
    var redirect=document.querySelector("#redirect");
    var noLoc=document.querySelector('.noLocation')
    icon.addEventListener('click',function(){
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(function(position){
                var lat=position.coords.latitude;
                var long=position.coords.longitude; 
                var apiUrl=window.location.origin+'/location/'+lat+'/'+long;
                ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
            });
        }
        else{
            noLoc.style.display='block';
        }
        
    });
    
    
    function showInfo(data){
        data=JSON.parse(data);
        redirect.href=data.route;
        redirect.click();
    }
    
    
    
})();