cleanAndSlugifyQuery = (query) => {
  return slugify( query.replace(/[`~!@#%*$()^&_|+=;:",.<>\{\}\[\]\\\/]/gi, '-') ).replace(/-$/, '');
}

getYoutubeMp3 = (videoId) => {
  if (videoId == '34Na4j8AVgA') {
    window.open('http://embed.yt-mp3.com/watch?v='+videoId);
  } else {
    $.ajax({
      type: 'GET',
      url: 'http://www.youtubeinmp3.com/fetch/?format=JSON&video=https://www.youtube.com/watch?v='+videoId,
      dataType: 'json',
      success: function(data) {
        openLink(data.link);
      },
      error: function() {
        const url = 'http://www.youtubeinmp3.com/download/?video=https://www.youtube.com/watch?v='+videoId;
        openLink(url);
      }
    });
  }
}

openLink = (link) => {
  const url = document.createElement('a');
  // Add each direct video link to a clickable link
  url.setAttribute('href', link);
  // click
  const clickEvent = document.createEvent("MouseEvent");
  clickEvent.initEvent("click", true, true);

  url.dispatchEvent(clickEvent);
}