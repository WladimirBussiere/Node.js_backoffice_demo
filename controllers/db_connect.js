'use strict'

let mongoose = require('mongoose');
let addresModel = require('../models/address.model.js');

let mongoDB = 'mongodb://127.0.0.1/db_test_address';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'There is a MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to db!')
});
