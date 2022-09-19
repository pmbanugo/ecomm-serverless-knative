module.exports = (next) => (req, res) => {
  return (function () {
    if (req.url === '/health/liveness') {
      return 'OK';
    }

    return next(req, res);
  })();
};
