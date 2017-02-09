import React from 'react';
import { _ } from 'meteor/underscore';

import Loading from '../components/loading.jsx';
import ListItem from '../components/list-item.jsx';

AppPlaylistList = React.createClass({
  getInitialState() {
    const self = this;
    Meteor.call('getUserPlaylists', function(err, result) {
      self.setState({lists: result.items, loadingOn: false});
    });

    return {
      lists: [],
      loadingOn: true,
    };
  },

  render() {
    return (
      <div className="list list-items">
        {this.state.loadingOn ? <Loading /> : this.state.lists.map(({id, name, type, owner, images}) => ( <ListItem key={id} id={id} name={name} type={type} owner={owner.id} thumbnail={images[0] ? images[0].url : null}/> ))}
      </div>
    )
  }
});

export default AppPlaylistList;