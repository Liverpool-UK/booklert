/**
 * Find a book in the Liverpool library catalogue
 * Written by Adrian McEwen <info@mcqn.com> @amcewen
 */

var url = require("url");
var request = require("request");
var cheerio = require('cheerio');

// Look up the book given by isbn in the Liverpool library catalogue.
// If the book is found, call success_callback with the URL to the
// book's page in the catalogue.  If it's not found, call the error_callback
function ISBNLibraryLookup(isbn, success_callback, error_callback) {
    var library_url = "http://capitadiscovery.co.uk/liverpool/items?query=";
    request(library_url+isbn, function(error, response, body) {
        //console.log(body);
    
        $ = cheerio.load(body);
        var r = $("#searchResults .item");
        //console.log(r);
        //console.log("Here? "+r.length);
        if (r.length) {
            var b = r.find("a[itemprop=name]");
            //console.log(b);
            //console.log("URL: "+b.length);
            //console.log(b.attr("href"));
            //console.log(url.resolve(library_url, b.attr("href")));
            success_callback(url.resolve(library_url, b.attr("href")));
        } else {
            if (error_callback != undefined) {
                error_callback(404);
            }
        }
    });
}


// Test...
ISBNLibraryLookup("111843062X", function(res) { console.log("DtIoT: "+res); }, function(res) { console.log("DtIoT not found"); });
ISBNLibraryLookup("9780586044568", function(res) { console.log("High Rise: "+res); }, function(res) { console.log("High Rise not found"); });
ISBNLibraryLookup("978111844154", function(res) { console.log("Startup Communities: "+res); }, function(res) { console.log("Startup Communities not found"); });

