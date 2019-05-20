const express = require('express');
const config = require('../config.js');
let router = express.Router();


router.get('/login', function(req, res) {
	res.render("../views/login/login.ejs", {basePath: config.configApp.basePath});
});

router.post('/login', function(req, res) {
  console.log('path: ', req.path);
	req.session.password = req.body.password;
	if (req.body.password === config.configApp.password)
		res.redirect(config.configApp.basePath + "/addresses");
	else
		res.redirect(config.configApp.basePath + "/login");
});


router.get('/logout', function(req, res) {
  req.session = null;
  res.redirect(config.configApp.basePath + "/login");
})

module.exports = router;
