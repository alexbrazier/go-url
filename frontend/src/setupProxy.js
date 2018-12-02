const proxy = require('http-proxy-middleware');

const excludedTypes = ['.js', '.css', '.json', '.ico', '.map', 'png', 'svg'];
module.exports = function setupProxy(app) {
  app.use('/', (req, res, next) => {
    if (
      req.path.startsWith('/go') ||
      excludedTypes.some(type => req.path.endsWith(type))
    ) {
      return next();
    }
    return proxy({ target: 'http://localhost:1323' })(req, res, next);
  });
};
