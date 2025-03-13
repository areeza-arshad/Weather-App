const apiKey = "555c892b105a4b4c9d7125358253101";
const searchBox = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box button');
const searchInput = document.getElementById('userInput');
const geoBtn = document.getElementById('geoButton');

async function checkWeather(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;
    const astroUrl = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        console.error("new error");
    } else {
        const data = await response.json();
        
        document.querySelector('.name').innerHTML = data.location.name;
        document.querySelector('.temprature').innerHTML = Math.round(data.current.temp_c) + "°C";
        document.querySelector('.wind').innerHTML = data.current.wind_kph + "km/h";
        document.querySelector('.humidity').innerHTML = data.current.humidity + "%";

        const weatherIcon = document.querySelector('.weather-icon');
        weatherIcon.src = "https:" + data.current.condition.icon;
        weatherIcon.alt = data.current.condition.text;

        const astroResponse = await fetch(astroUrl);
        const astroData = await astroResponse.json();
        
        if (astroData.astronomy && astroData.astronomy.astro) {
            document.querySelector('.sunrise-time').innerHTML = astroData.astronomy.astro.sunrise.replace(" AM", "");
        } else {
            console.error("Astronomy data missing:", astroData);
        }
        
        document.querySelector('.city-data').style.display = "block";
        document.querySelector('.error').style.display = "none";  

        displayForecast(data.forecast.forecastday);
    }
}
searchBtn.addEventListener('click', () => {
    const searchQuery = searchInput.value.trim(); // Use searchInput instead of searchBox
    if (searchQuery) {
        checkWeather(searchQuery);
    }
});
// searchBtn.addEventListener('click', () => {
//     const searchQuery = searchBox.value.trim();
//     if (searchQuery) {
//         checkWeather(searchQuery);
//     }
// });

geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            checkWeather(`${lat},${lon}`);
        },
        error => {
            console.error("getting error", error);
            alert("location access denied");
        });
    }
    else{
        alert("geolocation is not supported by this browser");
    }
});
function displayForecast(forecastData) {
    const forecastContainer = document.querySelector('.forecast');
    forecastContainer.innerHTML = '';

    forecastData.forEach(day => {
        const date = new Date (day.date).toDateString();
        const temp = Math.round(day.day.avgtemp_c) + "°C";
        const icon = day.day.condition.icon;
        const condition = day.day.condition.text;
        

        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        const dateElement = document.createElement('p');
        dateElement.textContent = date;

        const conditionElement = document.createElement("p");
        conditionElement.textContent = condition;
        

        const iconElement = document.createElement("img");
        iconElement.src = "https:" + icon;
        iconElement.alt = condition;

        const tempElement = document.createElement('p');
        tempElement.textContent = temp;

        
        forecastDay.appendChild(dateElement);
        forecastDay.appendChild(conditionElement);
        forecastDay.appendChild(iconElement);
        forecastDay.appendChild(tempElement);
        

        forecastContainer.appendChild(forecastDay);

    });
}