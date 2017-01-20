import React, {Component} from 'react';
import UserAccount from '../containers/user-account.js';

import { Session } from 'meteor/session';

class Event extends Component {
	render() {
		const {eventStatus} = this.props;

		return (
			<div>
    		{eventStatus ? <div className="event"> <div className="event-title"> Login to access your songs, artists, albums and playlists </div> <div className="event-login" title="Login to your Spotify account"> <UserAccount/> </div> </div> : null }
  		</div>
		)
	}
};

export default Event;
