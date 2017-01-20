import React, { Component } from 'react';
import moment from 'moment';

class SimpleSmallSong extends Component {
    render() {
        const {_id, slug, artist, track, songId, date} = this.props;
        const url = '/download/'+slug;
        const timeAgo = moment(new Date(date)).fromNow();
        const title = track
          ? artist+' - '+track
          : artist

        return (
          <div key={_id} className="track-sidebar">
            <a href={url} className="track-title track-ellipse" title={title}>
              {title}
            </a>
            <div className="subinfo">{timeAgo}</div>
          </div>
        )
    }
}

export default SimpleSmallSong;