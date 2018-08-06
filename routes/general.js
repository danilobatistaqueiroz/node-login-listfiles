const fs = require('fs');
const CryptoJS = require('../public/crypto-js.js');
const Crypto = require('../public/crypto.js').Crypto;
const TokenHash = require('../system/token-hash.js');

module.exports = function (app) {
    
  app.get('/', (req, res, next) => {
    res.send("Welcome to list of ebooks!");
  });
    
  app.get('/listof', (req, res, next) => {
    var files = fs.readdirSync('./private/');
    res.render('index.ejs', {authenticated:req.session.authenticated, files:files, counter:req.session.counter});
  });

  app.get('/ebook', (req, res, next) => {
    binary = fs.readFileSync('./private/' + req.query.ebookname);
    res.attachment(req.query.ebookname);
    res.send(binary);
  });

  app.get('/welcome', (req, res, next) => {
    res.render('welcome', {authenticated:req.session.authenticated, values:global.counter});
  });

  function checkSignIn (req, res, next) {
    if(req.session.authenticated){
      next();
    } else {
      var err = new Error("Not logged in!");
      console.log('error trying to access unauthorized page!');
      res.render('welcome', {authenticated:req.session.authenticated, values:global.counter});
    }
  }

}