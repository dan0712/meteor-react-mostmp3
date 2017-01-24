import { DocHead } from 'meteor/kadira:dochead';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { composeWithTracker } from 'react-komposer';

import AppVideoItem from '../pages/app-video-item.jsx';

import { Recentsongs } from '../../api/songs/recentsongs.js';

function capitalize(str) {
    return str.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase()} );
}

function composer(props, onData) {
  const videoName = capitalize( FlowRouter.current().params.video_name.replace(/-/g, ' ') );
  const videoId = FlowRouter.current().params.video_id;
  const recentHandle = Meteor.subscribe('recentsongs');

  if(recentHandle.ready()) {
    const recent = Recentsongs.find({}, {sort: {date: -1}, limit: 15}).fetch();
    onData(null, {videoName, videoId, recent});

    DocHead.addMeta({
      property: 'robots', content: 'noindex'
    });
  }
};

export default composeWithTracker(composer)(AppVideoItem);
