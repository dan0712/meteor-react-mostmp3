
import React from 'react';

// Inserts a Facebook like button
TwitterButton = React.createClass({
	render: function() {
		const iframeStyle = {
			position: 'static',
			visibility: 'visible',
			border: 'none',
			overflow: 'hidden',
			width: '62px',
			height: '20px'
		};

		return (
			<iframe 
			  id="twitter-widget-0" 
			  scrolling="no" frameborder="0" allowtransparency="true" 
			  class="twitter-share-button twitter-share-button-rendered twitter-tweet-button" 
			  title="Twitter Tweet Button" 
			  src="https://platform.twitter.com/widgets/tweet_button.baa54ded21a982344c4ced326592f3de.en.html#dnt=true&amp;id=twitter-widget-0&amp;lang=en&amp;original_referer=http%3A%2F%2Fmp3toget.net&amp;size=m&amp;text=Mp3ToGet%3A%20The%20easiest%20way%20to%20download%20your%20favorite%20Spotify%20tracks%2C%20playlists%2C%20artists%2C%20albums%20in%20mp3%20-%20http%3A%2F%2Fmp3toget.net&amp;time=1455212999405&amp;type=share&amp;url=mp3toget.net" 
			  style={iframeStyle} 
			  data-url="http://mp3toget.net">
			</iframe>
		);
	}
});

export default TwitterButton;