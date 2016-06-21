import React from 'react';
require('core-js');

// import CSS for this component to the page
require('./facts.css');

// component that renders the content that 'Trivia' class has provided
class Facts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='facts'>
        <div className='content'>
          {this.props.content}
        </div>
      </div>
    );
  }
};

export default Facts;
