import Helpers from '../helpers/helpers.js';
import ApiConfigs from '../configs/apiConfigs.js';
require('core-js');

/*
  Logic that determines  part of the day.
  It uses the geolocation HTML5 api + sunrisesunset api (that is referenced in /configs/apiConfigs.js) as a first data source.
  Failover is implemented if user does not allow navigator.geolocation and failover sunset/sunrise times are defined in apiConfigs.js...
*/
class DayTime {
  constructor(config) {
    this.date = config.date; // current date obj
    this.periodCallback = config.periodCallback; // callback that will be executed once the determinePeriod() method returns the period of day
    this.location = {}; // placeholder for latitude / longitude
    this.failoverTimes = { // sunrise / sunset failover times
      sunrise: ApiConfigs.sunrisesunset.failover.sunrise,
      sunset: ApiConfigs.sunrisesunset.failover.sunset
    }
  }

  partOfDay() {
    // init the navigator.geolocation
    navigator.geolocation.getCurrentPosition(this.haveLocation.bind(this), this.determinePeriod(this.failoverTimes.sunrise, this.failoverTimes.sunset));
  }

  // set langitude / longitude if user allows geolocation and initiate sunrisesunset api
  haveLocation(position) {
    this.location.lat = position.coords.latitude;
    this.location.lng = position.coords.longitude;

    this.sunriseApi(this.location);
  }

  // method that do the call to sunrisesunset api
  sunriseApi(location) {
    var me = this,
        finalApiUrl = ApiConfigs.sunrisesunset.api.url + '?lat=' + location.lat + '&lng=' + location.lng + '&formatted=0'; // formatting the final api url, 'formatted' param is set to 0 so that dates/times are returned as not formatted date strings

    // call the api by using the AJAX wrapper from Helpers
    Helpers.doAjax(finalApiUrl).then(function(response) {
      var data = JSON.parse(response);

      // once data is fetched execute the logic that determines the part of the day based on current time and sunrise / sunset times
      me.determinePeriod(data.results.sunrise, data.results.sunset);
    }, function(error) {
      return error;
    });
  }

  // method that determines period of day
  determinePeriod(sunrise, sunset) {
    var sunriseTimeObj = typeof sunrise === 'number' ? new Date().setHours(sunrise) : new Date(sunrise),
        sunsetTimeObj = typeof sunset === 'number' ? new Date().setHours(sunset) : new Date(sunset),
        periodString;

    if (this.date >= sunsetTimeObj) {
      periodString = 'night';
    }
    else if (this.date > sunriseTimeObj && this.date < sunsetTimeObj) {
      periodString = 'day';
    }

    // executing the callback passed on the class instantiation
    this.periodCallback(periodString);
  }
};

export default DayTime;
