import React from 'react';

import Loading from '../components/loading.jsx';
import Song from '../components/song.jsx';
import SingleItemHead from '../components/single-item-head.jsx';
import '../components/global-functions.js';

AppArtistItem = React.createClass({
  getInitialState() {
    const self = this;
    this.getArtistId = () => FlowRouter.getParam('artistId');

    this.videoActions = (video_id) => {
      this.setState({currentVideoId: video_id, loadingOn: false});
      this.state.downloadSong ? getYoutubeMp3(video_id) : null;
    }

    this.checkIfSongAlreadySaved = (track) => {
      const self = this, slug = cleanAndSlugifyQuery(track.artists[0].name+' '+track.name);
      Meteor.call('checkIfSearchAlreadySavedAndReturnVideoId', slug, function (err, result) {
        result 
          ? ( ( result.video_id ? self.videoActions(result.video_id) : self.videoActions(result.youtube_results[0].video_id) ), Meteor.call('saveRecentSong', slug, track.artists[0].name, track.name, track.album ? track.album.images[track.album.images.length - 1].url : null) )
          : self.setState({loadingOn: false});
      });
    }

    Meteor.call('getArtistItem', this.getArtistId(), function(err, result) {
      self.setState({item: result});
    });

    Meteor.call('getArtistItemTracks', this.getArtistId(), function(err, result) {
      self.setState({tracks: result.tracks, loadingOn: false});
    });

    return {
      item: [],
      tracks: [],
      loadingOn: true,
      playingTrack: null,
      currentVideoId: null,
      downloadSong: false,
    };
  },

  onPlayingChange(track, index, playing) {
    this.setState({
      playingTrack: playing ? track.id : null,
      currentVideoId: null,
      downloadSong: false,
      loadingOn: playing || null,
    })
    playing ? this.checkIfSongAlreadySaved(track) : null;
  },

  onDownloadChange(track) {
    this.setState({
      playingTrack: this.state.playingTrack === track.id ? track.id : false,
      downloadSong: true,
      loadingOn: true,
    })
    this.state.playingTrack === track.id ? ( getYoutubeMp3(this.state.currentVideoId), this.setState({loadingOn: false}) ): this.checkIfSongAlreadySaved(track)
  },

  render() {
    const { item, loadingOn, tracks, playingTrack, currentVideoId} = this.state;

    const Songs = tracks.map((track) => (
      <Song 
        track={track}
        key={track.id}
        currentVideoId={currentVideoId}
        playing={track.id === playingTrack}
        onPlayingChange={this.onPlayingChange}
        onDownloadChange={this.onDownloadChange}
      />
    ));

    return (
      <div>
        {loadingOn ? <Loading /> : null}
        {item && item.name  ? <SingleItemHead name={item.name} type={item.type} thumbnail={item.images[0] ? item.images[0].url : null}/> : null}
        <div className="serp-snippet">
            <div className="serp-snippet-tracks">
              {tracks ? Songs : null}
            </div>
        </div>
      </div>
    )
  }
});

export default AppArtistItem;