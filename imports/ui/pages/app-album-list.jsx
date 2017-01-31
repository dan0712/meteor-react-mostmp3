import React from 'react';
import { _ } from 'meteor/underscore';

import Loading from '../components/loading.jsx';
import ListItem from '../components/list-item.jsx';

AppAlbumList = React.createClass({
  getInitialState() {
    const self = this;
    Meteor.call('getUserAlbums', function(err, result) {
      const albums = result.items.map((item) => { return item["album"] });
      self.setState({lists: albums, loadingOn: false});
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

export default AppAlbumList;