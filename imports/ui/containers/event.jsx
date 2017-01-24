import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { composeWithTracker } from 'react-komposer';
import Event from '../components/event.jsx';

function composer(props, onData) {
  const eventStatus = Session.get('eventStatus');
  onData(null, {eventStatus});
};

export default composeWithTracker(composer)(Event);