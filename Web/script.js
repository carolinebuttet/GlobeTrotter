// Globe Trotter
// A tangible and interactive picture viewer
// An original idea by Caroline Buttet
// www.carolinebuttet.ch
//
// THIS SCRIPT INTERPRETS KEYSTROKES AND DISPLAYS THE PHOTOS. 
//IT WORKS WIT A REGULAR KEYBOARD OR YOUR ARDUINO WITH THE KEYBOARD LIBRARY.
//General advice: As this page is mainly about displaying photos quickly, it is important that you optimize your images, otherwise your loading time will be really long and will ruin the fun. 
//Ideally the picture size should be the size of your screen, and be optimized for the web. For example, my images are 1920x1800px and weight around 1MO.  
//Have fun!

$( document ).ready(function() {
    //Every time a key is pressed, we check if we need to do anything.
    document.onkeydown = checkKey;
    //Our variables
    var firstScreenHTML = $('#welcome-screen-pick-country').html();
    var spinToStartHTML =$('#spinToStart').html();
    var albumScreenHTML =$('#albumScreen').html();
    
    //Country-specific variables;
    var ethiopiaTitleHTML = $('#ethiopiaTitle').html();
    var namibiaTitleHTML = $('#namibiaTitle').html();
    var madagascarTitleHTML = $('#madagascarTitle').html();
    var franceTitleHTML = $('#franceTitle').html();
    var vietnamTitleHTML = $('#vietnamTitle').html();
    var philippinesTitleHTML = $('#philippinesTitle').html();
    var japanTitleHTML = $('#japanTitle').html();
    var chinaTitleHTML = $('#chinaTitle').html();

    //the counry "class"
    function Country(name, numberOfPics, customHtml, keyCode){
       //the name of the country, which should match your album name in your data folder
       this.name = name;
       //the number of pictures you have in this album
       this.numberOfPics = numberOfPics;
       //the HTML code linked to this country
       this.customHtml = customHtml;
       //the keycode for this country. list of keycodes here: http://keycode.info/
       this.keyCode= keyCode;
    }
    //the countries to display
    var country;    
    var ethiopia = new Country("ethiopia", 3, ethiopiaTitleHTML,'69');                    //KEYCODE 69 = E
    var france = new Country("france",3,franceTitleHTML,'70');                             //KEYCODE 70 = F
    var madagascar = new Country('madagascar',3, madagascarTitleHTML,'77');                //KEYCODE 77 = M
    var namibia = new Country('namibia',3, namibiaTitleHTML,'78');                        //KEYCODE 78 = N        
    var vietnam = new Country('vietnam',3, vietnamTitleHTML,'86');                         //KEYCODE 86 = V
    var philippines = new Country('philippines',3, philippinesTitleHTML,'80');             //KEYCODE 80 = P
    var japan = new Country('japan',3, japanTitleHTML,'74');                               //KEYCODE 74 = J  
    var china = new Country('china',3, chinaTitleHTML,'67');                              //KEYCODE 67 = C

    //An array of all the countries.
    var allCountries=[ethiopia, france, madagascar, namibia, vietnam, philippines, japan, china];
    
    //transition time in miliseconds
    var standardFadeInTime = 1500;
    //waiting time in miliseconds
    var waitingTime =4000;
    //the initial position of the globe, before it is spinned
    var spinCount =1;

    //Some booleans to keep track of where we are in the process.
    var isWaiting = false;
    var hasInitiatedSpinScreen=false;
    var countryIsPicked=false;

    //first, we load the "welcome screen"
    loadHTML(firstScreenHTML, standardFadeInTime);

    //FUNCTION THAT IS CALLED EVERYTIME A KEY IS PRESSED
    function checkKey(e) {
        //If we are not displaying any info or instructions, we can update the screen.
        if(!isWaiting){
        console.log("keydown!");
            e = e || window.event;

            //We check if the key we pressed is linked to one of our countries to display.
            //if yes, we define the country and display the first image. 
            for(i=0; i<allCountries.length ; i++){
                if(e.keyCode == allCountries[i].keyCode){
                    country=allCountries[i];
                    console.log(allCountries[i].name);
                    spinCount=0;
                    hasInitiatedSpinScreen=false;
                    countryIsPicked=true;
                    initCountry();
                }
            }

            //If we spin the globe clockwise
            // "S" for spin
            if (e.keyCode == '83') {
               //only update if a country has been selected
               if(countryIsPicked ==true){
                    console.log("spiiiiiiin!!!");
                    // if it is the first spin, load the "spin screen"
                    if(hasInitiatedSpinScreen==false){
                   loadHTML(albumScreenHTML,standardFadeInTime);
                     console.log('load advice');
                       }
                    // if the scpin screen has already been intiated, then just update the picture. 
                    hasInitiatedSpinScreen=true;
                    updatePicture();
                    spinCount++;

                    if(spinCount == country.numberOfPics+1){
                        spinCount=1;
                    }
                    actualizePic(country.name, spinCount);
                }
            }
            // "A" for reverse spin
            else if (e.keyCode == '65') {
               //only update if a country has been selected
               if(countryIsPicked ==true){
                    console.log("spiiiiiiin!!!");
                    updatePicture();
                    //Go back in the pictures if we are not at the start of the album.                    
                    if(spinCount>1){
                        spinCount--;
                        actualizePic(country.name, spinCount);
                    }
                    if(spinCount==0){
                        spinCount=1;
                    }
                    actualizePic(country.name, spinCount);
                }
            }

            }else{
                console.log("not allowed to interact during transition");
            }
    }

    //Updating the picture. 
    function actualizePic(countryName, actualSpinPosition){
    	console.log("actualizing background... selected country is " + countryName +"with position " + actualSpinPosition);
        //we need to check the actualSpinPosition to know how many zeroes we need to put before the acutal number. 

    	if(actualSpinPosition == country.numberOfPics){
            //if we are at the end of the album, we preload the first picture. 
            preload(["data/"+countryName+"/Pic0001.JPG"]);
        }

        if(actualSpinPosition<10){
	    	$('body').css("background-image", "url(data/"+ countryName + "/Pic000"+ actualSpinPosition + ".JPG)");
            if(actualSpinPosition<country.numberOfPics){
                if(actualSpinPosition==9 && actualSpinPosition<=country.numberOfPics){
	    			//preload the next image for quicker display
                    preload(["data/"+countryName+"/Pic00"+(actualSpinPosition+1)+".JPG"]);
	    		}
	    		else{
	    		   preload(["data/"+countryName+"/Pic000"+(actualSpinPosition+1)+".JPG"]);
	    		}
            }
    	}

    	else if(actualSpinPosition>=10 && actualSpinPosition<100 && actualSpinPosition<=country.numberOfPics){
	        $('body').css("background-image", "url(data/"+ countryName + "/Pic00"+ actualSpinPosition + ".JPG)");
            if(actualSpinPosition<country.numberOfPics){
                if(actualSpinPosition==99){
	    			preload(["data/"+countryName+"/Pic0"+(actualSpinPosition+1)+".JPG"]);
	    		}
	    		else{
	    		   preload(["data/"+countryName+"/Pic00"+(actualSpinPosition+1)+".JPG"]);
	    		}
            }
    	}

    	else if(actualSpinPosition>=100 && actualSpinPosition<=country.numberOfPics){
    	   $('body').css("background-image", "url(data/"+ countryName + "/Pic0"+ actualSpinPosition + ".JPG)");
           if(actualSpinPosition<country.numberOfPics){
                preload(["data/"+countryName+"/Pic0"+(actualSpinPosition+1)+".JPG"]);
            }
    	}

    }

    function loadHTML(element, fadeInTime){
        console.log('load html!');
        $("#gameArea").hide().html(element).fadeIn(fadeInTime);
        //preoload the next images for quicker display.
        preload(["data/ethiopia/Pic0001.JPG","data/namibia/Pic0001.JPG","data/madagascar/Pic0001.JPG","data/france/Pic0001.JPG"]);
        
    }
    function initCountry(){
        //initiating the country. This happens every time a new country is pressed.
        console.log(country);
        console.log(country.name);

        //Preventing interaction during transitions by setting isWaiting to true.
        isWaiting = true;
        loadHTML(country.customHtml, standardFadeInTime);
        $('body').css("background-image", "url(data/"+country.name+"/Pic0001.JPG)");
        //Preloading next image for quicker display. 
        preload(["data/"+country.name+"/Pic0002.JPG"]);

        setTimeout(function(){
            //Allowing interaction after the delay. 
            console.log("waited "+waitingTime/1000+" s");
            isWaiting = false;
            loadHTML(spinToStartHTML, standardFadeInTime);
        }, waitingTime);   
    }

    function updatePicture(){
        console.log('update pic!');
        console.log("spincount = " + spinCount);
    }


	function preload(arrayOfImages) {
	    $(arrayOfImages).each(function(){
	        $('<img/>')[0].src = this;
	    });
	}

});







