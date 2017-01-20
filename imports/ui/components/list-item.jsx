import React, { Component } from 'react';

class ListItem extends Component {

  render() {
    const {id, name, type, thumbnail, owner} = this.props;
    const backgroundImage = {backgroundImage: 'url('+thumbnail+')'};

    let url = null;
    switch (type) {
      case 'playlist':
        url = '/user/'+owner+'/playlist/'+id;
        break;
      case 'artist':
        url = '/artist/'+id;
        break;
      case 'album':
        url = '/album/'+id;
        break;
    }

    return (
      <div key={id}>
        <a href={url}>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div className="list-item list-item-selectable">
              <div className="playlist-cover playlist-cover-decorated playlist-cover-size-L" style={backgroundImage}>
                {/*<div className="playlist-cover-decor"></div>
                <div className="playlist-cover-decor-line"></div>
                <div className="playlist-cover-border"></div>*/}
              </div>
              <div className="list-item-title" title={name}>
                {name}
              </div>
            </div>
          </div>
        </a>
      </div>
    )
  }
}

export default ListItem;
