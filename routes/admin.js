const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/dashboard', function showDashboard(request, response) {
  response.sendFile(path.join(__dirname, '..', 'views', 'admin', 'dashboard.html'));
});

module.exports = router;
