/* eslint-disable no-param-reassign */

module.exports = {
  webpack: config => {
    config.entry.main = ['./src/server.js'];
    return config;
  },
};
