function requireAdmin(request, response, next) {
  const user = request.session && request.session.user;

  if (!user || user.role !== 'admin') {
    response.redirect('/admin/login?message=session-expired');
    return;
  }

  next();
}

function redirectAuthenticatedAdmin(request, response, next) {
  const user = request.session && request.session.user;

  if (user && user.role === 'admin') {
    response.redirect('/admin/dashboard');
    return;
  }

  next();
}

module.exports = {
  requireAdmin,
  redirectAuthenticatedAdmin
};
