const path = require('path');

module.exports = {
  // ... your existing config
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
};
