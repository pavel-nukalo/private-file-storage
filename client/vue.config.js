process.env.NODE_CONFIG_DIR = '../config';
const config = require('config');

const proxy = {
  target: `http://${config.get('http.hostname')}:${config.get('http.port')}`,
  secure: false
};

module.exports = {
  publicPath: './',

  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Private File Storage',
    }
  },

  devServer: {
    proxy: {
      '/signin*': proxy,
      '/signup': proxy,
      '/file/*': proxy,
      '/info': proxy,
      '/logout': proxy
    }
  }
};