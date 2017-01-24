import { DocHead } from 'meteor/kadira:dochead';
import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import moment from 'moment';

import AppSearchItem from '../pages/app-search-item.jsx';

import { Searches } from '../../api/searches/searches.js';
import { Recentsongs } from '../../api/songs/recentsongs.js';

import '../components/global-functions.js';

function capitalize(str) {
    return str.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase()} );
}

function handle404(slug) {
  if (Meteor.isServer) {
    WebApp.connectHandlers.use('/download/'+slug, function(req, res, next) {
      // res.writeHead(404);
      // res.end("404 Page Not Found. Go Back To - http://mostmp3.com");
      res.writeHead(302, {"Location": "/"});
      res.end("");
    });
  }
}

function iso8601DurationToString(duration) {
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

function composer(props, onData) {

  const slug = FlowRouter.getParam('slug');
  const handle = Meteor.subscribe('search.Single', slug);
  const recentHandle = Meteor.subscribe('recentsongs');

  if (handle.ready() && recentHandle.ready() ) {
    const search = Searches.findOne({slug});
    if (search) {
      if (search.dmca) {
        // handle 404 error
        handle404(slug);
      } else {
        const diff = moment.duration(moment(search.date).diff(moment(Date.now())));
        const diffAsHours = Math.abs(diff.asHours());
        const updateStatus =  diffAsHours > 12 || false;
        const dateTo = moment.duration(12 - diffAsHours, "hours").humanize(true);
        const dateSince = moment(new Date(search.date)).fromNow();
        const recent = Recentsongs.find({}, {sort: {date: -1}, limit: 15}).fetch();
        const query =  capitalize( search.slug.replace(/-/g, ' ') );
        const image = search.youtube_results && search.youtube_results[0] ? search.youtube_results[0].thumbnail : 'http://mostmp3.com/spotifytube-min.png';
        const result = search.youtube_results[0];
        const duration = iso8601DurationToString(result.duration);

        onData(null, {search, dateSince, dateTo, updateStatus, recent, query});

        DocHead.setTitle(duration + ' ' + query + ' 320 Kbps Mp3 Download - Mostmp3.com');
        DocHead.addMeta({
          name: 'description',
          content: query + ' Duration: ' + duration + ' Filetype: mp3 Bitrate: 320 Kbps.'
            + ' Listen and download ' + query + ' in the best quality available and all your favorite Mp3s.'
        });
        DocHead.addMeta({
          name: 'keywords', content: query + ', download, mp3, free, music, downloader',
        });
        DocHead.addMeta({
          property: 'og:title', content: query+' Mp3 Download - Mostmp3.com'
        });
        DocHead.addMeta({
          property: 'og:description', content: query + ' Duration: ' + duration + ' Filetype: mp3 Bitrate: 320 Kbps'
        });
        DocHead.addMeta({
          property: 'og:image:url', content: image
        });
        DocHead.addMeta({
          property: 'og:image', content: image
        });
        DocHead.addMeta({
          property: 'og:url', content: 'http://mostmp3.com/download/'+slug
        });

        if (search.youtube_results && search.youtube_results.length < 2) {
          DocHead.addMeta({
            property: 'robots', content: 'noindex'
          });
        }
      }
    } else {
      // handle 404 error
      handle404(slug);
    }
  };
};

export default composeWithTracker(composer)(AppSearchItem);
