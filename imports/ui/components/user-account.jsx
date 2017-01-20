import React, {Component} from 'react';

class UserAccount extends Component {
  render() {
    const {user, logout, login} = this.props;
    return (
      <div id="useraccount">
        {user ? this.renderCurrentUser(user, logout) : this.renderLogin(login)}
      </div>
    )
  }

  renderCurrentUser(user, logout) {
    const userImage = {backgroundImage: 'url('+(user.profile.images[0] ? user.profile.images[0].url : null)+')'};

    return (
      <div>
        <a className="head-username" title={user.profile.display_name || user.profile.id}>
          {user.profile.display_name || user.profile.id}
        </a>
        <a className="head-userpic" title={user.profile.display_name || user.profile.id} style={userImage}>
        </a>
        <div className="nb-dropdown">
          <ul>
            <li role="presentation">
              <a id='logout' onClick={logout}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  renderLogin(login) {
    return (
      <div>
        <button id='login' className="btn btn-secondary btn-icon" onClick={login}>
          <i className="fa fa-spotify"></i> Login with Spotify
        </button>
      </div>
    );
  }
}

export default UserAccount;
