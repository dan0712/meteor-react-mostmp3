import React, { Component } from 'react';
import moment from 'moment';

class SmallSong extends Component {
    render() {
        const {_id, slug, artist, track, thumbnail, songId, date, count} = this.props;
        const url = '/download/'+slug;
        const title = track
          ? artist+' - '+track
          : artist;

        return (
          <div className="small-song">
            <a className="alt" href={url}>
              {title}
            </a>
          </div>
        )
    }
}

export default SmallSong;
