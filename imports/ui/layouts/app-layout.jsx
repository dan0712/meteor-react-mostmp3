import React, { Component } from 'react';
import NoSSR from 'react-no-ssr';

import Head from '../components/head.jsx';
import Footer from '../components/footer.jsx';
import UserTabs from '../components/user-tabs.jsx';
import Event from '../containers/event.jsx';

class AppLayout extends Component {
  render() {
    const {content} = this.props;

    return (
      <div>
        <Head />
		    <div className="container bg-white">
          {/*<UserTabs/>*/}
          <NoSSR>
            <Event />
          </NoSSR>
          <div className="content-wrapper clearfix">
		    		{content}
          </div>
		    </div>
        <Footer />
		  </div>
    )
  }
}

export default AppLayout;
