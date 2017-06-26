'use strict';

(function(){
    
    var result=document.querySelector('.results');
    var moreBtn=document.querySelector('.getMore-btn');
    var more=document.querySelector('.more');
    var inputCity=document.querySelector('.inputCity');
    var newSearch=document.querySelector('.btn-search');
    var priceFilter=document.querySelector('.price');
    var catFilter=document.querySelector('.categories');
    var apiUrl=check(window.location.href)+'/getInfo';
    var login=document.querySelector('.popup');
    var lgnDir=document.querySelector('#lgn');
    var loginBlock=document.querySelector('.loginBlock');
    var signUpBlock=document.querySelector('.signUpBlock');
    var count=0;
    var city='';
    var arrBtn=[];
    var arrId=[];
    var quitLog0=document.querySelector('.quitBtn0');
    var quitLog1=document.querySelector('.quitBtn1');
    var loginBtn=document.querySelector('.loginBtn');
    
    function Lights(){
        for (var i=0; i<3;i++){
            result.insertAdjacentHTML('beforeend',"<div class='light'></div>");
        }
    }
    
    function showInfo(data){
        var info=JSON.parse(data);
        if (count==0){
            result.innerHTML="";
            Lights();
        }
        if(info.error||info.total==0){
            var txt="<div class='oneResult'><p class='text-center no-res'>No Result</p></div>";
            result.insertAdjacentHTML('beforeend', txt);
            more.style.display='none';
        }
        else{
        var business=info.businesses;
        inputCity.value=business[0].location.city;
        city=business[0].location.city;
        for (var i=0;i<business.length;i++){
            txt="<div class='oneResult'><a href='/goTo/"+business[i].location.city+"/"+business[i].id+"'><img class='resImg' src=";
            txt+=business[i].image_url+" /></a><div class='resContent'><p style='font-family:Lobster; font-size:20px'><a style='color:rgb(50,50,50)' href='/goTo/"+business[i].location.city+"/";
            txt+=business[i].id+"'>" +business[i].name+"</a> ("+business[i].categories[0].title+")</p><p>";
            txt+=dispAddress(business[i].location)+"</p><p>"+dispRating(business[i].rating);
            txt+="</p><button  class='going-btn btn' id=going"+Number(count*10+i)+">"+business[i].nbrGoing+" Going</button></div></div>";
            result.insertAdjacentHTML('beforeend', txt);
            Lights();
            var num=Number(count*10+i);
            arrBtn[num]=document.querySelector('#going'+num);
            arrId[num]=business[i].id;
        }
        arrBtn.forEach (function(element,index){
            if (index>=count*10)
           element.addEventListener('click',function(){Going(index)});
        });
        loginBlock.action='/res/'+city+'/log';
        signUpBlock.action='/res/'+city+'/sign';
        if (info.total>count*10){
            more.style.display='flex';
        }
        else{
            more.style.display='none';
        }}
    }
    
    var url=check(window.location.href);
    
    
    
     if (url.slice(url.length-4,url.length)=='/reg'){
        login.style.display='block';
        lgnDir.click();
        url=url.slice(0,url.length-4);
        
        
    }
    else if(url.slice(url.length-4,url.length)=='/log'){
        login.style.display='block';
        lgnDir.click();
        url=url.slice(0,url.length-4);
        
        loginBtn.click();
    }
    
    moreBtn.addEventListener('click',function(){
        count++;
        
        apiUrl=url+'/'+count+'/getMore';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    });
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    
    newSearch.addEventListener('click',function(){
        count=0;
        result.innerHTML="";
        if (!inputCity.value){
            inputCity.value=city;
        }
        Lights();
        apiUrl=window.location.origin+'/res/'+inputCity.value+'/'+priceFilter.value+'/'+catFilter.value+'/'+count+'/filter';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    });
    
    function dispAddress(addresses){
        if (addresses.address1==null){
            return addresses.city;
        }
        else if (addresses.address2){
            return addresses.address1+", "+addresses.address2+','+addresses.city;
        }
        else{
            return addresses.address1+', '+addresses.city;
        }
    }
    
    var id='';
    var k='';
    function Going(i){
        id=arrId[i];
        k=i;
        var apiCheck=window.location.origin+'/checkLog';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiCheck, checkLog));
    }
    function checkLog(data){
        if (data=='false'){
            login.style.display='block';
            lgnDir.click();
        }
        else{
            var apiGoingurl=window.location.origin+'/isGoingTo/'+city+'/0/'+id;
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiGoingurl, EditGoing));
        }
    }
    
    function EditGoing(data){
        var info=JSON.parse(data);
        arrBtn[k].innerHTML=info.nbrGoing+' Going';
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
    
    function dispRating(rating){
        var txt="<div class='rating-container'>";
        var rat=rating*2;
        txt+="<img class='stars-img'src='../../../public/img/stars/"+rat+".png'/>";
        txt+='</div>';
        return txt;
    }
    
    
    quitLog0.addEventListener('click',function(){
        login.style.display='none';
    });
    quitLog1.addEventListener('click',function(){
        login.style.display='none';
    });
    
})();