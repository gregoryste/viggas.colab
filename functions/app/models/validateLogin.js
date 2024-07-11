// Middleware function to verify authentication
function authMiddleware(req, res, next) {
  const { originalUrl } = req;

  if (req.cookies.__session) {
    next();
  } else {
    res.redirect(`/login?redirect=${encodeURIComponent(originalUrl)}`);
  }
}

module.exports = authMiddleware