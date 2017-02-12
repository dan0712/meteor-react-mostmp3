import React, {Component} from 'react';
import {_} from 'meteor/underscore';
import NoSSR from 'react-no-ssr';

import YoutubeSong from '../components/youtube-song.jsx';
import Loading from '../components/loading.jsx';
import SmallSong from '../components/small-song.jsx';
import FacebookButton from '../components/facebook-button.jsx';

import '../components/global-functions.js';

class AppSearchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingOn: false,
      playingTrack: null,
      downloadSong: false,
    };
    this.onPlayingChange = this.onPlayingChange.bind(this);
    this.onUpdate = _.debounce(this.onUpdate.bind(this), 350);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  onPlayingChange(video_id, playing) {
    this.setState({
      playingTrack: playing ? video_id : null
    });
    analytics.track("Play Song", {
      eventName: "Play Song",
    });
  }

  onRouteChange(track) {
    Meteor.call('saveRecentSong', this.props.search.slug, track.title, null, track.thumbnail);
    location.href='/v/'+cleanAndSlugifyQuery(track.title)+'/'+track.video_id;
  }

  onUpdate(e) {
    if (this.props.updateStatus) {
      const search = this.props.search;
      Meteor.call('updateSearch', {_id: search._id, slug: search.slug});
      analytics.track("Update Song", {
        eventName: "Update Song",
      });
    };
  }

  render() {
  	const {search, dateSince, dateTo, updateStatus, popular, recent, query} = this.props;
  	const { loadingOn, playingTrack } = this.state;

    let Songs;
    if (search && search.youtube_results) {
      Songs = search.youtube_results.map((track, index) => (
        <YoutubeSong
          track={track}
          key={track.video_id}
          playing={track.video_id === playingTrack}
          onYoutubePlayingChange={this.onPlayingChange}
          onYoutubeDownloadChange={this.onDownloadChange}
          onYoutubeRouteChange={this.onRouteChange}
        />
      ));
    }

    return (
    	<div className="row-position">
        <div className="row">
          <div className="col-md-8 col-border-right">
            <div className="snippet-item snippet-left">
              <div className="page-title">
                <h1>{query} Free Mp3 Download</h1>
              </div>
              <div className="serp-snippet">
                <div className="serp-snippet-tracks">
                  {Songs}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="snippet-item snippet-right">
              <div className="sidebar">
                {! updateStatus || <div className="sidebar-item"> <h3>Always new downloads</h3><div className="sidebar-control"> <button className="btn btn-secondary" onClick={this.onUpdate}> Update now </button> </div> </div>}
                <div className="sidebar-item">
                  <h3>Now downloading</h3>
                  {this.props.recent.map(({_id, slug, songId, artist, track, date}) => (
                    <SmallSong key={_id} slug={slug} songId={songId} artist={artist} track={track} date={date}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {loadingOn ? <Loading/> :null}
    	</div>
    )
  }
}

export default AppSearchItem;
