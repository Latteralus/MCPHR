const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for node modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: false,
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        vm: require.resolve('vm-browserify'),
        net: false,
        tls: false,
        child_process: false
      };
      
      return webpackConfig;
    },
  },
};