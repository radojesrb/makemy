import React from 'react';
import { hashHistory } from 'react-router';
import classNames from 'classnames';
import Title from '../title/title.jsx';
import Counter from '../counter/counter.jsx';
import Refresher from '../refresher/refresher.jsx';
import Linker from '../linker/linker.jsx';
import Facts from '../facts/facts.jsx';
import Flickr from '../../lib/Flickr.js';
import Trivia from '../../lib/Trivia.js';
import Helpers from '../../helpers/helpers.js';
import ApiConfigs from '../../configs/apiConfigs.js';
require('core-js');

// import CSS for this component to the page
require('./container.css');

// base component which renders all the child components
class Container extends React.Component {
  constructor(props) {
    super(props);

    // set initial state
    this.state = {
      isLoading: null, // this is being used as an loading flag, so that user can not fire multiple app refreshes at the same time.
      photo: { // property which holds all the data needed for the currently selected photo
        id: this.props.routeParams.photoId,
        info: {},
        src: ''
      },
      triviaFact: '',
      partOfDay: this.props.route.partOfDay,
      currentPage: location.hash // this is being used for habdling 'hashHistory' custom pseudo callback Helper method. See the reference in /helpers/helpers.js 'onLocationChange'
    };

    // instantiate the Flickr class
    this.photos = new Flickr({
      apiKey: ApiConfigs.flickr.api.key
    });

    // instantiate the Trivia class
    this.trivia = new Trivia();

    // bind resetState method
    this.resetState.bind(this);
  }

  componentWillMount() {
    // init the component custom logic on Mount
    this.initContent();
  }

  componentWillReceiveProps(newProps) {
    // update the state
    this.setState({
      photo: {
        id: newProps.routeParams.photoId,
        info: this.state.photo.info,
        src: this.state.photo.src
      },
      currentPage: location.hash
    });
  }

  initContent() {
    // stop executing if data is currently being fetched
    if(this.state.isLoading) {
      return false;
    }

    // get photo from Flickr api
    this.getPhoto();
    // get fact from Trivia api
    this.getTrivia();
  }

  // custom method for re-initialising the component
  resetState() {
    var me = this,
        currentLocationHash = location.hash; // storing the reference to the current hash of page

    /*
      'hashHistory.push()' is asynchronous, it has no callback or promise support.
      Since we need to reinit the custom component logic once all the props fully reinit it was not enough to just call 'initContent()' after calling 'hashHistory.push()'.
      Thus I made an helper that waits for the route to fully change and then it reinits the logic (via callback).
      See the reference in /helpers/helpers.js 'onLocationChange'.
    */
    hashHistory.push('/');

    Helpers.onLocationChange(currentLocationHash, me, function() {
      me.initContent();
    });
  }

  // method that fetches the fact from Trivia
  getTrivia() {
    var me = this;

    me.trivia.getFact(function(data){
      me.setState({
        triviaFact: data
      });
    });
  }

  // method that fetches the photo from Flickr
  getPhoto() {
    var me = this,
        partOfDay = this.state.partOfDay,
        photoId = this.props.routeParams.photoId; // try to set photoId from the route.

    // set loading flag to true
    me.setState({isLoading: true});

    // find photo set if photoId was not in the route
    if(!photoId) {
      me.photos.findPhoto({
        text: partOfDay,
        tags: partOfDay,
        group_id: ApiConfigs.flickr.groupId,
        per_page: 100
      }, function(img) {
        me.photos.getPhotoInfo(img.id, function(data) {
          me.setState({
            isLoading: false,
            photo: {
              id: img.id,
              info: data.photo,
              src: img.src
            }
          });
        })
      });
    }
    // find one specific photo, in case of /photo/:photoId url being loaded
    else {
      me.photos.getSinglePhoto(photoId, function(img) {
        var sizes = img.sizes.size;

        // get the large size of the photo
        var result = sizes.filter(function(obj) {
          return obj.label == 'Large';
        });
        var imgSrc = result[0].source;

        me.photos.getPhotoInfo(photoId, function(data) {
          me.setState({
            isLoading: false,
            photo: {
              id: photoId,
              info: data.photo,
              src: imgSrc
            }
          });
        })
      });
    }

  }

  render() {
    // configure the css classes for component. 'desaturate' subclass is added while the Flickr api fetchs new data
    var cssClasses = classNames({
      'page-bg': true,
      'desaturate': this.state.isLoading
    });

    // set the photo as the component backgroundImage
    var photoStyle = {
      backgroundImage: 'url(' + this.state.photo.src + ')'
    };

    return (
      <div className={cssClasses} style={photoStyle}>
        <Title partOfDay={this.state.partOfDay} isLoading={this.state.isLoading} />
        <Counter viewNumber={this.state.photo.info.views} />
        <Refresher click={this.resetState.bind(this)} />
        <Linker photoId={this.state.photo.id} />
        <Facts content={this.state.triviaFact} />
      </div>
    );
  }
};

export default Container;
