import React, {Component} from 'react';

import SmallSong from '../components/small-song.jsx';

import '../components/global-functions.js';

class AppVideoItem extends Component {

  constructor(props) {
    super(props);
    this.onYoutubeinMp3Download = this.onYoutubeinMp3Download.bind(this);
    this.onShowYoutubeinMp3Download = this.onShowYoutubeinMp3Download.bind(this);
    this.state = {
      alternative: false,
    };
  }

  onYoutubeinMp3Download() {
    const self = this;
    this.setState({loadingOn: true});
    getYoutubeMp3(this.props.videoId);

    analytics.track("Download Song", {
      eventName: "Download Song",
    });
  }

  onShowYoutubeinMp3Download() {
    this.setState({
      alternative: true,
    });
  }

  render() {
    const {videoName, videoId, recent} = this.props;

    return (
      <div className="row">
        <div className="col-md-8">
          <div className="page-title mobile-center video-item">
            <h1>{videoName} Mp3</h1>
            <iframe id="ytubeframe" src={`https://www.yt-download.org/api-console/audio/${this.props.videoId}`} width="100%" scrolling="no" style={{border: 'none'}}></iframe>
            <div className="alt-download">
              <p>
                Can’t download? <a className="alt" onClick={this.onShowYoutubeinMp3Download}>Click here</a> for alternate download file
              </p>
              {
                this.state.alternative &&
                <button className="btn btn-secondary btn-download btn-size-xxl btn-icon" onClick={this.onYoutubeinMp3Download}>
                  <i className="fa fa-download"></i>Download Mp3
                </button>
              }
            </div>
          </div>
        </div>
        <div className="col-md-4 col-border-left">
          <div className="snippet-item snippet-right">
            <div className="sidebar">
              <div className="sidebar-item">
                <h3>Now downloading</h3>
                {recent.map(({_id, slug, songId, artist, track, date}) => (
                  <SmallSong key={_id} slug={slug} songId={songId} artist={artist} track={track} date={date}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default AppVideoItem;
