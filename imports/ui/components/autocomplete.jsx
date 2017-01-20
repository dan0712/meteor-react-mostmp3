import React from 'react';
import ReactDOM from 'react-dom';
import Autocomplete from 'react-autocomplete';

// XXX: Session
import { Session } from 'meteor/session';

import Loading from '../components/loading.jsx';
import './global-functions.js';

AutocompleteSearch = React.createClass({
  getInitialState () {
    return {
      value: '',
      unitedStates: [],
      loadingOn: false
    }
  },

  routeSearchQuery (slug) {
    location.href='/download/'+slug;
    this.setState({loadingOn: false});
  },

  noResult() {
    this.setState({loadingOn: false});
    alert('No result for your search query');
  },

	checkIfSearchAlreadySaved(query) {
		const self = this;
    Meteor.call('checkIfSearchAlreadySaved', cleanAndSlugifyQuery(query), function(err, result) {
      result ? self.routeSearchQuery(result.slug) : self.noResult();
    });
  },
  handleSubmit(text) {
    if (text) {
    	if (/spotify[.:]/i.test(text)){
    		const self = this;
        this.setState({loadingOn: true});
    		Meteor.call('parseSpotifyUri', text, (err, result) => {
          if (result.track) {
            self.checkIfSearchAlreadySaved(result.track);
          }
          else if (result.playlist) {
            if (Meteor.user()) {
              FlowRouter.go('/user/'+result.playlist.user+'/playlist/'+result.playlist.id);
            } else {
              Session.set('eventStatus', true)
            }
          }
          this.setState({loadingOn: false});
        });
    	} else if (/deezer./i.test(text)) {
        location.href="http://www.acemp3.com";
      } else if (/youtube./i.test(text)) {
        window.open("http://www.youtubeinmp3.com", '_blank');
      } else {
        this.setState({loadingOn: true});
    		this.checkIfSearchAlreadySaved(text);
    	}
    }
  },
  getCurrentValue() {
    this.handleSubmit(this.state.value);
  },
	fakeRequest (value, cb) {
	  const suggestionsUrl = "http://suggestqueries.google.com/complete/search?hl=en&ds=yt&client=youtube&q=" + encodeURIComponent(value);

	  $.ajax({
      url: suggestionsUrl,
      type: 'GET',
      dataType: 'jsonp',
      success: function (data) {
        // Update the typeahead input field.
        const items = _.map(data[1], (item) => {
        	return item[0];
        })
        cb(items);
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
	},
  render () {

		const {loadingOn} = this.state;

    return (
      <div className="nav-autocomplete">
        <Autocomplete
          inputProps={{name: "head-search", type: "text", placeholder: "Search Mp3"}}
          ref="textInput"
          value={this.state.value}
          items={this.state.unitedStates}
          getItemValue={(item) => item}
          menuStyle={{ backgroundColor: '#222' }}
          onSelect={(value, item) => {
            // set the menu to only the selected item
            this.setState({ value, unitedStates: [ item ] })
            // or you could reset it to a default list again
            this.handleSubmit(value);
          }}
          onChange={(event, value) => {
            this.setState({ value, loading: true })
            this.fakeRequest(value, (items) => {
              this.setState({ unitedStates: items, loading: false })
            })
          }}
          renderItem={(item, isHighlighted) => (
            <div
              className={isHighlighted ? 'search-highlighted-item' : 'search-item'}
            >{item}</div>
          )}
        />
        <span className="search-icon" onClick={this.getCurrentValue}> </span>
        {loadingOn ? <Loading/> : null}
      </div>
    )
  }
})

export default AutocompleteSearch;
