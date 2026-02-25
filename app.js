// Step 1: Add your API key
const apiKey = "4485029656019bd92bdabfdad78ba4c4";

// Step 2: Choose a city
const city = "paris";

// Step 3: Create API URL
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

// Step 4: Fetch weather data using Axios
axios.get(url)
.then(function(response) {

    // Step 5: Extract data
    const data = response.data;

    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    // Step 6: Update DOM
    document.getElementById("city").textContent = cityName;
    document.getElementById("temperature").textContent = "Temperature: " + temperature + "°C";
    document.getElementById("description").textContent = "Condition: " + description;
    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

})
.catch(function(error) {
    console.log("Error fetching weather data:", error);
});