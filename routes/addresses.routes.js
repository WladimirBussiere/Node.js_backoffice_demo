const express = require('express');
const config = require('../config.js');
const address = require("../controllers/AddressesController.js");
let router = express.Router();


router.get('/api', address.listJson);

router.get('/api/sort', address.listJsonByCat);

router.use(function (req, res, next) {
  console.log('path:', req.path)
  console.log("Current login: " + req.session.password);
  if (req.session.password === config.configApp.password || req.path === "/login")
    next();
  else
    res.redirect(config.configApp.basePath + "/login");
})

// Get all addresses
router.get('/', address.list);

// Get single addresses by id
router.get('/show/:id', address.show);

// Show "create address" page
router.get('/create', address.create);

// Save address >>> .save is called only if .imageUpload is successful
router.post('/save', address.imageUpload, address.save);

// show "edit address" page
router.get('/edit/:id', address.edit);

// Edit address
router.post('/update/:id', address.imageUpload, address.update);

// Delete address
router.post('/delete/:id', address.delete);




module.exports = router;
