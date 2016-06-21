import React from 'react';
import classNames from 'classnames';
require('core-js');

// import CSS for this component to the page
require('./title.css');

// component that renders the title for the app which is located in the middle of the page
class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // configure the css classes for component. 'refreshing' subclass is added while the Flickr api fetchs new data
    var cssClasses = classNames({
      'page-title': true,
      'refreshing': this.props.isLoading
    });

    // set the content of the title based on the part of the day
    var titleContent = 'Make My ' + this.props.partOfDay;
    if(this.props.isLoading) {
      titleContent = 'Remaking Your ' + this.props.partOfDay;
    }

    return (
      <div className={cssClasses}>
        <div>{titleContent}</div>
      </div>
    );
  }
}

export default Title;
