import React from 'react';
import classNames from 'classnames';
require('core-js');

// import CSS for this component to the page
require('./background.css');

// component that renders the number of views for specific photo that Flickr api has returned
class Background extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // configure the css classes for component. 'desaturate' subclass is added while the Flickr api fetchs new data
    var cssClasses = classNames({
      'page-bg': true,
      'blur': this.props.isLoading,
      'desaturate': this.props.isLoading
    });

    // set the photo as the component backgroundImage
    var photoStyle = {
      backgroundImage: 'url(' + this.props.photoSrc + ')'
    };

    return (
      <div className={cssClasses}>
        <div className='img' style={photoStyle}></div>
      </div>
    );
  }
};

export default Background;
