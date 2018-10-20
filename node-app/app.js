const express = require("express");
const logger = require("morgan");
const bodyparser = require("body-parser");

//Setup Express App
const app = express();

//log Requests to the console
app.use(logger('dev'));

//Parsing incoming request data
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//route folder import before app.get
require('./server/routes')(app);

//default page
app.get('*', (req, res) => res.status(200).send({
  message: 'API NOT FOUND !!! Buddy',
}));

module.exports = app;