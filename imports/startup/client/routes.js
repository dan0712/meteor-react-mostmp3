import { Meteor } from 'meteor/meteor';

import React from 'react';
import {mount} from 'react-mounter';
// XXX: Session
import { Session } from 'meteor/session';

// Main Layout
import AppLayout from '../../ui/layouts/app-layout.jsx';

// Lists
import AppSongList from '../../ui/pages/app-song-list.jsx';
import AppPlaylistList from '../../ui/pages/app-playlist-list.jsx';
import AppArtistList from '../../ui/pages/app-artist-list.jsx';
import AppAlbumList from '../../ui/pages/app-album-list.jsx';

// Items
import AppPlaylistItem from '../../ui/pages/app-playlist-item.jsx';
import AppArtistItem from '../../ui/pages/app-artist-item.jsx';
import AppAlbumItem from '../../ui/pages/app-album-item.jsx';

const userSection = FlowRouter.group({
    prefix: "/user",
    triggersEnter: [checkLoggedIn],
});

function checkLoggedIn (ctx, redirect) {  
  if (!Meteor.userId()) {
    Session.set('eventStatus', true);
    redirect("/");
  }
}

FlowRouter.route('/404', {
  name: '404',
  action() {
    location.reload(false);
  }
});

userSection.route('/songs', {
  name: 'App.songList',
  action() {
    mount(AppLayout, {
  		content: <AppSongList />
  	})
  }
});

userSection.route('/playlists', {
  name: 'App.playlistList',
  action() {
    mount(AppLayout, {
      content: <AppPlaylistList />
    })
  }
});

userSection.route('/artists', {
  name: 'App.artistList',
  action() {
    mount(AppLayout, {
      content: <AppArtistList/>
    })
  }
});

userSection.route('/albums', {
  name: 'App.albumList',
  action() {
    mount(AppLayout, {
      content: <AppAlbumList />
    })
  }
});

userSection.route('/:ownerId/playlist/:playlistId', {
  name: 'App.playlistItem',
  action() {
    mount(AppLayout, {
      content: <AppPlaylistItem />
    })
  }
});

FlowRouter.route('/artist/:artistId', {
  name: 'App.artistItem',
  triggersEnter: [checkLoggedIn],
  action() {
    mount(AppLayout, {
      content: <AppArtistItem />
    });
  }
});

FlowRouter.route('/album/:albumId', {
  name: 'App.albumItem',
  triggersEnter: [checkLoggedIn],
  action() {
    mount(AppLayout, {
      content: <AppAlbumItem />
    });
  }
});

Meteor.startup(function() {
    //Temp fix because first visit isn't tracked...
    analytics.page(FlowRouter.current().path);
});
