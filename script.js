const apiKey = "4f7da555bfa4b5415c7582b5ecfae442";

const input = document.getElementById("cityInput");
const btnS = document.getElementById("searchBtn");
const result = document.getElementById("weatherResult");

function detectLanguage(text) {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? "fa" : "en";

}

btnS.addEventListener('click', async() => {
    const city = input.value.trim();
    const userlang = navigator.language || navigator.userLanguage;
    const leng = userlang.startsWith("fa") ? "fa" : "en";
    if (city === "") {
        result.innerHTML = leng === "fa" ? `<p>لطفا نام شهر خود را وارد کنید</p>` : `<p> Enter your city name </p>`;
        return;
    }
    try {

        const city = input.value.trim();
        const lang = detectLanguage(city);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=${lang}`;
        const response = await fetch(url);
        const data = await response.json();


        if (data.cod == '404') {
            result.innerHTML = lang === "fa" ? `<p> نتونستیم شهر مورد نظر رو پیدا کنیم </p>` : `<p> we cant found there </p>`;
            return;
        }
        //save
        localStorage.setItem('lastCity', city);
        result.innerHTML = lang === "en" ?
            `<h2>${data.name} ${data.sys.country}</h2>
        <p> temper :${data.main.temp} C<img alt=" waether icon" id="weather_icon"> </p>
        <p> about weather : ${data.weather[0].description}</p>
             
        <p> speed wind :${data.wind.speed} m/s</p>` :
            `<div style="text-align:right"><h2>${data.sys.country}_${data.name} </h2>
        <p><img alt=" waether icon" id="weather_icon"> دما :${data.main.temp} درجه</p>
        <p> وضعیت آب و هوایی : ${data.weather[0].description}</p>
        
        <p> سرعت باد :${data.wind.speed}</p></div>`;
        //icon 

        let iconcode = data.weather[0].icon;
        let iconUrl = `https://openweathermap.org/img/wn/${iconcode}@2x.png`;
        document.getElementById("weather_icon").src = iconUrl;

    } catch (error) {
        result.innerHTML = `<p> error: ${error}</p>`
    }
});

window.addEventListener('load', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        city = lastCity;
        btnS.click();
    }

});