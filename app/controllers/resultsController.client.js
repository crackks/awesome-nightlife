'use strict';

(function(){
    
    var result=document.querySelector('.results');
    var moreBtn=document.querySelector('.getMore-btn')
    var more=document.querySelector('.more');
    var redirect=document.querySelector('#redirect');
    var inputCity=document.querySelector('.inputCity');
    var newSearch=document.querySelector('.btn-search');
    var priceFilter=document.querySelector('.price');
    var catFilter=document.querySelector('.categories');
    var form=document.querySelector('form');
    var apiUrl=window.location.href+'/getInfo';
    var count=0;
    var city='';
    
    function Lights(){
        for (var i=0; i<3;i++){
            result.insertAdjacentHTML('beforeend',"<div class='light'></div>")
        }
    }
    
    function showInfo(data){
        console.log(data)
        var info=JSON.parse(data);
        console.log(info);
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
        console.log(business[0])
        for (var i=0;i<business.length;i++){
            txt="<div class='oneResult'><a href='/goTo/"+business[i].location.city+"/"+business[i].id+"'><img class='resImg' src=";
            txt+=business[i].image_url+" /></a><div class='resContent'><p style='font-family:Lobster; font-size:20px'><a style='color:rgb(50,50,50)' href='/goTo/"+business[i].location.city+"/";
            txt+=business[i].id+"'>" +business[i].name+"</a> ("+business[i].categories[0].title+")</p><p>";
            txt+=dispAddress(business[i].location)+"</p><p>"+dispRating(business[i].rating);
            txt+="</p><a style='text-decoration:none' href='/isGoingTo/"+business[i].location.city+"/0/"+business[i].id+"'><button  class='going-btn btn'>"+business[i].nbrGoing+" Going</button></a></div></div>";
            result.insertAdjacentHTML('beforeend', txt);
            Lights();
        }
        
        if (info.total>count*10){
            more.style.display='flex';
        }
        else{
            more.style.display='none';
        }}
    }
    
    moreBtn.addEventListener('click',function(){
        count++;
        var apiUrl=window.location.href+'/'+count+'/getMore';
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
        console.log(apiUrl)
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
    
    
    function dispRating(rating){
        var txt="<div class='rating-container'>";
        var rat=rating*2;
        txt+="<img class='stars-img'src='../../../public/img/stars/"+rat+".png'/>";
        txt+='</div>';
        return txt;
    }
    
})();