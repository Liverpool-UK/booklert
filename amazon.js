/**
 * @file amazon.js
 * @author b.lempereur@outlook.com <Brett Lempereur>
 *
 *
 */

var async = require('async');
var AWL = require('amazon-wish-list');
var isbn = require('node-isbn');

//
var client = new AWL();

// Resolve an ASN to an ISBN (if available).
function resolve(identifier, callback) {
  isbn.resolve(identifier, function(err, book) {
    if (err) {
      callback(null, null); // FIXME: HANDLE UNEXPECTED ERRORS.
    } else {
      callback(null, book);
    }
  });
}

//
function getBooks(identifier, callback) {
  client.getById(identifier).then(function(wishlist) {
    var ids = wishlist.items.map(function(i) { return i.id; });
    async.map(ids, resolve, function (err, results) {
      var books = results.filter(function (i) { return i != null; });
      callback(err, books);
    });
  })
  .catch(function(reason) {
    console.log("Could not get wishlist: ", reason); // FIXME: FAIL PROPERLY.
  });
}

//
function getIsbns(books) {
  return books.map(function(b) {
    return b.industryIdentifiers[0] // FIXME: SEARCH BY ID.
  });
}

module.exports = {
  getBooks: getBooks,
  getIsbns: getIsbns
}