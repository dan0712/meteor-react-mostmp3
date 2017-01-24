import {composeWithTracker} from 'react-komposer';
import NavUserItem from '../components/nav-user-item.jsx';

function composer(props, onData) {
  const currentRoute = FlowRouter.current().path;
  onData(null, {currentRoute});
};

export default composeWithTracker(composer)(NavUserItem);
