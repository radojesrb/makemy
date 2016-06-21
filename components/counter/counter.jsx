import React from 'react';
require('core-js');

// import CSS for this component to the page
require('./counter.css');

// component that renders the number of views for specific photo that Flickr api has returned
class Counter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='counter'>
        <div className='label'></div>
        {this.props.viewNumber}
      </div>
    );
  }
};

export default Counter;
