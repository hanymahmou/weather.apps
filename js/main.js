const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn"); 
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "68fd587881d42aea0566e5e5c82603f6"; // Api key for openweathermap api

const createWeatherCard = ( cityName, WeatherItem , index) =>{
  if(index === 0){

    return `  <div class="details">
    <h2>${cityName} (${WeatherItem.dt_txt.split(" ")[0]})</h2>
    <h4>temperature : ${(WeatherItem.main.temp - 273.15).toFixed(2)}°c </h4>
    <h4> wind : ${WeatherItem.wind.speed} M/s</h4>
    <h4> humidity : ${WeatherItem.main.humidity} %</h4>
</div>
<div class="icon">
    <img src="https://openweathermap.org/img/wn/${WeatherItem.weather[0].icon}@4x.png" alt="Weather-icon">
    <h4> ${WeatherItem.weather[0].description}</h4>
</div>`

  }else{
    return ` <li class="card">
    <h3>(${WeatherItem.dt_txt.split(" ")[0]})</h3>
     <img src="https://openweathermap.org/img/wn/${WeatherItem.weather[0].icon}@2x.png" alt="Weather-icon">
    <h4>temp : ${(WeatherItem.main.temp - 273.15).toFixed(2)}°c </h4>
    <h4> wind : ${WeatherItem.wind.speed} M/s</h4>
    <h4> humidity : ${WeatherItem.main.humidity} %</h4>
  </li>`;
  }
 
};

const  getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY} ` ; 

  fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
    const uniqueForcastDays = [ ];
  const threeDaysForecast =  data.list.filter(forecast => {
      const forecastDate = new Date(forecast.dt_txt).getDate();
      
      if (!uniqueForcastDays.includes(forecastDate)){
      return uniqueForcastDays.push(forecastDate);
      }
    });
    cityInput.value = "";
    weatherCardsDiv.innerHTML = "";
    currentWeatherDiv.innerHTML = "";
    console.log(threeDaysForecast);
    threeDaysForecast.forEach((WeatherItem , index)=> {
      if (index === 0){
        currentWeatherDiv.insertAdjacentHTML("beforeend" ,  createWeatherCard(cityName , WeatherItem , index));
      } else{
        weatherCardsDiv.insertAdjacentHTML("beforeend" ,  createWeatherCard(cityName ,WeatherItem , index));
      }
    });

  }).catch(() => {
      alert("An error occured while fetching the weather forecast!");
    });
}

const getCity = () => {
  const cityName = cityInput.value.trim(); // Get user enterd city name and remove extra spaces
  if (!cityName) return; // Return if cityName is empty
  const GEoCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEoCODING_API_URL).then((res) => res.json()).then((data) => {
      if (!data.length) return alert(`No data founded for ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occured while fetching the getCity!");
    });
};

const getuser = () => {
  navigator.geolocation.getCurrentPosition(
    position => {
     const {latitude , longitude} = position.coords ;
     const Reverse_Geocoding_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`; 
     fetch(Reverse_Geocoding_url).then((res) => res.json()).then((data) => {
      const { name } = data[0];
      getWeatherDetails(name, latitude, longitude);
    })
    .catch(() => {
      alert("An error occured while fetching the city!");
    });
    },
    error => {
      if(error.code === error.PERMISSION_DENIED) {
        alert('geolocation request denied. please reset location permission to grant acces again')
      }

    }
  )
}

searchButton.addEventListener("click", getCity);
locationButton.addEventListener('click', getuser);
cityInput.addEventListener('keyup' , e => e.key === "Enter" && getCity())
