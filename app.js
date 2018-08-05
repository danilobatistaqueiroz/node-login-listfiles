const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const db = require('./db-module.js');

app = express();

app.use(cookieParser());
app.use(session({ secret: 'example' }));
app.use(bodyParser());
app.set('view engine', 'ejs');
app.use(express.static('public'));

let port = 3000;

db.connect()
    .then(() => console.log('database connected'))
    .then(() => bootApp())
    .catch((e) => {
        console.error(e);
        // Always hard exit on a database connection error
        //process.exit(1);
    });

function bootApp(){

  app.listen(port);

  console.log('List of files server started on: ' + port);

  require('./routes/routes.js')(app);
}

module.exports = app;