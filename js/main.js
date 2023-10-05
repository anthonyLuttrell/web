window.onload = () =>
{
    let rain = false;
    let hour = 0;
    const bodySpan = document.getElementById("body-span");
    const subText = document.getElementById("body-subtext");
    const spinner = document.getElementById("loading");

    navigator.geolocation.getCurrentPosition((pos) =>
    {
        const {latitude, longitude} = pos.coords;
        getForecast(latitude, longitude)
            .then((apiResponse) =>
        {
            let urlHourly = apiResponse.properties.forecastHourly;
            getHourly(urlHourly).then((apiResponse) =>
            {
                const hourlyArr = apiResponse.properties.periods;
                const [...hourlyShortForecast] = apiResponse.properties.periods;
                spinner.style.display = "none";

                while (hour < 48)
                {
                    if (hourlyArr[hour].shortForecast.includes("Rain") ||
                        hourlyArr[hour].shortForecast.includes("Snow") ||
                        hourlyArr[hour].shortForecast.includes("Sleet") ||
                        hourlyArr[hour].shortForecast.includes("Hail") ||
                        hourlyArr[hour].shortForecast.includes("Showers") ||
                        hourlyArr[hour].shortForecast.includes("Thunderstorms"))
                    {
                        rain = true;
                        break;
                    }
                    hour++;
                }

                bodySpan.textContent = rain ? "YES." : "NO.";
                subText.textContent = rain ? "There is " + hourlyArr[hour].shortForecast + " in " + hour + " hours!" : "All clear for at least 48 hours!";

                for (let i = 0; i < hourlyShortForecast.length; i++)
                {
                    console.log(hourlyShortForecast[i].shortForecast);
                }

                // TODO add a background image that depects the resulting weather
                // TODO change the footer to just an emoji that changes depending on the resulting weather
                // TODO header/footer box shadowing?
            });
        });
    });
};

async function getForecast(lat, lon)
{
    const url = "https://api.weather.gov/points/" + lat + "," + lon;
    const response = await fetch(url);
    return await response.json();
}

async function getHourly(url)
{
    const response = await fetch(url);
    return await response.json();
}