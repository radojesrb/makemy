var Helpers = {
  // AJAX custom wrapper with Promise support
  doAjax: function(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      }

      req.onerror = function() {
        reject(Error("Network Error"));
      }

      req.send();
    });
  },

  // FIX for hashHistory.push() (which is part of ReactJS Router) lack of callback support
  onLocationChange: function(locationHash, component, callback) {
    var me = this;

    // check if current location.hash has been changed
    if(component.state.currentPage === locationHash) {
      setTimeout(function() {
        me.onLocationChange(locationHash, component, callback);
      }, 0);
    }
    else {
      // execute the callback once loation.hash changes
      callback();
    }
  }
};

export default Helpers;
