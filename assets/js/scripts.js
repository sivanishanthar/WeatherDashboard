var key = '6910ff6c36d1f04d0f767d505ece1a87';
var city = "Ottawa"

//Get the current time and date
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')
var date = moment().format('L');
var cityHist = [];
//Save the text value of the search and save it to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityHist.push(city);
	localStorage.setItem('city', JSON.stringify(cityHist));
	fiveForecastEl.empty();
	getHistory();
	getWeatherToday();
});

//Create buttons based on search history 
var contHistEl = $('.cityHist');
function getHistory() {
	contHistEl.empty();

	for (let i = 0; i < cityHist.length; i++) {
		var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${cityHist[i]}`)
		rowEl.addClass('row histBtnRow');
		btnEl.addClass('btn btn-outline-secondary histBtn');
		btnEl.attr('type', 'button');
		contHistEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	//Allows the buttons to start a search as well
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecastEl.empty();
		getWeatherToday();
	});
};

//Get the main 'Today' card body.
var cardTodayBody = $('.cardBodyToday')
//weather data and display
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;

	$(cardTodayBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		//Icons
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		// Temperature
		var pEl = $('<p>').text(`Temperature: ${response.main.temp} °C`);
		cardTodayBody.append(pEl);
		//Wind Speed
		var pElWind = $('<p>').text(`Wind: ${response.wind.speed} KM/H`);
		cardTodayBody.append(pElWind);
		//Humidity
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
  		cardTodayBody.append(pElHumid);
		//Set the lat and long from the searched city
		var cityLon = response.coord.lon;
		// console.log(cityLon);
		var cityLat = response.coord.lat;
		// console.log(cityLat);

	});
	getFiveDayForecast();
};

var fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];
		//Made a object that would allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
		//Display 5 days weather
		for (let i = 0; i < myWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);
			// Icon
			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Temp
			var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °C`);
			divElBody.append(pElTemp);
			//Feels Like
			var pElFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °C`);
			divElBody.append(pElFeel);
			//Humidity
			var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(pElHumid);
		}
	});
};

//Allows the data to load for the city
function initLoad() {

	var cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();
