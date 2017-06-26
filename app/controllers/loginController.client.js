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
            sign.style['box-shadow']='none';
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
    }
    
    
    
     
    function check(url){
        for (var i=0; i<url.length;i++){
            if(url[i]=='#'){
                url=url.slice(0,i);
                return url;
            }
        }
        return url;
    }
})();