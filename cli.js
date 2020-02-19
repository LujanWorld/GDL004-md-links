const mdLinks = require('./index.js');

mdLinks('test', { validate: true }).then(links => {
  console.log(links);
});
