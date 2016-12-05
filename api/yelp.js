var Yelp = require('yelp');

var yelp = new Yelp({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	token: process.env.token,
	token_secret: process.env.token_secret
});

// var yelp = {
// 	search: function(searchTerm){
// 		console.log('hello');
// 	}
// }
module.exports = {
  search: function(filterSearch) {
  return yelp.search(filterSearch);
  }
};
