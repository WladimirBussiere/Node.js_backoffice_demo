const express = require('express');
const config = require('../config.js');
let router = express.Router();
let notification = require('../controllers/NotificationsController.js');

//retrieve the id and call the function in NotificationsController.js with query object
router.get('/subscription', notification.getUserIdAndLink);

router.get('/redirecttogmaps', notification.redirectToGMaps);

router.use(function (req, res, next) {
  console.log('path:', req.path)
  console.log("Current login: " + req.session.password);
  if (req.session.password === config.configApp.password || req.path === config.configApp.basePath + "/login")
    next();
  else
    res.redirect(config.configApp.basePath + "/login");
})

//show "create a new notification" page
router.get('/', notification.create);

//create and send push notificaton in FR and ENG
router.post('/send', notification.uploadImageBuffer, notification.uploadImageOnFacebook, notification.createAndSendMessage);

module.exports = router;
