import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';

import AppHome from '../pages/app-home.jsx';

import { Popularsongs } from '../../api/songs/recentsongs.js';
import { Recentsongs } from '../../api/songs/recentsongs.js';

function composer(props, onData) {
  const recentHandle = Meteor.subscribe('recentsongs');
  const popularHandle = Meteor.subscribe('popularsongs');
  if(recentHandle.ready() && popularHandle.ready() ) {
    const popular = Popularsongs.find({}, {limit: 15, sort: {count: -1}}).fetch();
    const recent = Recentsongs.find({}, {limit: 15, sort : {date: -1}}).fetch();

    onData(null, {recent, popular});

    DocHead.setTitle('MostMp3.com - Free mp3 downloads');
    DocHead.addMeta({
      name: 'description', content: "Mostmp3.com is a fast music search engine to download your favorite mp3 songs for free."
    });
    DocHead.addMeta({
      name: 'keywords', content: 'mp3, download, downloader, music, playlist, free, downloads, song, mp3 juice, free music downloads, mp3 download'
    });
    DocHead.addMeta({
      property: 'og:title', content: 'Mostmp3.com: Free mp3 downloads'
    });
    DocHead.addMeta({
      property: 'og:description', content:  "Download and listen to high quality free music at different bitrates including 320kbps without the need to register."
    });
    DocHead.addMeta({
      property: 'og:image', content: 'http://mostmp3.com/spotifytube-min.png'
    });
    DocHead.addMeta({
      property: 'og:url', content: 'http://mostmp3.com'
    });
  };
};

export default composeWithTracker(composer)(AppHome);
