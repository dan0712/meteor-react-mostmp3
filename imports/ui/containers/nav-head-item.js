import {composeWithTracker} from 'react-komposer';
import NavHeadItem from '../components/nav-head-item.jsx';

function composer(props, onData) {
  const currentRoute = FlowRouter.current().path;
  onData(null, {currentRoute});
};

export default composeWithTracker(composer)(NavHeadItem);
