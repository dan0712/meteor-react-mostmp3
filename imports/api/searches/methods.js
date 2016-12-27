import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Searches } from './searches.js';

const youtubeSearchSync = Meteor.wrapAsync(YoutubeApi.search.list, YoutubeApi.search);
const youtubeVideoListSync = Meteor.wrapAsync(YoutubeApi.videos.list, YoutubeApi.videos);

function unslugify(str) {
	return str.replace(/-/g, ' ');
}

function aggregateSearch() {
  return Searches.aggregate([
    { "$group": {
      "_id": "$_id",
      "slug":{$first: "$slug"},
    }}
  ]);
}

function searchYoutubeTracks (slug) {
  const items = youtubeSearchSync({
    part: "id",
    type: "video",
    maxResults: 10,
    q: slug,
  });

	let videoIds = '';
	_.each(items.items, (item) => {
    videoIds += item.id.videoId;
		videoIds += ',';
	});
	if (videoIds) {
		videoIds = videoIds.substr(0, videoIds.length - 1);
	}
	const itemDetails = youtubeVideoListSync({
		part: "snippet, contentDetails",
		id: videoIds,
	});

  const youtube_results = [];
  _.each(itemDetails.items, (item)=> {
    youtube_results.push({
      video_id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      author: item.snippet.channelTitle,
			duration: item.contentDetails.duration,
    })
  });

  return youtube_results;
}

Meteor.methods({
  removeSearch(slug) {
    Searches.remove({slug});
  },
  addDmcaToSearch(slug) {
    Searches.update({slug}, {$set: {dmca: true}});
  },
  updateSearchBySlug(slug) {
    const search = Searches.findOne({slug});
    Meteor.call('updateSearch', search);
  },
  checkIfSearchAlreadySavedAndReturnVideoId (slug) {
    return Searches.findOne({slug}) || Meteor.call('saveNewSearch', slug);
  },
  checkIfSearchAlreadySaved(slug) {
    return Searches.findOne({slug}, {fields : {slug: 1}}) || Meteor.call('saveNewSearch', slug);
  },
  updateSearch(search) {
    console.log('update search '+search.slug);
    const youtube_results = searchYoutubeTracks(search.slug);
    if (youtube_results.length > 0 ) {
      Searches.update({_id: search._id}, {$currentDate: {date: true}, $set: {youtube_results}});
      return ( youtube_results && youtube_results[0] ) ? youtube_results[0].video_id : null;
    }
    return null;
  },
  saveNewSearch(slug) {
    const youtube_results = searchYoutubeTracks(slug);
    if (youtube_results.length > 0 ) {
      const time = new Date();
      const _id = Searches.insert({slug, date: time, publishedAt: time, youtube_results});
      return {slug, _id, video_id: youtube_results[0] ? youtube_results[0].video_id : null};
    }
    return null;
  },
  removeAllSearches() {
    Searches.remove({});
  },
  removeSearches (sample) {
  	const searches = aggregateSearch();

    _(searches).each(function(search) {
      if ( search.slug.indexOf(sample) > -1 ) {
        Searches.remove({_id: search._id})
        console.log(search.slug);
      }
    });
  },
  fixSlugDoubles() {
    const songs = aggregateSearch();

    _.each(songs, function(song) {
      if (song.slug.indexOf("--") > -1) {
        const slug = song.slug.replace(/--/g, '-');
        console.log('update '+song.slug);
        Searches.update({_id:song._id}, {$set: {slug}});
      }
    });
  },
  fixSlugEnd() {
    const songs = aggregateSearch();

    _.each(songs, function(song) {
      if (song.slug.charAt(song.slug.length - 1) == '-') {
        const slug = song.slug.substr(0, song.slug.length - 1);
        console.log('update '+song.slug);
        Searches.update({_id:song._id}, {$set: {slug}});
      }
    });
  },
  fixSlugSpaces() {
    this.unblock();
    const searches = aggregateSearch();

    _.each(searches, function(search) {
      if (search.slug.indexOf(' ') > -1) {
        Searches.remove({_id: search._id});
      }
    });
  },
  removeMultiple() {
    this.unblock();
    const searches = Searches.aggregate([
      {
        "$group":
        {
          "_id": "$slug",
          "count": { "$sum": 1 },
          "id": {
            "$addToSet": "$_id"
          }
        }
      },
      {
        "$match":
        {
          "count": { "$gte": 2 }
        }
      },
      {
        "$sort" :
        {
          "count" : -1
        }
      },
    ])

    _(searches).each(function(search) {
      const items = search.id;
      for(i=1;i<items.length;i++) {
        Searches.remove(items[i]);
      }
    });
  },
  removeEmptySearches() {
    this.unblock();
    const searches = Searches.aggregate([
      { "$match": {
        "slug": { "$exists": false }
      }},
      { "$group": {
        "_id": "$_id",
      }}
    ])

    console.log(searches.length);

    _(searches).each(function(search) {
      Searches.remove({_id: search._id});
    });
  },
});
