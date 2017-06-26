'use strict';


    
   	
	var apiUrl=check(window.location.href)+'/getInfo';
    var namee=document.querySelector('#Name');
    var categorie=document.querySelector("#categorie");
    var phoneNbr=document.querySelector('#phoneNbr');
    var address=document.querySelector("#address");
    var ratingStars= document.querySelector('#rating');
    var review=document.querySelector('#review');
    var website=document.querySelector('#webSite');
    var image=document.querySelector('#image');
    var image2=document.querySelector('#image2');
    var image3=document.querySelector('#image3');
    var going=document.querySelector('.going2-btn');
    var imag1Link=document.querySelector('#img1Link');
    var imag2Link=document.querySelector('#img2Link');
    var imag3Link=document.querySelector('#img3Link');
    var nbrGoing=document.querySelector('#nbrGoing');
    var dispReview=document.querySelector('.dispReviews');
    var reviewNbr=document.querySelector('#reviewNbr');
    var otherCatBlock=document.querySelector('.otherCat');
    var addScript=document.querySelector('#Scri');
    var price=document.querySelector('#price');
    var logo=document.querySelector('.logo-yelp');
    var lgnDir=document.querySelector('#lgn');
    var loginBlock=document.querySelector('.loginBlock');
    var signUpBlock=document.querySelector('.signUpBlock');
    var apiRevUrl=check(window.location.href)+'/'+window.navigator.language+'/reviews';
    var lat;
    var lng;
    var catTxt='';
    var arrQ=[];
    var catArr=[];
    var id='';
    var clicked=[false,false];
    var city="";
    var login=document.querySelector('.popup');
    var reg=false;
    var loginBtn=document.querySelector('.loginBtn');
    var quitLog0=document.querySelector('.quitBtn0');
    var quitLog1=document.querySelector('.quitBtn1');
    
	function showInfo(data){
        var info=JSON.parse(data);
        console.log(info);
        lat=info.coordinates.latitude;
        lng=info.coordinates.longitude;
        addScript.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDk9TZizW1ZoGP-RsV7eqPu-QGtwnvfims&callback=initMap";
        namee.innerHTML=info.name;
        id=info.id;
        if(info.name.length>25){
            namee.style["font-size"]=45/info.name.length*25+'px';
            logo.style.display='none';
            
        }
        var catLength=info.categories.length
        if (catLength>2){
            catLength=2;
        }
        catTxt='<p>';
        for (var i=0;i<catLength;i++){
            catTxt+='<a id="cat'+i+'" href=#nbrGoing>';
            catTxt+=info.categories[i].title;
            catTxt+='</a>';
            if (i<catLength-1){
                catTxt+=', ';
            }
            catArr[i]=info.categories[i].alias;
        }
        catTxt+='</p>';
        categorie.insertAdjacentHTML('afterend',catTxt);
        for (var k=0;k<catLength;k++){
            arrQ[k]=document.querySelector('#cat'+k);
            
        }
        arrQ.forEach(function(elem,ind){
            elem.addEventListener('click',function(){dispCat(ind);});
        });
        phoneNbr.innerHTML=info.display_phone;
        
        for (var j=0;j<info.location.display_address.length;j++){
            if(info.location.display_address[j]){
                address.innerHTML+=info.location.display_address[j];
                if (j<info.location.display_address.length-1){
                    address.innerHTML+=', ';
                }
            }
        }
        city=info.location.city;
        review.innerHTML=info.review_count;
        website.href=info.url;
        image.src=info.image_url;
        imag1Link.href=info.image_url;
        image2.src=info.photos[1];
        imag2Link.href=info.photos[1];
        image3.src=info.photos[2];
        imag3Link.href=info.photos[2];
        nbrGoing.innerHTML=info.nbrGoing;
        
        if (reg){
            loginBlock.action='/goTo/'+city+'/'+id+'/1/log';
            signUpBlock.action='/goTo/'+city+'/'+id+'/1/sign';
        }
        else{
            loginBlock.action=id+'/1/log';
            signUpBlock.action=id+'/1/sign';
        }
        
        if (info.price){
            
        price.insertAdjacentHTML('afterend',"<p class='separator'> | </p><p>"+info.price+"</p>");
            
        }
        ratingStars.insertAdjacentHTML('beforeend', dispRating(info.rating));
        
        
    }
    var url=check(window.location.href);
     if (url.slice(url.length-4,url.length)=='/reg'){
        login.style.display='block';
        lgnDir.click();
        url=url.slice(0,url.length-4);
        apiRevUrl=url+'/'+window.navigator.language+'/reviews';
        apiUrl=url+'/getInfo';
        reg=true;
    }
    else if(url.slice(url.length-4,url.length)=='/log'){
        login.style.display='block';
        lgnDir.click();
        url=url.slice(0,url.length-4);
        apiRevUrl=url+'/'+window.navigator.language+'/reviews';
        apiUrl=url+'/getInfo';
        reg=true;
        loginBtn.click();
    }
        
    quitLog0.addEventListener('click',function(){
        login.style.display='none';
    });
    quitLog1.addEventListener('click',function(){
        login.style.display='none';
    });
    
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, showInfo));
    
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiRevUrl, showReviews));
     
    
   
     
    
    function showReviews(data){
        var info=JSON.parse(data);
        reviewNbr.innerHTML=info.reviews.length+' out of '+info.total;
        for (var i=0;i<info.reviews.length;i++){
            var txt='<div class="oneReview"><img class="revImg" src="'+isImg(info.reviews[i].user.image_url)+'"/>';
            txt+='<div class="revContent"><p>'+dispRating2(info.reviews[i].rating)+'</p>';
            txt+='<p style="font-size:12px">'+info.reviews[i].text+needMore(info.reviews[i].text,info.reviews[i].url)+'</p><p>By '+info.reviews[i].user.name+' on ';
            txt+=friendlyDate(info.reviews[i].time_created)+'</p></div></div>';
            dispReview.insertAdjacentHTML('beforeend', txt);
        }
    }
    
    function isImg(imgUrl){
        if(imgUrl){
            return imgUrl;
        }
        else{
            return 'https://s3-media4.fl.yelpcdn.com/photo/LbzTc5MET1s82GEpqsMDXg/o.jpg';
        }
    }
    
    going.addEventListener('click',function(){
        var apiCheck=window.location.origin+'/checkLog';
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiCheck, checkLog));
    });
    
    function checkLog(data){
        if (data=='false'){
            login.style.display='block';
            lgnDir.click();
        }
        else{
            var apiGoingurl=window.location.origin+'/isGoingTo/'+city+'/1/'+id;
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', apiGoingurl, EditGoing));
        }
    }
    
    function EditGoing(data){
        var info=JSON.parse(data);
        nbrGoing.innerHTML=info.nbrGoing;
    }
    
    function dispCat(k){
        if(!clicked[k]){
            clicked=[false,false];
            clicked[k]=true;
            otherCatBlock.innerHTML='';
            var apiFilterUrl=check(window.location.href)+'/'+catArr[k]+'/catSearch';
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiFilterUrl, showFilterInfo))};
    }
     
     
    function showFilterInfo(data){
        var info=JSON.parse(data);
        var business=info.businesses;
        var dispCounter=0;
        for (var i=0;i<business.length;i++){
            if (business[i].id==id){
                i++;
            }
            var txt="<div class='oneCatResult'><a href='/goTo/"+business[i].location.city+"/"+business[i].id+"'><img class='resImg' src=";
            txt+=business[i].image_url+" /></a><div class='resContent'><p style='font-family:Lobster; font-size:20px'><a style='color:rgb(50,50,50)' href='/goTo/"+business[i].location.city+"/";
            txt+=business[i].id+"'>" +business[i].name+"</a></p><p>";
            txt+=dispAddress(business[i].location)+"</p><p>"+dispRating(business[i].rating);
            txt+="</p><a style='text-decoration:none' href='/isGoingTo/"+business[i].location.city+"/0/"+business[i].id+"'><button  class='going-btn btn'>"+business[i].nbrGoing+" Going</button></a></div></div>";
            otherCatBlock.insertAdjacentHTML('beforeend', txt);
            dispCounter++;
            if (dispCounter==9){
                break;
            }
        }
    } 
     
    function needMore(text,url){
        if(text.slice(text.length-3,text.length)=='...'){
            return ' <a href='+url+' target="_blank">read more</a>';
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
    
    
   
    
    function check(url){
        for (var i=0; i<url.length;i++){
            if(url[i]=='#'){
                url=url.slice(0,i);
                return url;
            }
        }
        return url;
    }
    
	function initMap() {
        var uluru = {lat:lat, lng:lng};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
      
      
      
    function dispRating(rating){
        var txt="<div class='rating-container'>";
        var rat=rating*2;
        txt+="<img class='stars3-img'src='../../../public/img/stars/"+rat+".png'/>";
        txt+='</div>';
        return txt;
    }
    
    function dispRating2(rating){
        var txt="<div class='rating2-container'>";
        var rat=rating*2;
        txt+="<img class='stars2-img'src='../../../public/img/stars/"+rat+".png'/>";
        txt+='</div>';
        return txt;
    }
    
    function dispAddress(addresses){
        
        if (!addresses.address1){
            return addresses.city;
        }
        else{
            return addresses.address1+', '+addresses.city;
        }
    }
