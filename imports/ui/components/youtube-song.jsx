import React, { Component } from 'react';
import moment from 'moment';

import './global-functions.js';

function pad(num) {
    return ("0"+num).slice(-2);
}

function hhmmss(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs%60;
  var hours = Math.floor(minutes/60)
  minutes = minutes%60;
  if (hours == 0) {
    return pad(minutes)+":"+pad(secs);
  }
  else {
    return pad(hours)+":"+pad(minutes)+":"+pad(secs);
  }
}

class YoutubeSong extends Component {

  constructor(props) {
    super(props);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onRoute = this.onRoute.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onShare = this.onShare.bind(this);

    this.state = {
      share: false,
    };
  }

  onPlay(e) {
    e.preventDefault();
    this.props.onYoutubePlayingChange(this.props.track.video_id, true);
  }

  onPause(e) {
    e.preventDefault();
    this.props.onYoutubePlayingChange(this.props.track.video_id, false);
  }

  onRoute(e) {
    e.preventDefault();
    this.props.onYoutubeRouteChange(this.props.track);
  }

  onDownload(e) {
    e.preventDefault();
    this.props.onYoutubeDownloadChange(this.props.track);
  }

  onShare(e) {
    e.preventDefault();
    this.setState({
      share: !this.state.share,
    });
  }

  prettifyDuration() {
    return hhmmss(this.props.track.duration_ms / 1000);
  }

  iso8601DurationToString(duration) {
    const reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    let hours = 0, minutes = 0, seconds = 0;
    let result = '';

    if (reptms.test(duration)) {
      var matches = reptms.exec(duration);
      if (matches[3]) {
        result = matches[3];
      }
      if (matches[2]) {
        result = matches[2] + ':' + result;
      }
      if (matches[1]) {
        result = matches[1] + ':' + result;
      }
    }
    return result;
  }

  componentDidMount() {
    if (Meteor.isClient) {
      // Share box
      const shares = ['facebook', 'twitter', 'google_plusone_share', 'email', 'compact'];
      let html = '';
      for(let i = 0; i < shares.length; i++) {
        html += `<a class="addthis_button_${shares[i]}"></a>`;
      }
      this.refs.songShareBox.innerHTML = html;
      this.refs.songShareBox.className = "addthis_toolbox addthis_32x32_style addthis_default_style";
      setTimeout(() => {
        addthis.toolbox('#song-share-box');
      }, 0);
    }
  }

  render() {
    const {
        track,
        loadingOn,
        playing
    } = this.props;

    const src = "https://www.youtube.com/embed/"+track.video_id+"?autoplay=1";
    const timeAgo = track.publishedAt ? moment(new Date(track.publishedAt)).fromNow() : null;

    return (
        <div className="track-margin">
          <div key={track.video_id} className={playing ? "track track-type-full track-selectable track-selected" : "track track-type-full track-selectable"}>
            <div className="track-cover">
              <img src={track.thumbnail} className="album-cover album-cover-size-S"/>
            </div>
            <div className="track-name">
              <h4 className="track-name-wrap track-title track-ellipse">
                {track.title}
              </h4>
              <div className="track-description subinfo track-ellipse">
                {/*{track.author ? <span> <i className="fa fa-user"></i> {track.author} <i className="fa fa-long-arrow-right"></i> </span> : null }
                {timeAgo ? <span> Published: <i className="fa fa-clock-o"></i> {timeAgo} </span> : null }*/}
                <span>Duration: {this.iso8601DurationToString(track.duration)}</span>
                <span> - Filetype: mp3</span>
                <span> - Bitrate: 320 Kbps</span>
              </div>
              <div className="track-action-buttons">
                {
                  playing ?
                  <a href="#" className="alt one-line" onClick={this.onPause}>
                    <i className="fa fa-stop"></i> Stop
                  </a>
                  :
                  <a href="#" className="alt one-line" onClick={this.onPlay}>
                    <i className="fa fa-play"></i> Play
                  </a>
                }
                <a href="#" className="alt one-line" onClick={this.onRoute}>
                  <i className="fa fa-download"></i> Download mp3
                </a>
                <a href="#" className="alt one-line" onClick={this.onShare}>
                  <i className="fa fa-share"></i> Share
                </a>
              </div>
              <div
                ref="songShareBox"
                id="song-share-box"
                style={this.state.share ? {} : { display: 'none' }} />
            </div>
          </div>
          {playing ? <div className="track-video"> <iframe src={src}></iframe> </div> : null }
        </div>
    )
  }
}

export default YoutubeSong;
