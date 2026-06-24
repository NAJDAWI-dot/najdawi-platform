const { composePlugins, withNx } = require('@nx/webpack');

module.exports = composePlugins(withNx(), (config) => {
  const originalExternals = Array.isArray(config.externals) ? config.externals[0] : config.externals;
  
  config.externals = [
    function (ctx, callback) {
      if (ctx.request && ctx.request.startsWith('@mos/shared')) {
        // Do not call the original externals, meaning it won't be externalized
        return callback();
      }
      if (typeof originalExternals === 'function') {
        return originalExternals(ctx, callback);
      }
      return callback();
    }
  ];
  return config;
});
