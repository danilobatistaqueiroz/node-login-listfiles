const fs = require('fs');
const CryptoJS = require('../public/crypto-js.js');
const Crypto = require('../public/crypto.js').Crypto;
const TokenHash = require('../system/token-hash.js');
const db = require('../system/db-module.js');

module.exports = function (app) {
    
  app.get('/', (req, res, next) => {
    res.send("Welcome to list of ebooks!");
  });
    
  app.get('/listof', (req, res, next) => {
    var files = fs.readdirSync('./private/');
    db.get().collection('files').find().toArray((err, result) => {
      if (err) return console.log(err);
      let i;
      var crypto = new Crypto(CryptoJS, "segredo123", "segredo123");
      for(i = 0; i < result.length; i++) {
     		let plaintext = crypto.decryptByDESModeCBC(result[i].description, "segredo123");
        result[i].description = plaintext;
      }
      res.render('index.ejs', {authenticated:req.session.authenticated, files:result, counter:req.session.counter});
    });
  });

  app.get('/ebook', (req, res, next) => {
    db.get().collection('files').findOne({facadeName:req.query.ebookname},{originalName:1}, (err, result) => {
      binary = fs.readFileSync('./private/' + result.originalName);
      res.attachment(result.originalName);
      res.send(binary);
    });
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