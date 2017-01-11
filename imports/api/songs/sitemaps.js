import { Meteor } from 'meteor/meteor';
import { sitemaps } from 'meteor/gadicohen:sitemaps';

import { Searches } from '../searches/searches.js';

/*if (process.env.NODE_ENV != "development") {
  Meteor.startup(function() {
    Meteor.setTimeout( function() {
      initializeSearchesSitemaps();
    }, 5000);
  });
}*/

Meteor.methods({
  generateSitemaps: function() {
    initializeSearchesSitemaps();
  }
});

function initializeSearchesSitemaps() {
  const pages = Searches.aggregate([
    { "$match": {
        "dmca": {$exists: false}
      }
    },
    {
      "$group": {
        "_id": "$slug",
        "date": {$first: "$date"},
      }
    },
    {
      "$sort" : { 
        "publishedAt" : -1 
      }
    }
  ])

  pages.chunkIntoSitemaps();
}

Array.prototype.chunkIntoSitemaps = function(){
    let sets = [], chunks, i = 0, groupsize = 49999;
    chunks = this.length / groupsize;
    console.log(chunks);

    while(i < chunks){
      sets[i] = this.splice(0,groupsize);
      createSitemapSearches(i, sets[i]);
      i++;
    }

    return true;
};

function createSitemapSearches(index, pages) {
  console.log(index);
  sitemaps.add('/'+ index + '-items.xml', function() {
    let out = [];
    _.each(pages, function(page) {
      out.push({
        page: 'download/'+page._id,
        changefreq: 'always',
      });
    });
    return out;
  });
}