'use strict';

(function () {
    var log=document.querySelector('.loginBtn');
    var sign=document.querySelector('.signUpBtn');
    var logBlock=document.querySelector('.loginBlock');
    var signBlock=document.querySelector('.signUpBlock');
    
    var logShown=false;
    var signShown=true;
    var activ='rgb(255,255,255)';
    var unactiv='rgb(10,150,250)';
    
    // var body=document.querySelector('body');
    // var backgrounds=['/public/img/pexels-photo-110472.jpeg',
    //                 '/public/img/pexels-photo-198485.jpeg',
    //                 '/public/img/pexels-photo-424184.jpeg',
    //                 '/public/img/city-cars-traffic-lights.jpeg',
    //                 '/public/img/city-marketing-lights-night.jpg'];
    // var rdm=Math.floor(Math.random()*backgrounds.length);
    // console.log(rdm);
    // var background='url('+backgrounds[rdm]+') no-repeat center center';
    // body.style.background=background;
    // body.style['background-size']= 'cover';
    // body.style.width='100%';
    // body.style.height='750px';
    var url=check(window.location.href);
    
    
    sign.style.background=activ;
    sign.style.color=unactiv;
    sign.style['box-shadow']='0px 0px 5px '+activ;
    log.style.color=activ;
    log.addEventListener('click',function(){
        if (!logShown){
            logBlock.style.display='flex';
            signBlock.style.display='none';
            sign.style.background=unactiv;
            sign.style.color=activ;
            sign.style['box-shadow']='none'
            log.style.background=activ;
            log.style.color=unactiv;
            log.style['box-shadow']='0px 0px 5px '+activ;
            logShown=true;
            signShown=false;
        }
    });
    
    sign.addEventListener('click',function(){
        if (!signShown){
             logBlock.style.display='none';
            signBlock.style.display='flex';
            log.style.background=unactiv;
            log.style.color=activ;
            log.style['box-shadow']='none';
            sign.style.background=activ;
            sign.style.color=unactiv;
            sign.style['box-shadow']='0px 0px 5px '+activ;
            signShown=true;
            logShown=false;
        }
    });
    
    if (url.slice(url.length-4,url.length)=='/log'){
        log.click();
        console.log('ok')
    }
})();