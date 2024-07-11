document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "sNnklvqObOAIWZWAd3SEz0YTfJwyx8JM"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const forecastDiv = document.getElementById("forecast");
    const hourlyForecastDiv = document.getElementById("hourlyForecast"); // Assuming you have a div with id="hourlyForecast"

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
        getForecast(city);
        getHourlyForecast(city); // Fetch hourly forecast when form is submitted
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;

    }

    function getForecast(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchForecastData(locationKey);
                } else {
                    forecastDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                forecastDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayForecast(data.DailyForecasts);
                } else {
                    forecastDiv.innerHTML = `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                forecastDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }

    function displayForecast(forecasts) {
        let forecastContent = '<h2>5-Day Forecast</h2>';
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;

            forecastContent += `
                <div class="forecast-item">
                    <h4>Date: ${day}</h4>
                    <br>
                    <p>Min Temperature: ${temperatureMin}°C</p>
                    <p>Max Temperature: ${temperatureMax}°C</p>
                    <p>Day Weather: ${weather}</p>
                    <br>
                </div>
            `;
        });

        forecastDiv.innerHTML = forecastContent;
    }

    function getHourlyForecast(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchHourlyForecast(locationKey);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayHourlyForecast(hourlyForecasts) {
        let hourlyForecastContent = '<h2>Hourly Forecast</h2>';
        hourlyForecasts.forEach(forecast => {
            const dateTime = new Date(forecast.DateTime);
            const hour = dateTime.getHours();
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;

            hourlyForecastContent += `
                <div class="hourly-forecast-item">
                    <h4>Time: ${hour}:00</h4>
                    <br>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                    <br>
                </div>
            `;
        });

        hourlyForecastDiv.innerHTML = hourlyForecastContent;
    }

});
