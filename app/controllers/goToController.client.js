'use strict';

(function(){
    
    var apiUrl=window.location.href+'/getInfo';
    
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
    var reviexTxtBtn=document.querySelector('#reviewTxt');
    var reviewBlock=document.querySelector('.reviewBlock');
    var dispReview=document.querySelector('.dispReviews');
    var reviewNbr=document.querySelector('#reviewNbr');
    var mapBlock=document.querySelector('.dispMap');
    var otherCatBlock=document.querySelector('.otherCat');
    var lat;
    var lng;
    
    var revClicked=false;
    var mapClicked=false;
    var otherCatClicked=false;
    
    function showInfo(data){
        var info=JSON.parse(data);
        console.log(info);
        name.innerHTML=info.name;
        for (var i=0;i<info.categories.length;i++){
            categorie.innerHTML+=info.categories[i].title;
            if (i<info.categories.length-1){
                categorie.innerHTML+=', ';
            }
        }
        phoneNbr.innerHTML=info.display_phone;
        for (var i=0;i<info.location.display_address.length;i++){
            address.innerHTML+=info.location.display_address[i];
            if (i<info.location.display_address.length-1){
                address.innerHTML+=', ';
            }
        }
        
        review.innerHTML=info.review_count;
        website.href=info.url;
        image.src=info.image_url;
        imag1Link.href=info.image_url;
        image2.src=info.photos[1];
        imag2Link.href=info.photos[1];
        image3.src=info.photos[2];
        imag3Link.href=info.photos[2];
        going.href="/isGoingTo/"+info.location.city+"/1/"+info.id;
        nbrGoing.innerHTML=info.nbrGoing;
        lat=info.coordinates.latitude;
        lng=info.coordinates.longitude;
        ratingStars.insertAdjacentHTML('beforeend', dispRating(info.rating));
    }
    address.addEventListener('click',function(){
        console.log(lat);
        console.log(lng);
        var apiMapUrl=window.location.origin+'/test/'+lat+'/'+lng;
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiMapUrl, showMap));
    })
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    
    
    reviexTxtBtn.addEventListener('click',function(){
        if (!revClicked){
        var apiRevUrl=window.location.href+'/'+window.navigator.language+'/reviews';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiRevUrl, showReviews));
        }
        
    })
    
    function showReviews(data){
        revClicked=true;
        mapClicked=false;
        otherCatClicked=false;
        var info=JSON.parse(data);
        console.log(info);
        reviewBlock.style.display='flex';
        mapBlock.style.display='none';
        otherCatBlock.style.display='none';
        reviewNbr.innerHTML=info.total;
        for (var i=0;i<info.reviews.length;i++){
            var txt='<div class="oneReview"><img class="resImg" src="'+info.reviews[i].user.image_url+'"/>';
            txt+='<div class="resContent"><p>'+dispRating(info.reviews[i].rating)+'</p>';
            txt+='<p>'+info.reviews[i].text+needMore(info.reviews[i].text,info.reviews[i].url)+'</p><p>By '+info.reviews[i].user.name+' on ';
            txt+=friendlyDate(info.reviews[i].time_created)+'</p></div></div>';
            dispReview.insertAdjacentHTML('beforeend', txt);
        }
        reviexTxtBtn.click();
        
    }
    
    function needMore(text,url){
        console.log(text.slice(text.length-3,text.length))
        if(text.slice(text.length-3,text.length)=='...'){
            return ' <a href='+url+'>read more</a>';
        }
        else{
            return '';
        }
    }
    
    function friendlyDate(date){
        var months=['January','February', 'Mars', 'April', 'May', 'June', 'July', 'August', 'September','October', 'November', 'December'];
        var txt=date.slice(8,10)+' '+months[Number(date.slice(5,7)-1)]+' '+date.slice(0,4)+' at'+date.slice(10,date.length);
        
        return txt;
    }
    
    function showMap(data){
        console.log(data);
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