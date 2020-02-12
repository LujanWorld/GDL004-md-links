const fs = require('fs');

//
const linkRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

// Write a function which takes argument path to markdown file and returns all the links that file.
//reading a file
function getLinks(path) {
  fs.readFile(path, 'utf8', function(err, contents) {
    console.log(contents);
    let results = [];
    while (true) {
      let re = linkRegex.exec(contents);
      if (re === null) {
        break;
      }
      results.push(re[0]);
    }
  });

  console.log('after calling readFile');
  let links = [];
  console.log(links);
  return links;
}

let links = getLinks('test/data/simple.md');
