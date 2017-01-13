import { Meteor } from 'meteor/meteor';

import { Recentsongs } from '../recentsongs.js';
import { Popularsongs } from '../recentsongs.js';

Meteor.publish('popularsongs',function(){
    return Popularsongs.find({}, {limit: 15});
});

Meteor.publish('popular.All',function(){
    return Popularsongs.find({}, {limit: 100});
});

Meteor.publish('recentsongs', function() {
	return Recentsongs.find({}, {limit: 15, sort : {date: -1}});
});

Meteor.publish('recent.All',function(){
    return Recentsongs.find({}, {limit: 100, sort : {date: -1}});
});

