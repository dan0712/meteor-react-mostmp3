import React, { Component } from 'react';

class SingleItemHead extends Component {

  render() {
    const {name, type, thumbnail} = this.props;
    const backgroundImage = {backgroundImage: 'url('+thumbnail+')'};

    return (
      <div className="playlist-head">
        <div className="playlist-cover-wrapper">
          <div className="playlist-cover playlist-cover-decorated playlist-cover-size-M" style={backgroundImage}>
            <div className="playlist-cover-decor"></div>
            <div className="playlist-cover-decor-line"></div>
            <div className="playlist-cover-border"></div>
          </div>
        </div>
        <div className="playlist-info">
          <div className="stamp">
          	{type}
          </div>
          <h1 className="page-playlist-title">
            {name}
          </h1>
        </div>
      </div>
    )
  }
}

export default SingleItemHead;