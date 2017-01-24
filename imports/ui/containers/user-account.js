import { Meteor } from 'meteor/meteor';
import {composeWithTracker} from 'react-komposer';
// XXX: Session
import { Session } from 'meteor/session';

import UserAccount from '../components/user-account.jsx';

function login() {
  Meteor.loginWithSpotify({requestPermissions: ['user-read-email']}, function(err, result) {
    // console.log(err || "No error");
    Session.get('eventStatus') ? Session.set('eventStatus', false) : null;
    FlowRouter.go('App.playlistList');
  });
}

function logout() {
  Meteor.logout(function (err, result) {
    FlowRouter.go('/');
  });
}

function composer(props, onData) {
  const user = Meteor.user();
  onData(null, {user, login, logout});
};

export default composeWithTracker(composer)(UserAccount);