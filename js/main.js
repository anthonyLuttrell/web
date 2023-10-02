window.onload = () =>
{
    let rain = false;
    document.getElementById("body-span").textContent = "LOADING...";
    navigator.geolocation.getCurrentPosition((pos) =>
    {
        const {latitude, longitude} = pos.coords;
        console.log("Lat: " + latitude);
        console.log("Lon: " + longitude);
        getForecast(latitude, longitude)
            .then((apiResponse) =>
        {
            let urlHourly = apiResponse.properties.forecastHourly;
            getHourly(urlHourly).then((apiResponse) =>
            {
                for (let hour of apiResponse.properties.periods)
                {   // FIXME this needs to check for only 48 hours or so
                    if (hour.shortForecast.includes("Rain"))
                    {
                        rain = true;
                        break;
                    }
                }
                document.getElementById("body-span").textContent = rain ? "YES" : "NO";
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