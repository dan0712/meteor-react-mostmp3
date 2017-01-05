import { Meteor } from 'meteor/meteor';

import { Searches } from '../searches.js';

Meteor.publish('search.Single', function(slug) {
	check(slug, String);
	return Searches.find({slug});
});