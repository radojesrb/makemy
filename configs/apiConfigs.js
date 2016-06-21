var ApiConfigs = {
  // Flickr API
  flickr: {
      api: {
        url: 'https://api.flickr.com/services/rest/',
        key: '5f5604b5cc9dcd352cfa4745cabc43d9',
        secret: 'ffc9435c136b0399'
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
