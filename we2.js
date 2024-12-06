// API URL Template
const BASE_API_URL = 'https://api.open-meteo.com/v1/forecast?current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min';

// Function to fetch and display weather data
async function fetchWeatherData(latitude, longitude) {
    try {
        // Build API URL
        const url = `${BASE_API_URL}&latitude=${latitude}&longitude=${longitude}`;
        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Parse JSON response
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weather-result').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Function to display weather data
function displayWeather(data) {
    const current = data.current_weather;
    const daily = data.daily;

    // Format result
    const resultHTML = `
        <h2>Current Weather</h2>
        <p>Temperature: ${current.temperature}°C</p>
        <p>Weather Code: ${current.weathercode}</p>
        <h3>Daily Forecast</h3>
        <p>Max Temperature: ${daily.temperature_2m_max[0]}°C</p>
        <p>Min Temperature: ${daily.temperature_2m_min[0]}°C</p>
    `;

    document.getElementById('weather-result').innerHTML = resultHTML;
}

// Manual form submission for coordinates
document.getElementById('location-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    // Validate inputs
    if (!latitude || !longitude) {
        alert('Please enter both latitude and longitude!');
        return;
    }

    // Fetch weather data
    fetchWeatherData(latitude, longitude);
});

// Geolocation detection
document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Display detected location in the form (optional)
                document.getElementById('latitude').value = latitude;
                document.getElementById('longitude').value = longitude;

                // Automatically fetch weather data for detected location
                fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

