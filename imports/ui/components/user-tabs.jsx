import React, {Component} from 'react';

import './global-functions.js';
import NavUserItem from '../containers/nav-user-item.js';

class UserTabs extends Component {
  render() {
    return (
      <div className="container">
        <div className="user-tabs">
          <div className="nav">
            <NavUserItem href='/' name='Home'/>
            <NavUserItem href='/user/playlists' name='Playlists' />
            <NavUserItem href='/user/songs' name='Songs' />
            <NavUserItem href='/user/artists' name='Artists' />
            <NavUserItem href='/user/albums' name='Albums' />
          </div>
        </div>
      </div>
    )
  }

};

export default UserTabs;
