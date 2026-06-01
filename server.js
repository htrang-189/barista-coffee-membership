const config = require('./config');
const express = require('express');
const path = require('path');

const adminRoutes = require('./routes/admin');

const app = express();
const port = config.port;
const host = config.host;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function handleRootRequest(request, response) {
  response.redirect('/admin/dashboard');
});

app.use('/admin', adminRoutes);

app.use(function handleNotFound(request, response) {
  response.status(404).sendFile(path.join(__dirname, 'views', 'shared', '404.html'));
});

app.use(function handleError(error, request, response, next) {
  console.error('Unhandled application error:', error);
  response.status(500).sendFile(path.join(__dirname, 'views', 'shared', 'error.html'));
});

app.listen(port, host, function logStartup() {
  console.log(`Barista Coffee Membership app is running on http://${host}:${port}`);
});
