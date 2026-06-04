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

function requireCustomer(request, response, next) {
  const user = request.session && request.session.user;

  if (!user || user.role !== 'customer') {
    response.redirect('/customer/login?message=session-expired');
    return;
  }

  next();
}

function redirectAuthenticatedCustomer(request, response, next) {
  const user = request.session && request.session.user;

  if (user && user.role === 'customer') {
    response.redirect('/customer/balance');
    return;
  }

  next();
}

module.exports = {
  requireAdmin,
  redirectAuthenticatedAdmin,
  requireCustomer,
  redirectAuthenticatedCustomer
};
