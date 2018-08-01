var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.listen(port);

app.use(cookieParser());
app.use(session({ secret: 'example' }));
app.use(bodyParser());
app.set('view engine', 'ejs');

	
console.log('List of files server started on: ' + port);

require('./routes.js')(app);
