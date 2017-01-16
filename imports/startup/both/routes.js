import React from 'react';
import {mount} from 'react-mounter';
import pathToRegexp from 'path-to-regexp';
// Main Layout
import AppLayout from '../../ui/layouts/app-layout.jsx';

// Home
import AppHome from '../../ui/containers/app-home.js';

// Static
import AppAbout from '../../ui/containers/app-about.js';
import AppManual from '../../ui/containers/app-manual.js';
import AppLegal from '../../ui/pages/app-legal.jsx';
import AppDmca from '../../ui/pages/app-dmca.jsx';

// Single
import AppSearchItem from '../../ui/containers/app-search-item.js';
import AppVideoItem from '../../ui/containers/app-video-item.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
  	mount(AppLayout, {
  		content: <AppHome />
  	})
  }
});

FlowRouter.route('/en', {
  name: 'App.en',
  action() {
    FlowRouter.go('/');
  }
});

FlowRouter.route('/about', {
	name: 'App.about',
	action() {
		mount(AppLayout, {
  		content: <AppAbout />
  	})
	}
});

FlowRouter.route('/manual', {
	name: 'App.manual',
	action() {
		mount(AppLayout, {
  		content: <AppManual />
  	})
	}
});

FlowRouter.route('/legal', {
	name: 'App.legal',
	action() {
		mount(AppLayout, {
  		content: <AppLegal />
  	})
	}
});

FlowRouter.route('/dmca', {
  name: 'App.dmca',
  action() {
    mount(AppLayout, {
      content: <AppDmca />
    })
  }
});

FlowRouter.route('/download/:slug', {
  name: 'App.search',
  action() {
    mount(AppLayout, {
  		content: <AppSearchItem />
  	})
  }
});

FlowRouter.route('/v/:video_name/:video_id', {
  name: 'App.videoItem',
  action() {
    mount(AppLayout, {
      content: <AppVideoItem />
    })
  }
});

if(Meteor.isServer) {
    WebApp.connectHandlers.use('/', function(req, res, next) {
      if(isValidRoute(req.url))
          return next();

      res.writeHead(404);
      res.end("404 Page Not Found. Go Back To - http://mp3toget.com");
    });

    function isValidRoute(requestUrl) {
      if (/(user|artist|album)\//i.test(requestUrl) ) return true;
      let splitUrl = requestUrl.split('?')[0];
      for(var i = 0; i < FlowRouter._routes.length; i++)
          if(pathToRegexp(FlowRouter._routes[i].path).test(splitUrl))
              return true;

      return false;
    }
}
