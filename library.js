/**
 * Find a book in the Liverpool library catalogue
 * Written by Adrian McEwen <info@mcqn.com> @amcewen
 */

var url = require("url");
var request = require("request");
var cheerio = require('cheerio');

var LIBRARY_URL = "http://capitadiscovery.co.uk/liverpool/items?query=";

// Look up the book given by isbn in the Liverpool library catalogue.
// If the book is found, call success_callback with the URL to the
// book's page in the catalogue.  If it's not found, call the error_callback
function lookup(isbn, callback) {
  request(LIBRARY_URL + isbn, function(err, response, body) {
    if (err) {
      callback(err, undefined);
      return;
    }

    $ = cheerio.load(body);
    var r = $("#searchResults .item");
    if (r.length) {
      var b = r.find("a[itemprop=name]");
      callback(null, url.resolve(LIBRARY_URL, b.attr("href")));
    } else {
      callback(null, undefined);
    }
  });
}

module.exports = {
  lookup: lookup
}
