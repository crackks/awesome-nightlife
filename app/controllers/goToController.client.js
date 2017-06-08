'use strict';

(function(){
    
    var apiUrl=window.location.href+'/getInfo';
    var name=document.querySelector('#name');
    var categorie=document.querySelector("#categorie");
    var phoneNbr=document.querySelector('#phoneNbr');
    var address=document.querySelector("#address");
    var rating= document.querySelector('#rating');
    var review=document.querySelector('#review');
    var website=document.querySelector('#webSite');
    var image=document.querySelector('#image');
    var image2=document.querySelector('#image2');
    var image3=document.querySelector('#image3');
    
    function showInfo(data){
        var info=JSON.parse(data);
        console.log(info)
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
        rating.innerHTML=info.rating;
        review.innerHTML=info.review_count;
        website.href=info.url;
        image.src=info.image_url;
        image2.src=info.photos[1];
        image3.src=info.photos[2];
    }
    
    
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