const fs = require('fs');
const glob = require('glob');
const path = require('path');

const linkRegex = /\[(.*?)\]\((.*?)\)/gm;

// Write a function which takes argument path to markdown file and returns all the links that file.
function getLinks(mdPath, options) {
  const p = new Promise((resolve, reject) => {
    fs.lstat(mdPath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      if (stats.isDirectory()) {
        glob('**/*.md', { cwd: mdPath }, (err, files) => {
          if (err) {
            reject(err);
            return;
          }
          files = files.map(file => {
            // file = path + "/" + file
            return path.join(mdPath, file);
          });

          // Return results of glob.
          resolve(files);
        });
      } else {
        // Return array of just this 1 file.
        resolve([mdPath]);
      }
    });
  }).then(mdFiles => {
    const promises = mdFiles.map(file => {
      const prom = new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', function(err, contents) {
          if (err) {
            reject(err);
            return;
          }
          let results = [];
          while ((result = linkRegex.exec(contents)) !== null) {
            let obj = {
              href: result[2],
              text: result[1],
              path: file
            };
            if (options.validate) {
              // Request.
              let resp;
              /// status give you the status of the answer
              obj.status = resp.status;
              obj.ok = resp.status >= 200 && resp.status < 400;
            }
            results.push(obj);
          }
          resolve(results);
        });
      });
      return prom;
    });

    return Promise.all(promises).then(results => {
      return results.flat();
    });
  });

  return p;
}

getLinks('test', { validate: true }).then(links => {
  console.log(links);
});
