'use strict';

(function(){
    var body=document.querySelector('body');
    var backgrounds=['/public/img/pexels-photo-110472.jpeg',
                    '/public/img/pexels-photo-198485.jpeg',
                    '/public/img/pexels-photo-424184.jpeg',
                    '/public/img/city-cars-traffic-lights.jpeg',
                    '/public/img/city-marketing-lights-night.jpg'];
    var rdm=Math.floor(Math.random()*backgrounds.length);
    console.log(rdm);
    var background='url('+backgrounds[rdm]+') no-repeat center center';
    body.style.background=background;
    body.style['background-size']= 'cover';
    body.style.width='100%';
    body.style.height='710px';
    
})();