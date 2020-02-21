const fs = require('fs');
const glob = require('glob');
const path = require('path');
const axios = require('axios');

const linkRegex = /\[(.*?)\]\((.*?)\)/gm;

// Write a function which takes argument path & options to markdown file and returns all the links that file.
const mdLinks = (mdPath, options) => {
  const p = new Promise((resolve, reject) => {
    // return object provides information about a file.
    fs.lstat(mdPath, (err, stats) => {
      //callback
      if (err) {
        reject(err);
        return;
      }
      //if path is directory is going to use glob.
      if (stats.isDirectory()) {
        // getting directory
        glob('**/*.md', { cwd: mdPath }, (err, files) => {
          //way to find files md extension
          if (err) {
            reject(err);
            return;
          }
          files = files.map(file => {
            // file = path + "/" + file
            return path.join(mdPath, file); // add name to path
          });

          // Return results of glob.
          resolve(files);
        });
      } else {
        // Return array of just this 1 file.ex: ["some/file/location/text.md"]
        resolve([mdPath]);
      }
    });
    // read each file the you got up
  }).then(mdFiles => {
    const promises = mdFiles.map(file => {
      const prom = new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, contents) => {
          if (err) {
            reject(err);
            return;
          }
          let results = [];
          ///  while the result is null stop the search
          while ((result = linkRegex.exec(contents)) !== null) {
            let obj = {
              href: result[2],
              text: result[1],
              path: file
            };

            results.push(obj);
          }
          if (options.validate) {
            const valProms = results.map(obj => {
              // Promise based HTTP client for the browser and node.js
              return axios
                .head(obj.href) //link
                .then(resp => {
                  obj.ok = resp.status >= 200 && resp.status < 400;
                  obj.status = resp.status;
                  return obj;
                })
                .catch(err => {
                  obj.ok = false;
                  let status = 'No status';
                  if (err.response) {
                    status = err.response.status;
                  } else if (err.code) {
                    status = err.code;
                  }
                  obj.status = status;
                  // obj.err = err;
                  return obj;
                });
            });
            // when all the validation is done, do the resolve
            Promise.all(valProms)
              .then(validatedResults => {
                resolve(validatedResults);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            resolve(results);
          }
        });
      });
      return prom;
    });

    return Promise.all(promises).then(results => {
      return results.flat(); //remove 1 array
    });
  });

  return p;
};

module.exports = mdLinks;
