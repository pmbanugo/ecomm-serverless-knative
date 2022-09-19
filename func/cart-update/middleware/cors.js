const DEFAULT_ALLOW_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
];

const DEFAULT_ALLOW_HEADERS = [
  'X-Requested-With',
  'X-HTTP-Method-Override',
  'Access-Control-Allow-Origin',
  'Content-Type',
  'Authorization',
  'Accept',
];

const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

const cors =
  (options = {}) =>
  (handler) =>
  (req, res) => {
    const {
      origin = '*',
      maxAge = DEFAULT_MAX_AGE_SECONDS,
      allowMethods = DEFAULT_ALLOW_METHODS,
      allowHeaders = DEFAULT_ALLOW_HEADERS,
    } = options;

    if (res && res.finished) {
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);

    const preFlight = req.method === 'OPTIONS';
    if (preFlight) {
      res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));
      res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
      res.setHeader('Access-Control-Max-Age', String(maxAge));
    }

    return (function () {
      if (req.method === 'OPTIONS') {
        res.end();
        return;
      }
      //TODO: if req.method is not in the allowed methods, return error to the client
      return handler(req, res);
    })();
  };

module.exports = cors;
