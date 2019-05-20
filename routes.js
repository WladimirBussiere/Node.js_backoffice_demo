'use strict'

const express = require('express');
const config = require('./config.js');

let router = express.Router();



router.use('/webviews', require('./routes/webviews.routes.js'));
router.use('/addresses', require('./routes/addresses.routes.js'));
router.use('/notifications', require('./routes/notifications.routes.js'));

//login access
router.use(function (req, res, next) {
  console.log('path:', req.path)
  console.log("Current login: " + req.session.password);
  if (req.session.password === config.configApp.password || req.path === "/login")
    next();
  else
    res.redirect(config.configApp.basePath + "/login");
})


router.use('/', require('./routes/login.routes.js'));
router.use('/', function(req, res){
  res.redirect(config.configApp.basePath + '/addresses');
})


module.exports = router;
