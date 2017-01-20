import React from 'react';

import NavHeadItem from '../containers/nav-head-item.js';
import UserAccount from '../containers/user-account.js';
import AutocompleteSearch from './autocomplete.jsx';

const Head = () => (
  <div className="head">
    <div className="container">
      <div className="head-wrap">
        <div className="head-left">
        	<span className="logo">
        	  <a className="logo-arrow" href="/">
		          Mostmp3
        	  </a>
        	</span>
        	{/*<div className="nav">
        	  <NavHeadItem href='/about' name='About' />
            <NavHeadItem href='/manual' name='Manual' />
            <NavHeadItem href='/dmca' name='DMCA' />
			    </div>*/}
        </div>
        <div className="head-user">
          <AutocompleteSearch/>
          {/*<div className="nav">
            <UserAccount />
          </div>*/}
        </div>
      </div>
    </div>
  </div>
);

export default Head;
