const fs = require('fs');

function startPlugins() {
  const plugins = JSON.parse(fs.readFileSync('./plugins.json', 'utf8'));
  plugins.plugins.forEach((file) => {
    if (plugins.plugins.includes(file) &&
      fs.lstatSync(`./plugins/${file}`).isDirectory() &&
      fs.existsSync(`./plugins/${file}/index.js`)) {
      const { start } = require(`../plugins/${file}/index.js`); // eslint-disable-line global-require, import/no-dynamic-require
      start();
    }
  });
}

function stopPlugins() {
  const plugins = JSON.parse(fs.readFileSync('./plugins.json', 'utf8'));
  const files = fs.readdirSync('./plugins/');
  files.forEach((file) => {
    if (plugins.plugins.includes(file) &&
      fs.lstatSync(`./plugins/${file}`).isDirectory() &&
      fs.existsSync(`./plugins/${file}/index.js`)) {
      const { stop } = require(`../plugins/${file}/index.js`); // eslint-disable-line global-require, import/no-dynamic-require
      stop();
    }
  });
}

module.exports.startPlugins = startPlugins;
module.exports.stopPlugins = stopPlugins;
