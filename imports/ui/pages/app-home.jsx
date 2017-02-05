import React, { Component } from 'react';
import SmallSong from '../components/small-song.jsx';

class AppHome extends Component {
  render() {
    const {recent, popular} = this.props;
    const recentCount = recent.length;

    return (
      <div>
        <div className="home-title">
          <h1>Free Mp3 Downloads</h1>
        </div>
        <div>
          {/*real thing
            popular.map(({_id, songId, artist, track, thumbnail, date, count}) => (
            <SmallSong key={_id} slug={_id} artist={artist} track={track} thumbnail={thumbnail} date={date} count={count}/>
          )) */}
          {recent.map(({_id, slug, artist, track, thumbnail, date}) => (
            <SmallSong key={_id} slug={slug} artist={artist} track={track} thumbnail={thumbnail} date={date}/>
          ))}
        </div>
        <h1 className="text-center home-subtitle">Recent Searches</h1>
        <div className="recent-searches">
          {recent.map(({_id, slug, artist, track, thumbnail, date}, i) => {
            const url = '/download/'+slug;
            const title = track
              ? artist+' - '+track
              : artist;
            return (
              <span key={_id}>
                <a className="alt" href={url}>{artist}</a>
                {i < recentCount - 1 ? <span>,&nbsp;&nbsp;</span> : ''}
              </span>
            );
          })}
        </div>
		  </div>
    )
  }
}

export default AppHome;
