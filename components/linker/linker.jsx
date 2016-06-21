import React from 'react';
import { Link } from 'react-router';
require('core-js');

// import CSS for this component to the page
require('./linker.css');

// component that renders the link to the specific page which can provide support for permament linking to the single photo
class Linker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // build the specific page url
    var urlPath = '/photo/' + this.props.photoId;

    return (
      <div className='linker'>
        <Link to={urlPath}></Link>
      </div>
    );
  }
}

export default Linker;
