import React from 'react';
import { _ } from 'meteor/underscore';
import Loading from '../components/loading.jsx';
import '../components/global-functions.js';
import Song from '../components/song.jsx';
import SingleItemHead from '../components/single-item-head.jsx';

AppPlaylistItem = React.createClass({
  getInitialState() {
    const self = this;
    this.getOwnerId = () => FlowRouter.getParam('ownerId');
    this.getPlaylistId = () => FlowRouter.getParam('playlistId');

    this.setMoreTracksIfAvailable = () => {
      this.setState({
        getMoreTracks: this.state.currentItemTotal > this.state.currentItemOffsetPlusLimit
      });
    }

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

    Meteor.call('getPlaylistItem', this.getOwnerId(), this.getPlaylistId(), function(err, result) {
      self.setState({
        item: result,
        playlistTracks: result.tracks.items,
        loadingOn: false,
        currentItemTotal: result.tracks.total,
      });
      self.setMoreTracksIfAvailable();
    });

    return {
      item: {},
      playlistTracks: [],
      loadingOn: true,
      playingTrack: null,
      currentVideoId: null,
      downloadSong: false,
      getMoreTracks: false,
      currentItemTotal: 0,
      currentItemOffsetPlusLimit: 100,
    };
  },

  getMoreTracksIfAvailable() {
    const self = this;
    this.setState({ loadingOn: true, getMoreTracks: false});
    Meteor.call('getPlaylistItemTracks', this.getOwnerId(), this.getPlaylistId(), this.state.currentItemOffsetPlusLimit, function(err, result) {
      self.setState({
        playlistTracks : self.state.playlistTracks.concat(result),
        currentItemOffsetPlusLimit: self.state.currentItemOffsetPlusLimit + 100,
        loadingOn: false,
      });
      self.setMoreTracksIfAvailable();
    })
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
    const { item, playlistTracks, loadingOn, playingTrack, currentVideoId, getMoreTracks } = this.state;

    let Songs;
    if (item && playlistTracks) {
      Songs = playlistTracks.map(({track}) => (
        <Song 
          track={track}
          key={track.id}
          currentVideoId={currentVideoId}
          playing={track.id === playingTrack}
          onPlayingChange={this.onPlayingChange}
          onDownloadChange={this.onDownloadChange}
        />
      ));
    }
    
    return (
      <div>
        {loadingOn ? <Loading /> : null}
        {item && item.tracks ? <SingleItemHead name={item.name} type={item.type} thumbnail={item.images[0].url} /> : null}
        <div className="serp-snippet">
            <div className="serp-snippet-tracks">
              {item && item.tracks ? Songs : null}
              {getMoreTracks? <div className="page-more" onClick={this.getMoreTracksIfAvailable}>More Tracks</div> : null}
            </div>
        </div>
      </div>
    )
  }
});

export default AppPlaylistItem;