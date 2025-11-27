const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, options) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // ...other existing Next.js config...
};
