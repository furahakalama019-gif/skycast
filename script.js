// script.js
const searchBtn = document.querySelector("#search-btn");
const cityInput = document.querySelector("#city-input");

searchBtn.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
        get5DayForecast(cityName); // This is the call on line 9
    }
});

// 1. Current Weather Function
async function getWeatherData(city) {
    const apiKey = "35b7cd034c361b2a2986754a7777db45";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.querySelector("#display-city").innerText = data.name;
        document.querySelector("#display-temp").innerText = `${Math.round(data.main.temp)}°C`;
        document.querySelector("#display-desc").innerText = data.weather[0].description;

        const iconCode = data.weather[0].icon;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        
        // Background change logic (Day vs Night)
        if (iconCode.endsWith('d')) {
            document.body.style.background = "linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)";
        } else {
            document.body.style.background = "linear-gradient(to bottom, #243b55, #141e30)";
        }

        const timezoneOffset = data.timezone; // Offset in seconds from UTC
const sunrise = data.sys.sunrise;
const sunset = data.sys.sunset;

// Function to calculate local time
const calculateLocalTime = (offset) => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (offset * 1000));
    return localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

document.querySelector("#local-time").innerText = `Local Time: ${calculateLocalTime(timezoneOffset)}`;
    } catch (err) { console.error(err); }
}

// 2. THE MISSING FUNCTION - Add this below getWeatherData
async function get5DayForecast(city) {
    const apiKey = "35b7cd034c361b2a2986754a7777db45";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const forecastContainer = document.querySelector("#forecast-container");
        
        forecastContainer.innerHTML = ""; // Clear old data

        // Filter for midday readings
        const dailyData = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));

        dailyData.forEach(day => {
            const date = new Date(day.dt * 1000).toLocaleDateString('en-GB', { weekday: 'short' });
            const icon = day.weather[0].icon;
            
            const forecastHTML = `
                <div class="forecast-card">
                    <p class="forecast-day">${date}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather" class="forecast-icon">
                    <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
                </div>
            `;
            forecastContainer.insertAdjacentHTML('beforeend', forecastHTML);
        });
    } catch (err) { console.error(err); }
}

const modal = document.getElementById("contactModal");
const btn = document.getElementById("contactBtn");
const closeBtn = document.querySelector(".close-btn");

// Open modal
btn.onclick = () => {
    modal.style.display = "flex";
}

// Close modal when 'X' is clicked
closeBtn.onclick = () => {
    modal.style.display = "none";
}

// Close modal when clicking outside the box
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Optional: Handle form submission
document.getElementById("contactForm").onsubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (This is a demo)");
    modal.style.display = "none";
}

const contactForm = document.getElementById("contactForm");

contactForm.onsubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    const data = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    });

    if (response.ok) {
        alert("Thanks Furaha! Your message has been sent.");
        contactForm.reset(); // Clears the inputs
        modal.style.display = "none"; // Closes the modal
    } else {
        alert("Oops! There was a problem sending your message.");
    }
};