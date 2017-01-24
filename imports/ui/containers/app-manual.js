import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';

import AppManual from '../pages/app-manual.jsx';

function composer(props, onData) {
  onData(null, {});
  DocHead.setTitle('How to download Spotify to mp3');
  DocHead.addMeta({
    name: 'description', content: "How to download all your favorite Spotify songs, artists, albums and playlists in the best MP3 quality. It's free, unlimited and without any registration."
  });
  DocHead.addMeta({
    name: 'keywords', content: 'mp3, download, downloader, music, playlist, spotify, free, spotifytube, mp3toget'
  });
  DocHead.addMeta({
    property: 'og:title', content: 'How to download to Spotify mp3'
  });
  DocHead.addMeta({
    property: 'og:description', content: "How to download all your favorite Spotify songs, artists, albums and playlists in the best MP3 quality. It's free, unlimited and without any registration."
  });
  DocHead.addMeta({
    property: 'og:image', content: 'http://mostmp3.com/spotifytube-min.png'
  });
  DocHead.addMeta({
    property: 'og:url', content: 'http://mostmp3.com/manual'
  });
};

export default composeWithTracker(composer)(AppManual);
