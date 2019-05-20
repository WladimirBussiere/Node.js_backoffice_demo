'use strict'

const cookieSession = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const config = require('./config.js');



let mongoose = require('./controllers/db_connect.js')
let urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();

//to use session
app.use(cookieSession({
  name: 'session',
  secret: 'YOUR_SECRET',
  maxAge: 24 * 60 * 60 *1000
}))

app.use('/', express.static(__dirname + '/public'));

app.use(urlencodedParser);
app.set('view engine', 'ejs');
app.use('/', require('./routes.js'));


app.listen(3900, function(){
  console.log('I\'m listening on 3900 !')
});
