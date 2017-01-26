import React from 'react';

const AppAbout = () => (
  <div>
    <h1>About Mostmp3 - Spotify MP3 Downloader</h1>
		<section>
			<h4>
			  <label>
				  Why we build this service?
			  </label>
			</h4>
			<p>
				The primary motivation behind Mostmp3 was our friend, trying to make an audio CD to listen to music in his car, having difficulties to access encoded files. Therefore, we figured we can search for Spotify tracks on various music storing site and return direct links to mp3 files.
			</p>
			<p>
				To our surprise it worked so well that we made Mostmp3 into this website.
			</p>
		</section>
		<section>
			<h4>
			  <label>
				  How can I contact you?
			  </label>
			</h4>
			<p>
				Please send us feedback or report any problems with a site to our email <a href="mailto:mp3toget@gmail.com?subject=Inquiry from your website&body=Hello Mostmp3,">mp3toget@gmail.com</a>
			</p>
		</section>
		<section>
			<h4>
			  <label>
				  Media materials
			  </label>
			</h4>
			<p>
				You can download our logo in <a href="/spotifytube-min.png">PNG</a> or see a write up on <a href="https://www.reddit.com/r/lifehack/comments/42uz5s/my_friend_has_a_spotify_premium_account_and/">reddit</a> or How to tutorial on <a href="https://www.youtube.com/watch?v=asNEyzLPj9c">Youtube</a>.
			</p>
		</section>
		<section>
			<h4>
			  <label>
				  Terms of service
				</label>
			</h4>
			<p>
				By using Mostmp3, you agree to our <a href="/legal">terms of service</a>
			</p>
			<p>
				We urge all copyright owners, to recognize that links contained within this site are located somewhere else on the web. The download button points to the location of the mp3 file on the web. Please direct all copyright infringement issues to the companies that host these files (Musica-Libera.lol, Youtube.com, Youtubeinmp3.com, etc.).
			</p>
		</section>
  </div>
);

export default AppAbout;
