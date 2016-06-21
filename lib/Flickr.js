import Helpers from '../helpers/helpers.js';
import ApiConfigs from '../configs/apiConfigs.js';
require('core-js');

/*
  Logic that is using Flickr REST api to fetch the images and render them in the app.
  Among other things it supports image preload and both fetching dataset / single specific photo.
*/
class Flickr {
  constructor(config) {
    this.apiKey = config.apiKey; // api key
    this.apiURL = ApiConfigs.flickr.api.url; // api base url
    this.dataset; // placeholder for current dataset
    this.lastPage; // placeholder for total ammount of pages
  }

  // fetch photos from the desired Flickr group
  findPhoto(parameters, callback) {
    var me = this;

    // extending the parameters obj by adding all common properties to it
    Object.assign(parameters, {
      content_type: 1, // 1 for photos only. 2 for screenshots only. 3 for 'other' only. 4 for photos and screenshots. 5 for screenshots and 'other'. 6 for photos and 'other'. 7 for photos, screenshots, and 'other' (all).
      method: 'flickr.photos.search', // api end point for searching trough photos
      api_key: this.apiKey, // api key
      format: 'json',
      nojsoncallback: 1 // disable JSONP
    });

    if(me.lastPage) { // this is initially false and the 'page' is set to 1 (default). On second call 'page' is determined randomly with the lastPage as the max page.
      Object.assign(parameters, {
        page: Math.floor(Math.random() * (this.lastPage - 0))
      });
    }

    // format the final url
    var stringifyParams = this.formatUrlParams(parameters),
        ajaxUrl = this.apiURL + '?' + stringifyParams;

    // execute the AJAX wrapper from Helpers to get the data
    Helpers.doAjax(ajaxUrl).then(function(response) {
      var dataSet = JSON.parse(response);
      me.lastPage = dataSet.photos.pages; // determine total ammount of pages

      var img = me.pickPhoto(dataSet); // pick one photo from the dataset

      // preloaf photo and execute the callback
      me.preloadImg(img.src, function() {
        callback(img);
      });
    }, function(error) {
      return error;
    });
  }

  // fetch specific photo from Flickr api by passing the photoId
  getSinglePhoto(photoId, callback) {
    // set specific parameters for this particular api call
    var parameters = {
      api_key: this.apiKey,
      photo_id: photoId,
      method: 'flickr.photos.getSizes', // api end point for searching trough photos
      format: 'json',
      nojsoncallback: 1 // disable JSONP
    };

    // format the final url
    var stringifyParams = this.formatUrlParams(parameters),
        ajaxUrl = this.apiURL + '?' + stringifyParams;

    Helpers.doAjax(ajaxUrl).then(function(response) {
      callback(JSON.parse(response));
    }, function(error) {
      return error;
    });
  }

  getPhotoInfo(photoId, callback) {
    // set specific parameters for this particular api call
    var parameters = {
      api_key: this.apiKey,
      photo_id: photoId,
      method: 'flickr.photos.getInfo', // api end point for searching trough photos
      format: 'json',
      nojsoncallback: 1 // disable JSONP
    };

    // format the final url
    var stringifyParams = this.formatUrlParams(parameters),
        ajaxUrl = this.apiURL + '?' + stringifyParams;

    Helpers.doAjax(ajaxUrl).then(function(response) {
      callback(JSON.parse(response));
    }, function(error) {
      return error;
    });
  }

  // helper method for reformatting the parameters
  formatUrlParams(obj) {
    var paramsString = Object.keys(obj).map(function(key) {
        return key + '=' + encodeURI(obj[key]);
    }).join('&');

    return paramsString;
  }

  // get random photo from the dataset
  pickPhoto(data) {
    var totalImages = data.photos.photo.length,
        randomIndex = Math.floor(Math.random() * (totalImages - 0)),
        photo = data.photos.photo[randomIndex],
        src = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server +'/' + photo.id + '_' + photo.secret + '_b.jpg';

    return {
      src: src,
      id: photo.id
    };
  }

  // logic that preloads image
  preloadImg(src, loadedCallback) {
    var imgEl = document.createElement('IMG');
    imgEl.src = src;

    // once image is loaded execute the loadedCallback
    imgEl.onload = function() {
      loadedCallback();
    }
  }
};

export default Flickr;
