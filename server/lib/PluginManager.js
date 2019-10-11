const fs = require('fs');

function startPlugins() {
  const plugins = JSON.parse(fs.readFileSync('./plugins/plugins.json', 'utf8'));
  plugins.plugins.forEach((file) => {
    if (plugins.plugins.includes(file) &&
      fs.lstatSync(`./plugins/${file}`).isDirectory() &&
      fs.existsSync(`./plugins/${file}/index.js`)) {
      const { start } = require(`../plugins/${file}/index.js`);
      start();
    }
  });
}

function stopPlugins() {
  const plugins = JSON.parse(fs.readFileSync('./plugins/plugins.json', 'utf8'));
  const files = fs.readdirSync('./plugins/');
  files.forEach((file) => {
    if (plugins.plugins.includes(file) &&
      fs.lstatSync(`./plugins/${file}`).isDirectory() &&
      fs.existsSync(`./plugins/${file}/index.js`)) {
      const { stop } = require(`../plugins/${file}/index.js`);
      stop();
    }
  });
}

module.exports.startPlugins = startPlugins;
module.exports.stopPlugins = stopPlugins;
