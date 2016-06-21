var ApiConfigs = {
  // Flickr API
  flickr: {
      api: {
        url: 'https://api.flickr.com/services/rest/',
        key: '',
        secret: ''
      },
      groupId: '1563508@N21' // nature
  },

  // Chuck Norris Joke API
  icndb: {
    api: {
      url: 'https://api.icndb.com/jokes/random'
    }
  },

  // SunriseSunset API
  sunrisesunset: {
    api: {
      url: 'http://api.sunrise-sunset.org/json'
    },
    failover: {
      sunrise: 6,
      sunset: 20
    }
  }
};

export default ApiConfigs;
