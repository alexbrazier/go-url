const { createProxyMiddleware } = require('http-proxy-middleware');

const excludedTypes = ['.js', '.css', '.json', '.ico', '.map', 'png', 'svg'];
const filter = pathname =>
  !pathname.startsWith('/go') &&
  !excludedTypes.some(type => pathname.endsWith(type));

module.exports = function setupProxy(app) {
  app.use(
    '/',
    createProxyMiddleware(filter, {
      target: 'http://localhost:1323',
    }),
  );
};
