import React from 'react';

import Song from '../components/song.jsx';
import Loading from '../components/loading.jsx';
import '../components/global-functions.js';

AppSongList = React.createClass({
  getInitialState() {
    const self = this;

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
    
    Meteor.call('getUserSongs', function(err, result) {
      self.setState({songs: result.items, loadingOn: false});
    });

    return {
      songs: [],
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
    const { songs, loadingOn, playingTrack, currentVideoId} = this.state;

    const Songs = songs.map(({track}, index) => ( 
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
      <div className="serp-snippet">
          <div className="serp-snippet-tracks">
            { loadingOn ? <Loading/> : null }
            { Songs }
          </div>
      </div>
    )
  }
});

export default AppSongList;