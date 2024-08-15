//fetch all the custom attributes which have needed

//first target me tab me switch karu: So i create function which will be used to switch the tab

// firstly fetch tabs

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");//class ko dot(.) ke sath likhte hai
const userInfoContainer = document.querySelector(".user-info-container");

const search_error = document.querySelector(".search_error");

//Humne dekha ki weather app ko reload karne par bydefault currentTab=userTab and background color of userTab=background-color: rgba(219, 226, 239, 0.5); show hoga so:- 

let currentTab=userTab;//By default we have considered that currentTab is on userTab
const API_KEY="b2269b13f92708704a3d8584997e1619";
currentTab.classList.add("current-tab");//currentTab ki classList me current-tab name ki class add kardo//jo bhi currenttab ki property hogi vo me iski classList me add kar dunga

//getfromSessionStorage();

//Swithing:Jab bhi hum kisi tab ke uper click karenge ta switch hoga-Ya to your weather par click karenge tab ya fir seach weather par click karenge tb so humne yha eventListener ka use kiya your weather par and search weather par hai and event click hai

//ek kam or pending hai=?

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab"); 
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
    

    //Abhi mujhe ye nhi pta ki me search tab par khada hu ya your weather vale tab par khada hu
    //koi tab visible hai to me kah sakta hu ki uske andar active vali class on(chalu) hai
    //yha par mene searchForm ki classList me active class on nhi hai iska matlab search weather vale tab par hi jana hai to mene browser se bola tum your weather and grant access vali screen ko hide kardo and search weather vali screen dikha do

    if(!searchForm.classList.contains("active")){
         //kya search form wala container is invisible, if yes then make it visible
         userInfoContainer.classList.remove("active");
         grantAccessContainer.classList.remove("active");
         searchForm.classList.add("active");
    }
    else{
        //main pehle search wale tab pr tha, ab your weather tab visible karna h 
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        search_error.classList.remove("active");
        //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first for coordinates, if we haved saved them there.
        //Your weather par click akrne par apne aap weather aa rha hai kyoki apne aap isko coordinates mil rhe hai kyoki jab mene ss session ke andar local storage ke andar coordinates save kr rakhe hai
        getfromSessionStorage();//niche likha hai
        //Github se mila hai:-niche val
        // search_input.value = "";
    }
}
}


userTab.addEventListener('click',()=>{//function ko htake arrow(=>) ka use kiya this is called arrow fucntion
    //pass clicked tab as input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
//coordinates=latitude and longitude
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);//coordinates=latitude and longitudekk
        //JSON parse ek JSON string ko JSON object me convert karta hai
        //JSON string ko backtic(``) ke andar likhte and JSON object ko nhi
        fetchUserWeatherInfo(coordinates);//niche likha hai
    }
}

getfromSessionStorage();

//API call karna hai to async function use karna padega 

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;//coordinates se latitude and longitude nikal liye ese likhe
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );

          //lat and lon and API_KEY dalkar google par search karoge to response aa jayega

        const  data = await response.json();
         //ab api dta lekar aa gyi hai to loader screen ko hta do:-
        loadingScreen.classList.remove("active");
        //Ab humare pass weather ki information aa gyi hai to hume Your Weather vale UI/Screen ko Visible karna padega so:-
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);//Niche likha hai
        //JO bhi data aaya us data ke andar se values nikalkar Your weather vale UI me render karayega.
    }
    catch(err) {
        // loadingScreen.classList.remove("active");
        //HW
        // console.log("error");
    }
}

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fetch all the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements

    //Aap kisi JSON object ke andar kisi particular property ko access karna chahte to use "optional chaning operator ke dwara access kar skate hai"
    //Let say agr vo property JSON object me exist hi nhi karti to optional chaning parameter koi error nhi dega balki undefined value de dega 

    //optional chaning operator= ?
    //dot operator=kisi property or etc ke andar jane ke liye use hota hai

    cityName.innerText = weatherInfo?.name;
    //ye if vala part Kratik ne kiya error handling ke liye
    if(cityName.innerText=="undefined"){
        throw err;
    }

    //Jab API ko google par daloge aur koi bhi latitude and longitude daloge to to google par response aayega usee JSON formator se JSON object me convert karke vha par dekhnge ki konsi chij kha padi, uske base par likha jese cityName weatherInfo ke name attribute me likha hai so weatherInfo?.name likha aur ese hi aur ke liye bhi likhna hai 
    
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;//degree symbol=Alt+0176 on numeric keypad
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}
//Jab bhi grant access vale button par click karu do location find out karo-1.Jis location par ho vo location find out karo using geo location API and 2.geo location se jo latitude and longitude mile unko save kar do sessionstorage me 


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);//showPosition function niche likha hai
    }else{
        //HW-show an alert for no geolocation support available
        console.log("No geolocation support");
    }
}
function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);//niche likha hai
});

//for click on search weather 

//mujhe pta hai ki me city ke aadhar par API call karunga to me fetchSearchWeatherInfo function ko async bna dunga



async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    search_error.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );   
        const data = await response.json();
        // renderWeatherInfo(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        searchInput.value="";
    }catch(err) {
        //HW
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        search_error.classList.add("active");
        searchInput.value="";
    }
}

// flow:-

//2 tab hai-1 Your weather and 2 Search weather

//Your weather par click kiya to 2 case honge 1.grant access vali screen dekhegi and 2 directly weather dikhega(tabhi jab coordinates sessionstorage ke andar present ho)

//Search weather par click kiya to iske andar ek input field dikhti hai and ek button dikhta hai search ka aur iske bad tumhe yha weather dikh jayega agar tum kuch search kar lo

//Your weather se grant access vali screen tab dikhegi jab tumhare pass coordinates(latitude and longitude) available nhi honge sessionstorage ke andar 

//Grant access vale button se hum current location find out karte hai uske bad tum current location ko save karte ho uske bad tum weather ki API call karte ho

//search weather me jese hi mujhe input field se input milta hai us input ke liye me API call karta hu and jese hi API call se response aata hai us response se me API call kar deta hu 










