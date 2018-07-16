
const data = require('./utils/data');

const command = (process.argv.length > 2) ? process.argv[2] : null;
const force = (command && command.toLowerCase() === 'force');

data.reset(force).then(
  () => {
    process.exit(0);
  },
  (err) => {
    console.error('Something went wrong :(', err);
    process.exit(-1);
  }
);
