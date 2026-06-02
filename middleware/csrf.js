const crypto = require('crypto');

function ensureCsrfToken(request, response, next) {
  if (!request.session.csrfToken) {
    request.session.csrfToken = crypto.randomBytes(24).toString('hex');
  }

  response.locals.csrfToken = request.session.csrfToken;
  next();
}

function requireCsrfToken(request, response, next) {
  const submittedToken = request.body && request.body.csrfToken;

  if (!request.session.csrfToken || submittedToken !== request.session.csrfToken) {
    response.status(403).send('Invalid form token. Please go back and try again.');
    return;
  }

  next();
}

module.exports = {
  ensureCsrfToken,
  requireCsrfToken
};
