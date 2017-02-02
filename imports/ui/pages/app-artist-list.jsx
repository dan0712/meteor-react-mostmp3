import React from 'react';
import { _ } from 'meteor/underscore';

import Loading from '../components/loading.jsx';
import ListItem from '../components/list-item.jsx';

AppArtistList = React.createClass({
  getInitialState() {
    const self = this;
    Meteor.call('getUserArtists', function(err, result) {
      self.setState({lists: result.artists.items, loadingOn: false});
    });

    return {
      lists: [],
      loadingOn: true,
    };
  },

  render() {
    return (
      <div className="list list-items">
        {this.state.loadingOn ? <Loading /> : this.state.lists.map(({id, name, type, images}) => ( <ListItem key={id} id={id} name={name} type={type} thumbnail={images[0] ? images[0].url : null}/> ))}
      </div>
    )
  }
});

export default AppArtistList;