const fs = require('fs');
const {promisify} = require('util');
const path = require('path');
const tachyonsGenerator = require('tachyons-generator');
const config = require('./config.json');

const writeFile = promisify(fs.writeFile);

async function generate() {
  const tachy = tachyonsGenerator(config);

  const out = await tachy.generate();

  const cwd = process.cwd();

  // console.log('Writing index.html');
  // await fs.writeFile(path.join(__dirname, 'build', 'index.html'), out.docs);
  // console.log('Writing tachyons.css');
  // await fs.writeFile(path.join(cwd, 'src', 'tachyons.css'), out.css);
  console.log('Writing tachyons.min.css');
  await writeFile(path.join(cwd, 'src', 'tachyons.min.css'), out.min);
}

Promise.resolve()
  .then(() => generate())
  .then(() => console.log('Done'));
