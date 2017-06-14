'use strict';

(function(){
    
    var result=document.querySelector('.results');
    var moreBtn=document.querySelector('.getMore-btn')
    var more=document.querySelector('.more');
    var redirect=document.querySelector('#redirect');
    var apiUrl=window.location.href+'/getInfo';
    var count=0;
    
    Lights();
    
    function Lights(){
        for (var i=0; i<3;i++){
            result.insertAdjacentHTML('beforeend',"<div class='light'></div>")
        }
    }
    
    function showInfo(data){
        console.log(data);
        var info=JSON.parse(data);
        if (info=="error"){
            redirect.click();
        }
        else{
        var info=JSON.parse(data);
        var business=info.businesses;
        console.log(business[0])
        for (var i=0;i<business.length;i++){
            var txt="<div class='oneResult'><a href='/goTo/"+business[i].location.city+"/"+business[i].id+"'><img class='resImg' src=";
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
    
    function dispAddress(addresses){
        if (addresses.address2){
            return addresses.address1+", "+addresses.address2+','+addresses.city;
        }
        else{
            return addresses.address1+', '+addresses.city;
        }
    }
    
    function dispRating(rating){
        var txt="<div class='rating-container'>";
        var rat=rating*2;
        if (rat%2==0){
            for (var i=0;i<rat/2;i++){
                txt+='<i class="fa fa-star" aria-hidden="true"></i>';
            }
        }
        else{
            for (var i=0;i<rat/2-1;i++){
                txt+='<i class="fa fa-star" aria-hidden="true"></i>';
            }
            txt+='<i class="fa fa-star-half-o" aria-hidden="true"></i>';
        }
        for(var j=0;j<9-rat;j++){
            txt+='<i class="fa fa-star-o" aria-hidden="true"></i>';
        }
        txt+='</div>';
        return txt;
    }
    
})();