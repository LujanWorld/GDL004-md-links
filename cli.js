const mdLinks = require('./index.js');

const getOptions = () => {
  let input = {};

  let myArgs = [];
  if (process.argv[0].endsWith('node')) {
    myArgs = process.argv.slice(2);
  } else {
    myArgs = process.argv.slice(1);
  }

  myArgs.forEach(arg => {
    switch (arg) {
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
          input.path = arg;
        } else {
          console.error('ERROR: unknown arguemnt:', arg);
          process.exit(1);
        }
    }
  });

  if (!input.path) {
    console.error('ERROR: No path given');
    process.exit(1);
  }

  return input;
};

async function main() {
  const input = getOptions();
  let links;
  try {
    links = await mdLinks(input.path, { validate: input.validate });
    if (input.stats) {
      const seen = {};
      let successful = 0;

      links.forEach(link => {
        seen[link.href] = 'seen';

        if (input.validate && link.ok) {
          successful++;
        }
      });
      const unique = Object.keys(seen).length;
      const total = links.length;

      console.log('Total: ', total);
      console.log('Unique: ', unique);

      if (input.validate) {
        console.log('Broken: ', total - successful);
      }
    } else {
      links.forEach(link => {
        if (input.validate) {
          console.log(
            link.path,
            link.href,
            link.text,
            link.ok ? 'Ok' : 'Fail',
            link.status
          );
        } else {
          console.log(link.path, link.href, link.text);
        }
      });
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`ERROR: no such file or directory - ${input.path}`);
    } else {
      console.error('ERROR: unexpected error:', err);
    }
    process.exit(1);
  }
}

main();
