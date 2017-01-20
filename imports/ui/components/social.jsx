import React, { Component } from 'react';

import PlusOneButton from './g-plus-button.jsx';
import FacebookButton from './facebook-button.jsx';
import TwitterButton from './twitter-button.jsx';

class Social extends Component {
    render() {
      return (
        <div className="social">
          <FacebookButton/>
          <PlusOneButton/>
          <TwitterButton/>
        </div>
      )
    }
}

export default Social;