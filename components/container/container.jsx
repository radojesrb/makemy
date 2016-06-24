import React from 'react';
import { hashHistory } from 'react-router';
import Background from '../background/background.jsx';
import Title from '../title/title.jsx';
import Counter from '../counter/counter.jsx';
import Refresher from '../refresher/refresher.jsx';
import Downloader from '../downloader/downloader.jsx';
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
        src: '',
        downloadable: false
      },
      dataset: {},
      seenPhotos: [],
      triviaFact: '',
      partOfDay: this.props.route.partOfDay,
      currentPage: location.hash // this is being used for habdling 'hashHistory' custom pseudo callback Helper method. See the reference in /helpers/helpers.js 'onLocationChange'
    };

    // instantiate the Flickr class
    this.photos = new Flickr({
      apiKey: ApiConfigs.flickr.api.key,
      preload: true
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
        src: this.state.photo.src,
        downloadable: this.state.photo.downloadable
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

  updatePhotoState(id, info, src, size, downloadable) {
    var me = this,
        loadingFlag = me.state.isLoading;

    if(size === 'large') {
      loadingFlag = false;
    }

    me.setState({
      isLoading: loadingFlag,
      photo: {
        id: id,
        info: info,
        src: src,
        downloadable: downloadable
      }
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
        per_page: 5
      }, function(img) {
        me.photos.getPhotoInfo(img.id, function(data) {
          me.updatePhotoState(img.id, data.photo, img.src, img.size, !!+data.photo.usage.candownload);
        })
      });
    }
    // find one specific photo, in case of /photo/:photoId url being loaded
    else {
      me.photos.getSinglePhoto(photoId, function(img) {
        me.photos.imageLoader(img, photoId, function(img) {
          me.photos.getPhotoInfo(photoId, function(data) {
            me.updatePhotoState(photoId, data.photo, img.src, img.size, !!+data.photo.candownload)
          })
        });
      });
    }
  }

  render() {
    return (
      <div className='container'>
        <Background isLoading={this.state.isLoading} photoSrc={this.state.photo.src} />
        <Title partOfDay={this.state.partOfDay} isLoading={this.state.isLoading} />
        <Counter viewNumber={this.state.photo.info.views} />
        <Refresher click={this.resetState.bind(this)} />
        <Downloader downloadable={this.state.photo.downloadable} photoSrc={this.state.photo.src} />
        <Linker downloadable={this.state.photo.downloadable} photoId={this.state.photo.id} />
        <Facts content={this.state.triviaFact} />
      </div>
    );
  }
};

export default Container;
