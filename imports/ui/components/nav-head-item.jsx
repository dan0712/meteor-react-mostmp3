import React, { Component } from 'react';

class NavHeadItem extends Component {
  render() {
    const {currentRoute} = this.props;
    return (
      <a className={currentRoute === this.props.href ? 'nav-tab nav-link nav-head-tab nav-current-tab' : 'nav-tab nav-link nav-head-tab'} href={this.props.href}>
        {this.props.name}
      </a>
    );
  }
};

export default NavHeadItem;