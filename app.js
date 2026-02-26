// WeatherApp Constructor

      function WeatherApp(apiKey) {

    this.apiKey = apiKey;

    this.apiUrl =
        "https://api.openweathermap.org/data/2.5/weather";

    this.forecastUrl =
        "https://api.openweathermap.org/data/2.5/forecast";

    this.searchBtn =
        document.getElementById("search-btn");

    this.cityInput =
        document.getElementById("city-input");

    this.weatherDisplay =
        document.getElementById("weather-display");

    // ✅ MOVE THESE HERE
    this.recentSearchesSection =
        document.getElementById("recent-searches-section");

    this.recentSearchesContainer =
        document.getElementById("recent-searches-container");

    this.recentSearches = [];

    this.maxRecentSearches = 5;

    this.init();
}

WeatherApp.prototype.loadRecentSearches = function() {

    const saved = localStorage.getItem('recentSearches');

    if (saved) {
        this.recentSearches = JSON.parse(saved);
    }

    this.displayRecentSearches();
};

WeatherApp.prototype.saveRecentSearch = function(city) {

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1).toLowerCase();

    const index = this.recentSearches.indexOf(cityName);

    if (index > -1) {
        this.recentSearches.splice(index, 1);
    }

    this.recentSearches.unshift(cityName);

    if (this.recentSearches.length > this.maxRecentSearches) {
        this.recentSearches.pop();
    }

    localStorage.setItem(
        'recentSearches',
        JSON.stringify(this.recentSearches)
    );

    this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function() {

    this.recentSearchesContainer.innerHTML = '';

    if (this.recentSearches.length === 0) {
        this.recentSearchesSection.style.display = 'none';
        return;
    }

    this.recentSearchesSection.style.display = 'block';

    this.recentSearches.forEach(function(city) {

        const btn = document.createElement('button');

        btn.className = 'recent-search-btn';

        btn.textContent = city;

        btn.addEventListener('click', function() {

            this.cityInput.value = city;
            this.getWeather(city);

        }.bind(this));

        this.recentSearchesContainer.appendChild(btn);

    }.bind(this));
};

// init method
WeatherApp.prototype.init = function () {

    this.searchBtn.addEventListener(
        "click",
        this.handleSearch.bind(this)
    );

    this.cityInput.addEventListener(
        "keypress",
        (e) => {
            if (e.key === "Enter") {
                this.handleSearch();
            }
        }
    );

    this.showWelcome();
};

// welcome message
WeatherApp.prototype.showWelcome = function () {

    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            🌤 <h2>Welcome to SkyFetch</h2>
            <p>Search any city to view weather</p>
        </div>
    `;
};

// search handler
WeatherApp.prototype.handleSearch = function () {

    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Enter a city name");
        return;
    }

    this.getWeather(city);
};

// loading
WeatherApp.prototype.showLoading = function () {

    this.weatherDisplay.innerHTML = `
        <div class="loading">
            ⏳ Loading weather...
        </div>
    `;
};

// error
WeatherApp.prototype.showError = function (message) {

    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            ❌ ${message}
        </div>
    `;
};

// display current weather
WeatherApp.prototype.displayWeather = function (data) {

    const icon =
    data.weather[0].icon;

    const iconUrl =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">

            <h2>${data.name}</h2>

            <img src="${iconUrl}">

            <h3>
            ${Math.round(data.main.temp)} °C
            </h3>

            <p>
            ${data.weather[0].description}
            </p>

        </div>
    `;
};

// fetch forecast
WeatherApp.prototype.getForecast =
async function (city) {

    const url =
    `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

    const response =
    await axios.get(url);

    return response.data;
};

// process forecast (5 days)
WeatherApp.prototype.processForecastData =
function (data) {

    const daily = [];

    data.list.forEach(item => {

        if (item.dt_txt.includes("12:00:00")) {
            daily.push(item);
        }

    });

    return daily.slice(0, 5);
};

// display forecast
WeatherApp.prototype.displayForecast =
function (data) {

    const days =
    this.processForecastData(data);

    const forecastHTML =
    days.map(day => {

        const date =
        new Date(day.dt_txt);

        const name =
        date.toLocaleDateString(
            "en-US",
            { weekday: "short" }
        );

        const icon =
        day.weather[0].icon;

        return `
            <div class="forecast-card">

                <h4>${name}</h4>

                <img
                src="https://openweathermap.org/img/wn/${icon}.png">

                <p>
                ${Math.round(day.main.temp)} °C
                </p>

            </div>
        `;

    }).join("");

    this.weatherDisplay.innerHTML += `
        <div class="forecast-section">

            <h3>
            5-Day Forecast
            </h3>

            <div class="forecast-container">

                ${forecastHTML}

            </div>

        </div>
    `;
};

// fetch weather + forecast
 WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();

    try {
        const weatherUrl =
            `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weather, forecast] =
            await Promise.all([
                axios.get(weatherUrl),
                this.getForecast(city)
            ]);

        this.displayWeather(weather.data);
        this.displayForecast(forecast);

        this.saveRecentSearch(city);
        localStorage.setItem('lastCity', city);

    } catch (error) {
        console.error(error);
        this.showError("City not found");
    }
};
   
// create app instance
const app = new WeatherApp("4485029656019bd92bdabfdad78ba4c4");