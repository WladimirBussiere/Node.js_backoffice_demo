const express = require('express');
let address = require("../controllers/AddressesController.js");
let router = express.Router();

//show a webview
router.get('/index/:id/:lang', address.showWebview);


module.exports = router;
