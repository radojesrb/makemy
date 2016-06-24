# MakeMy
### Or how to sharpen your ReactJS skills in few days...

#### Projects Homepage

[makemy.org](http://makemy.org/)

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

#### How to make it work

First obtain Flickr api key and populate it into /configs/apiConfigs.js. Then do 'npm install' so that all dependency modules are being installed. Last thing is to run 'npm start' which is going to run the app in dev mode and if everything went cool you will be able to access the 'http://localhost:8080'...

#### ToDo

- Wrapp the app in an Google Chrome extension (so that it loads on opening the new tab).
- ~~Provide the possibility for easy downloading of images that Owner has allowed to be downloadable (Flickr api returns this info).~~ **DONE**
