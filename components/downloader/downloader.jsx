import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
require('core-js');

// import CSS for this component to the page
require('./downloader.css');

// component that renders the download link to photo
class Downloader extends React.Component {
  constructor(props) {
    super(props);
  }

  buildFileName(photoSrc) {
    var filename = 'makemy-' + new Date().getTime() + '.' + this.extractFileExtension(photoSrc);

    return filename;
  }

  extractFileExtension(photoSrc) {
    var srcArr = photoSrc.split('/'),
        fname = srcArr[srcArr.length - 1],
        fnameArr = fname.split('.'),
        fextension = fnameArr[fnameArr.length - 1];

    return fextension;
  }

  render() {
    var cssClasses = classNames({
          'downloader': true,
          'inactive': !this.props.downloadable
        }),
        fname = this.buildFileName(this.props.photoSrc),
        downloadLink = '',
        disabledDownloadMessage = '';

    if(this.props.downloadable) {
      downloadLink = <a href={this.props.photoSrc} download={fname} ></a>;
    }

    if(!this.props.downloadable) {
      disabledDownloadMessage = 'Owner of the photo has not gave rights for its download...';
    }
    return (
      <div className={cssClasses} title={disabledDownloadMessage}>
        {downloadLink}
      </div>
    );
  }
};

export default Downloader;
