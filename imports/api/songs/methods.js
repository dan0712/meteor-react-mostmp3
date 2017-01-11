import { Meteor } from 'meteor/meteor';
import { SpotifyWebApi } from 'meteor/xinranxiao:spotify-web-api';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import spotify from 'spotify';
import spotifyUri from 'spotify-uri';

import { Recentsongs } from './recentsongs.js';
import { Popularsongs } from './recentsongs.js';
import { Searches } from '../searches/searches.js';

const youtubeSearchSync = Meteor.wrapAsync(YoutubeApi.search.list, YoutubeApi.search);
const spotifySearchSync = Meteor.wrapAsync(spotify.search, spotify);
const spotifyLookupSync = Meteor.wrapAsync(spotify.lookup, spotify);

Meteor.methods({
  saveRecentSong (slug, artist, track, thumbnail) {
    this.unblock();
    return Recentsongs.insert({date:new Date(),slug,artist,track,thumbnail});
  },
  getUserPlaylists () {
    const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getUserPlaylists(Meteor.user().services.spotify.id, {});

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getUserPlaylists(Meteor.user().services.spotify.id, {});
    }

    return response.data ? response.data.body : null;
  },
  getUserArtists () {
    const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getFollowedArtists({ limit : 20 });
    
    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getFollowedArtists({ limit : 20 });
    }

    console.log( response );

    return response.data ? response.data.body : null;
  },
  getUserAlbums() {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getMySavedAlbums({limit : 20, offset: 0});

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getMySavedAlbums({limit : 20, offset: 0});
    }

    return response.data ? response.data.body : null;
  },
  getUserSongs() {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getMySavedTracks({});

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getMySavedTracks({});
    }

    console.log( response );

    return response.data ? response.data.body : null;
  },
  getPlaylistItem(owner, playlist) {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getPlaylist(owner, playlist, {});

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getPlaylist(owner, playlist, {});
    }

    return response.data ? response.data.body : null;
  },
  getAlbumItem(albumId) {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getAlbum(albumId);

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getAlbum(albumId);
    }

    return response.data ? response.data.body : null;
  },
  getArtistItem(artistId) {
    const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getArtist(artistId);

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getArtist(artistId);
    }

    return response.data ? response.data.body : null;
  },
  getArtistItemTracks(artistId) {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getArtistTopTracks(artistId, 'US');

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getArtistTopTracks(artistId, 'US');
    }

    return response.data ? response.data.body : null;
  },
  getPlaylistItemTracks(owner, playlist, offset) {
  	const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getPlaylistTracks(owner, playlist, { 'offset' : offset, 'limit' : 100, 'fields' : 'items'});

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getPlaylistTracks(owner, playlist, { 'offset' : offset, 'limit' : 100, 'fields' : 'items'});
    }

    return response.data ? response.data.body.items : null;
  },
  saveNewReleases () {
    const spotifyApi = new SpotifyWebApi();
    let response = spotifyApi.getNewReleases({limit: 1, offset: 0, country: 'US'})

    if (checkTokenRefreshed(response, spotifyApi)) {
      response = spotifyApi.getNewReleases({limit: 1, offset: 0, country: 'US'})
    }

    for (var i=0,len=response.data.body.albums.total; i < len; i+=20) {
      console.log(i);
      saveNewAlbums(i);
    }
  },
  parseSpotifyUri(uri) {
    const parsed = spotifyUri.parse(uri);

    if (parsed.type == 'playlist') {

      return {playlist: {id: parsed.id, user: parsed.user}};

    } else {

      const item = spotifyLookupSync({
        type: parsed.type,
        id: parsed.id,
      });

      return {track: parsed.type == 'track' ? item.artists[0].name+' '+item.name : item.name};
    }
  },
  removeEmptyRecent() {
    songs = Recentsongs.aggregate([
      { "$group": {
        "_id": "$_id",
        "slug": {$first: "$slug"},
      }},
    ])

    console.log(songs.length);

    _.each(songs, function(song) {
      if (!song.slug || song.slug == "") {
        Recentsongs.remove({_id: song._id});
      }
    })
  }
});

function cleanAndSlugifyQuery (query) {
  return (slugify( query.replace(/[`~!@#%*$()^&_|+=;:",.<>\{\}\[\]\\\/]/gi, '-') ).replace(/-$/, '') ).replace(/--/g, '-');
}


function saveNewAlbums(offset) {

  const spotifyApi = new SpotifyWebApi();

  let response = spotifyApi.getNewReleases({limit: 20, offset: offset, country: 'US'})

  if (checkTokenRefreshed(response, spotifyApi)) {
    response = spotifyApi.getNewReleases({limit: 20, offset: offset, country: 'US'})
  }

  _.each(response.data.body.albums.items, function(i) {
    saveNewTracksFromAlbums(i.id);
  })
}

function saveNewTracksFromAlbums(id) {
  var spotifyApi = new SpotifyWebApi();
  var response = spotifyApi.getAlbumTracks(id, {});

  if (checkTokenRefreshed(response, spotifyApi)) {
    response = spotifyApi.getAlbumTracks(id, {});
  }

  _.each(response.data.body.items, function(i) {
    const slug = cleanAndSlugifyQuery(i.artists[0].name+' '+i.name);

    Meteor.call('checkIfSearchAlreadySaved', slug);
  });
}

const checkTokenRefreshed = function(response, api) {
  if (response.error && response.error.statusCode === 401) {
    api.refreshAndUpdateAccessToken();
    return true;
  } else {
    return false;
  }
}

console.log('time now ' + new Date());
const t = new Date();
t.setSeconds(t.getSeconds() + 10);
console.log('setting job to future in 10 seconds ' + t);

SyncedCron.add({
  name: 'generateSitemap',
  schedule: function (parser) {
    return parser.text('every 30 minutes');
  },
  job: function () {
    Meteor.call('generateSitemaps');
  }
});

SyncedCron.add({
  name: 'aggregateVideos',
  schedule: function (parser) {
    // ending_at is a Date object set to some future date
    // there is no recurrence
    return parser.text('every 20 minutes');
  },
  job: function () {
    const time = new Date(Date.now() - 1000 * 3600 * 12);

    Popularsongs.remove({});

    Recentsongs.remove( {date: { $lte: time} })

    const removeRecent = Meteor.call('removeEmptyRecent');

    songs = Recentsongs.aggregate([
      // Match the documents to every song downloaded in last 6 hours
      { "$match": {
        "date": { "$gte": time },
        "slug": { "$exists": true},
      }},
      { "$group": {
        "_id": "$slug",
        "count": { "$sum": 1 },
        "date": {$first: "$date"},
        "artist": {$first: "$artist"},
        "track": {$first: "$track"},
        "thumbnail": {$first: "$thumbnail"},
      }},
      // Sort from most downloaded to least
      { "$sort" : { 
        "count" : -1 
      }},
      { "$limit" : 100 }
    ])

    _(songs).each(function(song) {
      Popularsongs.insert(song);
    });
  }
});

SyncedCron.start();
