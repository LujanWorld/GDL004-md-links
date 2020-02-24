const mdLinks = require('./index.js');
let input = {};
var myArgs = process.argv.slice(2); //remove 2 from the front

// console.log('myArgs: ', myArgs);

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
//console.log(input);

//Call the mdLinks
async function main() {
  let links;
  try {
    links = await mdLinks(input.path, { validate: input.validate });
    links.forEach(link => {
      if (input.validate) {
        console.log(
          link.path,
          link.href,
          link.text,
          link.ok ? 'Ok' : 'Fail', // alternative if
          link.status
        );
      } else {
        console.log(link.path, link.href, link.text);
      }

      // let successCounter = 0;
      // failCounter = 0;
      // var theFilter = link.filter(function(broken) {
      //   //This tests if student.grade is greater than or equal to 90. It returns the "student" object if this conditional is met.
      //   return broken.link === false;
      // });
    });
  } catch (err) {
    console.log(err);
  }
}

main();
// If you have stats = true

// Calculate stats.
