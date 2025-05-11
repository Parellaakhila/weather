let apiKey = `c324823efb085fec16811d869f1d3a83`;
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_btn");

let currentTempCelsius = null;
let hourlyTempsCelsius = [];
let dailyTempsCelsius = [];
let hourlyElements = [];
let dailyElements = [];
let currentUnit = 'C';


searchButton.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    let city = searchInput.value;
    await check(city);
  } catch {
    alert("Enter city name correctly");
  }
});


function updateTemperatureDisplay(unit) {
  currentUnit = unit;

  const convert = (temp) => unit === 'F' ? (temp * 1.8 + 32).toFixed(2) + '°F' : temp + '°C';
  document.querySelector('.temp_display').innerHTML = convert(currentTempCelsius);

  hourlyTempsCelsius.forEach((temp, index) => {
    document.getElementById(hourlyElements[index]).innerHTML = convert(temp);
  });

  dailyTempsCelsius.forEach((temp, index) => {
    document.getElementById(dailyElements[index]).innerHTML = convert(temp);
  });
}

document.getElementById("degree_celsius").addEventListener("click", () => {
  if (currentUnit !== 'C') updateTemperatureDisplay('C');
});

document.getElementById("fahreinheit").addEventListener("click", () => {
  if (currentUnit !== 'F') updateTemperatureDisplay('F');
});


async function check(city) {
  let response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  let data = await response.json();


  document.querySelector('.card-title').innerHTML = data.name;
  currentTempCelsius = Math.round(data.main.temp);
  document.querySelector('.temp_display').innerHTML = `${currentTempCelsius}°C`;
  document.querySelector('.card-text').innerHTML = data.weather[0].description;


  const weatherImg = document.getElementById("weatherImg");
  if (currentTempCelsius < 0) {
    weatherImg.src = '305-135918495_small.mp4';
  } else if (currentTempCelsius < 20) {
    weatherImg.src = '9767-221163234_small.mp4';
  } else if (currentTempCelsius >= 20 && currentTempCelsius <30) {
    weatherImg.src = '856024-uhd_3840_2160_30fps.mp4';
  } else if (currentTempCelsius >= 30) {
    weatherImg.src = '214409_small.mp4';
  } else {
    weatherImg.src = '3129957-uhd_3840_2160_25fps.mp4';
  }

  // Fetch and display forecast
  await weatherData(data.coord.lat, data.coord.lon);
}

async function weatherData(lat, lon) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  let response = await fetch(forecastApiUrl);
  let data = await response.json();
let forecastContainers = document.getElementById("Future_data1").querySelector(".row");
  forecastContainers.innerHTML = "";
  let forecastContainer = document.getElementById("Future_data").querySelector(".row");
  forecastContainer.innerHTML = "";
  let daysShown = new Set();

  hourlyTempsCelsius = [];
  dailyTempsCelsius = [];
  hourlyElements = [];
  dailyElements = [];

  // 24-hour forecast (next 8 entries)
  for (let i = 0; i < 12  ; i++) {
    let entry = data.list[i];
    let date = new Date(entry.dt * 1000);
    let time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    let day = date.toLocaleDateString('en-US', { weekday: "short" });

    let temp = Math.round(entry.main.temp);
    let iconCode = entry.weather[0].icon;
    let description = entry.weather[0].description;
    let tempId = `hour-temp-${i}`;

    hourlyTempsCelsius.push(temp);
    hourlyElements.push(tempId);

    forecastContainers.innerHTML += `
   
      <div class="col-12 col-sm-6 col-md-4 col-lg-1 mb-4">
        
          <div class="card-body text-center">
          
            <h6 class="card-title"> ${time}</h6>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" class="weather-icon mb-2">
            <p id="${tempId}" class="card-text">${temp}°C</p>
            
          </div>
       
      
      </div>`;
     
  }


  for (let i = 0; i < data.list.length && daysShown.size < 6; i++) {
    let entry = data.list[i];
    let date = new Date(entry.dt * 1000);
    let dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    if (!daysShown.has(dayName)) {
      daysShown.add(dayName);

      let temp = Math.round(entry.main.temp);
      let iconCode = entry.weather[0].icon;
      let description = entry.weather[0].description;
      let tempId = `day-temp-${daysShown.size - 1}`;

      dailyTempsCelsius.push(temp);
      dailyElements.push(tempId);

      forecastContainer.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
          
            <div class=" text-center">
              <h5 class="card-title">${dayName}</h5>
              <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" class="weather-icon mb-2">
              <p id="${tempId}" class="card-text">${temp}°C</p>
              <p class="card-text">${description}</p>
            </div>
          </div>
        </div>`;
    }
  }
}
 

