import React, { Component } from 'react';

class NavUserItem extends Component {
  render() {
    const {currentRoute} = this.props;
    return (
      <a className={currentRoute === this.props.href ? 'nav-tab nav-link nav-current-tab nav-user-tab' : 'nav-tab nav-link nav-user-tab'} href={this.props.href} rel={this.props.rel || null} target={this.props.target || null} >
        {this.props.name}
      </a>
    );
  }
};

export default NavUserItem;