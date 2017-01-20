import React, { Component } from 'react';

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

class Song extends Component {

  constructor(props) {
    super(props);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onDownload = _.debounce(this.onDownload.bind(this), 200);
    this.onMoreResults = _.debounce(this.onMoreResults.bind(this), 200);
  }

  onPlay() {
    this.props.onPlayingChange(this.props.track, this.props.index, true);
  }

  onPause() {
    this.props.onPlayingChange(this.props.track, this.props.index, false);
  }

  onDownload() {
    this.props.onDownloadChange(this.props.track, this.props.index);
  }

  routeSearchQuery (slug) {
    FlowRouter.go('App.search', {slug});
  }

  noResult() {
    alert('No more results for this song');
  }

  onMoreResults() {
    const self = this;
    const slug = cleanAndSlugifyQuery(this.props.track.artists[0].name+'-'+this.props.track.name);
    Meteor.call('checkIfSearchAlreadySaved', slug, function(err, result) {
      result ? self.routeSearchQuery(result.slug) : self.noResult();
    });
  }

  prettifyDuration() {
    return hhmmss(this.props.track.duration_ms / 1000);
  }

  render() {
    const {
        track,
        loadingOn,
        currentVideoId,
        thumbnail,
        playing,
        index,
        search
    } = this.props;

    const smallestThumbnail = thumbnail || ( track.album.images.length > 0 ? track.album.images[track.album.images.length - 1].url : null );
    const src = "https://www.youtube.com/embed/"+currentVideoId+"?autoplay=1";
    const titleDownload = "Download mp3 "+track.artists[0].name+" "+track.name;
    const titlePlay = "Play mp3 "+track.artists[0].name+" "+track.name;
    const artist = track.artists[0].name;

    return (
        <div>
          <div key={track.id} className={playing ? "track track-type-full track-selectable track-selected" : "track track-type-full track-selectable"}>
            <div className="track-cover">
              <img src={thumbnail || smallestThumbnail} className="album-cover album-cover-size-S" alt={titleDownload}/>
            </div>
            <div className="track-play track-hover">
              <button className="btn-play-type-track btn-play-round-yellow" onClick={playing ? this.onPause : this.onPlay} title={titlePlay}>
                <i className={playing ? "fa-pause fa icon" : "fa-play fa icon"}></i>
              </button>
            </div>
            <div className="track-name track-name-item">
              <div className="track-name-wrap track-title track-ellipse"> 
                {artist}
              </div>
              <div className="track-description subinfo track-ellipse">
                {track.name}
              </div>
            </div>
            <div className="track-desktop">
                <div className="track-actions">
                  <button className="btn btn-primary btn-download btn-icon" title={titleDownload} onClick={this.onDownload}>
                    <i className="fa fa-download"></i> Download
                  </button>
                  {search 
                    ? null
                    : <button className="btn btn-primary btn-icon sumo-link" title={titleDownload} onClick={this.onMoreResults}> <i className="fa fa-external-link" aria-hidden="true"></i> More results </button>}
                </div>
            </div>
            <div className="track-mobile track-download">
              <div className="track-actions">
                  <button className="btn-play-type-track btn-download-round" title={titleDownload}>
                    <i className="fa fa-download"></i> 
                  </button>
              </div>
            </div>
            <div className="track-info">
                <span className="track-lib">{this.prettifyDuration()}</span>
            </div>
          </div>
          {playing ? <div className="track-video"> {currentVideoId ? <iframe src={src}></iframe> :  <div>Currently No Results For This Song. Try Search</div>}</div> : null }
        </div>
    )
  }
}

export default Song;