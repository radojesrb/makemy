import Helpers from '../helpers/helpers.js';
import ApiConfigs from '../configs/apiConfigs.js';

/*
  Simple class that outputs the random Joke from Chuck Norris Joke api
*/
class Trivia {
  constructor() {
    this.apiURL = ApiConfigs.icndb.api.url;
    this.data; // placeholder for data
  }

  // method that fetches the data from api and execute the callback
  getFact(callback) {
    Helpers.doAjax(this.apiURL).then(function(response) {
      var data = JSON.parse(response);
      var fact = decodeURIComponent(data.value.joke); // some strings had encoded characters
      fact = fact.replace(/\&quot\;/g, '"'); // additional reformatting

      callback(fact);
    }, function(error) {
      return error;
    });
  }
};

export default Trivia;
