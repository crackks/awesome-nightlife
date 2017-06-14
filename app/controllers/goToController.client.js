'use strict';

(function(){
    
    var apiUrl=check(window.location.href)+'/getInfo';
    
    var name=document.querySelector('#name');
    var categorie=document.querySelector("#categorie");
    var phoneNbr=document.querySelector('#phoneNbr');
    var address=document.querySelector("#address");
    var ratingStars= document.querySelector('#rating');
    var review=document.querySelector('#review');
    var website=document.querySelector('#webSite');
    var image=document.querySelector('#image');
    var image2=document.querySelector('#image2');
    var image3=document.querySelector('#image3');
    var going=document.querySelector('.btnLink');
    var imag1Link=document.querySelector('#img1Link');
    var imag2Link=document.querySelector('#img2Link');
    var imag3Link=document.querySelector('#img3Link');
    var nbrGoing=document.querySelector('#nbrGoing');
    var reviewTxtBtn=document.querySelector('#reviewTxt');
    var reviewBlock=document.querySelector('.reviewBlock');
    var dispReview=document.querySelector('.dispReviews');
    var reviewNbr=document.querySelector('#reviewNbr');
    var mapBlock=document.querySelector('.dispMap');
    var otherCatBlock=document.querySelector('.otherCat');
    var addScript=document.querySelector('#Scri');
    var lat;
    var lng;
    
    address.addEventListener('click',function(){
        console.log(lat);
        console.log(lng);
        //var apiMapUrl=check(window.location.origin)+'/test/'+lat+'/'+lng;
        //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiMapUrl, showMap));
        //var txt='<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDk9TZizW1ZoGP-RsV7eqPu-QGtwnvfims&callback=initMap" async defer></script>';
        //addScript.insertAdjacentHTML('beforeend',txt)
        
    })
    
    
    function check(url){
        for (var i=0; i<url.length;i++){
            if(url[i]=='#'){
                url=url.slice(0,i);
                return url;
            }
        }
        return url;
    }
    
    
    
    function showReviews(data){
        var info=JSON.parse(data);
        reviewNbr.innerHTML=info.total;
        for (var i=0;i<info.reviews.length;i++){
            var txt='<div class="oneReview"><img class="resImg" src="'+info.reviews[i].user.image_url+'"/>';
            txt+='<div class="revContent"><p>'+dispRating(info.reviews[i].rating)+'</p>';
            txt+='<p>'+info.reviews[i].text+needMore(info.reviews[i].text,info.reviews[i].url)+'</p><p>By '+info.reviews[i].user.name+' on ';
            txt+=friendlyDate(info.reviews[i].time_created)+'</p></div></div>';
            dispReview.insertAdjacentHTML('beforeend', txt);
        }
        reviewTxtBtn.click();
        
    }
    
   
    
   
  
    
    
    function dispRating(rating){
        var txt="<div class='rating-container2'>";
        var rat=rating*2;
        if (rat%2==0){
            for (var i=0;i<rat/2;i++){
                txt+='<i class="fa fa-star fa-2x" aria-hidden="true"></i>';
            }
        }
        else{
            for (var i=0;i<rat/2-1;i++){
                txt+='<i class="fa fa-star fa-2x" aria-hidden="true"></i>';
            }
            txt+='<i class="fa fa-star-half-o fa-2x" aria-hidden="true"></i>';
        }
        for(var j=0;j<9-rat;j++){
            txt+='<i class="fa fa-star-o fa-2x" aria-hidden="true"></i>';
        }
        txt+='</div>';
        return txt;
    }
    
})();