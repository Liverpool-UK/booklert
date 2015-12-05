/**
 * @file amazon.js
 * @author b.lempereur@outlook.com <Brett Lempereur>
 *
 * Get the contents of Amazon Wishlists and find out which of them are
 * actualy books.
 */

var async = require('async');
var AWL = require('amazon-wish-list');
var isbn = require('node-isbn');

// Create an Amazon Wishlist client.
var client = new AWL();

/**
 * Attempt to resolve an ISBN identifier.
 */
function resolve(identifier, callback) {
  isbn.resolve(identifier, function(err, book) {
    if (err) {
      if (err.message.startsWith("no books found with isbn:")) {
        callback(null, null);
      } else {
        callback(err, null);
      }
    } else {
      callback(null, book);
    }
  });
}

/**
 * Get the list of books contained within an Amazon Wishlist.
 */
function getBooks(identifier, callback) {
  client.getById(identifier).then(function(wishlist) {
    var ids = wishlist.items.map(function(i) { return i.id; });
    async.map(ids, resolve, function (err, results) {
      var books = results.filter(function (i) { return i != null; });
      callback(err, books);
    });
  })
  .catch(function(reason) {
    callback(new Error("Could not get wishlist: " + reason), null);
  });
}

/**
 * Get the best ISBN number available for a book.
 */
function getIsbn(book) {
  var ids = book.industryIdentifiers;

  var isbn13 = ids.find(function (id) { return id.type == 'ISBN_13'; });
  if (isbn13 !== undefined) {
    return isbn13.identifier;
  }
  var isbn10 = ids.find(function (id) { return id.type == 'ISBN_10'; });
  if (isbn10 !== undefined) {
    return isbn10.identifier;
  }
  return undefined;
}

module.exports = {
  getBooks: getBooks,
  getIsbn: getIsbn
}
