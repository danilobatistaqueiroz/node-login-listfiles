const fs = require('fs');
const CryptoJS = require('../public/crypto-js.js');
const Crypto = require('../public/crypto.js').Crypto;
const TokenHash = require('../system/token-hash.js');
const db = require('../system/db-module.js');
const util = require('util');

let crypto = new Crypto(CryptoJS, "segredo123", "segredo123");

module.exports = function (app) {
  
  app.get('/', (req, res, next) => {
    res.send("Welcome to list of ebooks!", {authenticated:req.session.authenticated, message:''});
  });
    
  app.get('/listof', checkSignIn, (req, res, next) => {
    let files = fs.readdirSync('./private/');
    db.get().collection('files').find().toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index.ejs', {authenticated:req.session.authenticated, files:result, counter:req.session.counter});
    });
  });
  
  app.delete('/ebooks/:id', checkSignIn, 
  (req, res, next) => {
    console.log('delete executado '+req.params.id);
    res.send('{"id":"'+req.params.id+'"}');
  });
  
  app.get('/ebooks', checkSignIn, 
  (req, res, next) => {
    let files = fs.readdirSync('./private/');
    db.get().collection('files').find().toArray((err, result) => {
      if (err) return console.log(err);
      result.forEach(decriptar);
      res.render('list-ebooks.ejs', {authenticated:req.session.authenticated, files:result, counter:req.session.counter});
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
    res.render('welcome', {authenticated:req.session.authenticated, values:global.counter, message:''});
  });

  function checkSignIn (req, res, next) {
    if(req.session.authenticated){
      next();
    } else {
      let err = new Error("Not logged in!");
      console.log('error trying to access unauthorized page!');
      res.render('welcome', {authenticated:req.session.authenticated, values:global.counter, message: 'you need to be logged'});
    }
  }
  
  function decriptar(item){
      try{
        let description = item.encDescription;
        let plaintext = crypto.decryptByDESModeCBC(description, "segredo123");
        if(plaintext!='')
          item.originalDescription = plaintext;
      } catch (e) {
        console.log(e);
      }
    }
}