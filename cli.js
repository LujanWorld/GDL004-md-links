const mdLinks = require('./index.js');
let input = {};
var myArgs = process.argv.slice(2); //remove 2 from the front

console.log('myArgs: ', myArgs);

myArgs.forEach(function(name) {
  switch (name) {
    case '--stats':
    case '-s':
      input.stats = true;
      break;
    case '--validate':
    case '-v':
      input.validate = true;
      break;
    default:
      if (!input.path) {
        input.path = name;
      } else {
        console.error('Unknown arguemnt', name);
        process.exit(1);
      }
  }
});
// Options
console.log(input);
// Call the mdLinks.

// If you have stats = true

// Calculate stats.
