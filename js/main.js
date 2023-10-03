let loadingInterval;

window.onload = () =>
{
    let rain = false;
    const bodySpan = document.getElementById("body-span");
    const spinner = document.getElementById("loading");

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
                const hourlyArr = apiResponse.properties.periods;
                spinner.style.display = "none";
                for (let hour = 0; hour < 48; hour++)
                {
                    if (hourlyArr[hour].shortForecast.includes("Rain"))
                    {
                        rain = true;
                        break;
                    }
                }

                bodySpan.textContent = rain ? "YES." : "NO.";
                // TODO add a subtext field that displays something like, "There is a [shortForecast] in [i] hours!"
                // TODO add an option for user to select how many hours/days they want to see ahead
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