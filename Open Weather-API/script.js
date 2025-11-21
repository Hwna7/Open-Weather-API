const OPENWEATHER_API_KEY ="7db5fa7b6174857d9ee7ec25910e80f7"; 
// ================== 
 
const cityInput = document.getElementById("cityInput"); 
const searchBtn = document.getElementById("searchBtn"); 
const output = document.getElementById("output"); 
const errorBox = document.getElementById("error"); 
 
function setLoading(state) { 
  const result = output.querySelector(".result"); 
  result.style.opacity = state ? 0.6 : 1; 
  searchBtn.disabled = state; 
} 
 
function showError(msg) { 
  errorBox.style.display = "block"; 
  errorBox.textContent = msg; 
} 
 
function clearError() { 
  errorBox.style.display = "none"; 
  errorBox.textContent = ""; 
} 
 
function renderData(data) { 
  clearError(); 
 
  const cityEl = output.querySelector(".city"); 
  const descEl = output.querySelector(".desc"); 
  const tempEl = output.querySelector(".temp"); 
  const iconImg = output.querySelector("img"); 
  const iconText = document.getElementById("iconText"); 
  const metricEls = output.querySelectorAll(".metric b"); 
 
  const name = `${data.name}${data.sys && data.sys.country ? ", " + data.sys.country : ""}`; 
  cityEl.textContent = name; 
 
  descEl.textContent = data.weather && data.weather[0]  
    ? capitalize(data.weather[0].description)  
    : "—"; 
 
  const temp = (typeof data.main.temp !== "undefined")  
    ? Math.round(data.main.temp) + "°C"  
    : "—"; 
  tempEl.textContent = temp; 
 
  if (metricEls.length >= 3) { 
    metricEls[0].textContent = temp; 
    metricEls[1].textContent = data.main.humidity + "%"; 
    metricEls[2].textContent = 
      typeof data.main.sea_level !== "undefined" 
        ? data.main.sea_level + " m" 
        : "—"; 
  } 
 
  if (data.weather && data.weather[0]) { 
    const icon = data.weather[0].icon; 
    iconImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`; 
    iconImg.alt = data.weather[0].description || "weather icon"; 
    iconText.textContent = data.weather[0].main || ""; 
  } 
 
  setLoading(false); 
} 
 
function capitalize(s) { 
  if (!s) return s; 
  return s 
    .split(" ") 
    .map((w) => w[0].toUpperCase() + w.slice(1)) 
    .join(" "); 
} 
 
async function fetchWeather(city) { 
  if (!OPENWEATHER_API_KEY) { 
    showError("Please set your API key."); 
    return; 
  } 
 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent( 
    city 
  )}&units=metric&appid=${OPENWEATHER_API_KEY}`; 
 
  try { 
    setLoading(true); 
 
    const res = await fetch(url); 
 
    if (!res.ok) { 
      if (res.status === 404) throw new Error("City not found."); 
      throw new Error("Failed to fetch weather data."); 
    } 
 
    const data = await res.json(); 
    renderData(data); 
  } catch (err) { 
    showError(err.message || "Unknown error"); 
    setLoading(false); 
  } 
} 
 
searchBtn.addEventListener("click", () => { 
  const city = cityInput.value.trim(); 
  clearError(); 
  if (!city) { 
    showError("Please enter a city name."); 
    return; 
  } 
  fetchWeather(city); 
}); 
 
cityInput.addEventListener("keydown", (e) => { 
  if (e.key === "Enter") searchBtn.click(); 
});