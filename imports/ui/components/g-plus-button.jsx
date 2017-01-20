import React from 'react';

// Inserts a Google plus one button
PlusOneButton = React.createClass({
	componentDidMount: function() {
		this.po = document.createElement('script');
		this.po.type = 'text/javascript';
		this.po.async = true;
		this.po.src = 'https://apis.google.com/js/platform.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(this.po, s);
	},

	componentWillUnmount: function() {
		this.po.parentNode.removeChild( this.po );
		this.po = null;
	},

	getDefaultProps: function() {
		return {
			size: 'medium',
			href: 'http://mostmp3.com'
		}
	},

	render: function() {
		return (
			<div className="g-plusone"
				data-size={ this.props.size }
				data-href={ this.props.href } ></div>
		);
	}
});

export default PlusOneButton;