const fs = require('fs');
const db = require('../system/db-module.js');
const CryptoJS = require('../public/crypto-js.js');
const Crypto = require('../public/crypto.js').Crypto;
const TokenHash = require('../system/token-hash.js');

var identities = { username: '', password: '', token: '' };
const tokenHash = new TokenHash();

module.exports = function (app) {
  
  app.post('/login', (req, res, next) => {
    identities.username = req.body.username;
    identities.password = req.body.password;
    identities.token = req.body.token;
    var crypto = new Crypto(CryptoJS, tokenHash.getSecret(), tokenHash.getSecret());
    crypto.decrypt(identities);
    searchUser(req, res);
  });

  app.get('/login', (req, res, next) => {
    res.render('login',{authenticated:req.session.authenticated, values:global.counter});
  });

  app.get('/logout', (req, res, next) => {
    req.session.authenticated = false;
    res.render('welcome', {authenticated:req.session.authenticated, values:global.counter});
  });

}

function searchUser(req, res){
  db.get().collection('users').find(identities.username).toArray((err, result) => {
    if (err) return console.log(err);
    if (identities.username === 'superuser' && identities.password === 'abc') {
      userAuthenticated(result[0].counter, req, res);
    } else {
      console.log('Username and password are incorrect');
      res.redirect('/login');
    }
  });
}

function userAuthenticated(counter, req, res){
  req.session.counter = parseInt(counter);
  let hash = tokenHash.getHashFromRandom(req.session.counter);
  if(identities.token==hash){
    global.counter++;
    req.session.counter++;
    req.session.authenticated = true;
    fs.writeFileSync('./counter.txt', req.session.counter);
    res.redirect('/listof');
  } else {
    console.log('Invalid token');
    res.redirect('/login');
  }
}