import React from 'react';
require('core-js');

// import CSS for this component to the page
require('./refresher.css');

// component that renders the button that is being used for refreshing the content of app
class Refresher extends React.Component {
  constructor(props) {
    super(props);
  }

  // method for reseting the state of parent component which is 'Container' in this case
  resetState(nameProp) {
    this.props.click();
  }

  render() {
    return (
      <div className='refresher' onClick={this.resetState.bind(this)}>
        Remake
      </div>
    );
  }
}

export default Refresher;
