# MakeMy
### Or how to sharpen your ReactJS skills in few days...

#### Description

MakeMy app has 1 core functionality, which is displaying **photos from Flickr** based on the part of the day (according to user local time).
Second feature is fetching and rendering the Chuck Norris Jokes (from [ICNDB API](http://www.icndb.com/api/)) in an random order.

**Part of the day:**
For determining what part of the day is currently at users side (day/night) [Sunrise-Sunset API](http://sunrise-sunset.org/api) is being implemented in combination with HTML geolocation api.
There is an failover (in case user reject to share location) which represents the hardcoded (in config file) times for sunrise/sunset.

#### Technology stack

- ReactJS
- React-router
- ES6
- Babel
- Webpack

#### Projects Homepage

[makemy.org](http://makemy.org/)

#### ToDo

Wrapp the app in an Google Chrome extension (so that it loads on opening the new tab).
