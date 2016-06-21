import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import Container from './components/container/container.jsx';
import DayTime from './lib/DayTime.js';
require('core-js'); // polyfills for ES6 methods

(function(window){
  // init function
  function init(period) {
    // define routes and render the app
    ReactDOM.render((
      <Router history={hashHistory}>
        <Route path="/" partOfDay={period} component={Container} />
        <Route path="/photo/:photoId" partOfDay={period} component={Container} />
      </Router>
    ), document.getElementById('make-my'));
  }

  // determine part of the day on page load
  var dayTime = new DayTime({
    date: new Date(),
    periodCallback: function(period) {
      // start the app after part of the day is retreived
      init(period);
    }
  });
  dayTime.partOfDay();
}(window));
