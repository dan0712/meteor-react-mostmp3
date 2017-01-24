import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';

import AppAbout from '../pages/app-about.jsx';

function composer(props, onData) {
  onData(null, {});
  DocHead.setTitle('About Mostmp3.com');
  DocHead.addMeta({
    name: 'description', content: "Mostmp3.com is a fast music search engine to download your favorite mp3 songs for free."
  });
  DocHead.addMeta({
    name: 'keywords', content: 'mp3, download, downloader, music, playlist, free, downloads, song, mp3 juice, free music downloads, mp3 download'
  });
  DocHead.addMeta({
    property: 'og:title', content: 'About Mostmp3.com'
  });
  DocHead.addMeta({
    property: 'og:description', content:  "Download and listen to high quality free music at different bitrates including 320kbps without the need to register."
  });
  DocHead.addMeta({
    property: 'og:image', content: 'http://mostmp3.com/spotifytube-min.png'
  });
  DocHead.addMeta({
    property: 'og:url', content: 'http://mostmp3.com/about'
  });
};

export default composeWithTracker(composer)(AppAbout);
