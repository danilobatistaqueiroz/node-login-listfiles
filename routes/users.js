const fs = require('fs');
const db = require('../system/db-module.js');
const tokenHash = require('../system/token-hash.js');

var identities = { username: '', password: '', token: '' };

module.exports = function (app) {
  
  app.post('/login', (identities, req, res) => {
    identities.username = req.body.username;
    identities.password = req.body.password;
    identities.token = req.body.token;
    console.log('token:'+req.body.token);	
    var tokenHash = new TokenHash();
    var crypto = new Crypto(CryptoJS, tokenHash.getSecret(), tokenHash.getSecret());
    crypto.decrypt(identities);
    searchUser();
  });

  app.get('/login', (req, res, next) => {
    res.render('login',{authenticated:req.session.authenticated, values:global.counter});
  });

  app.get('/logout', (req, res) => {
    req.session.authenticated = false;
    res.render('welcome', {authenticated:req.session.authenticated, values:global.counter});
  });

}

function searchUser(){
  db.get().collection('users').find(identities.username).toArray((err, result) => {
    if (err) return console.log(err);
    if (identities.username === 'superuser' && identities.password === 'abc') {
      userAuthenticated(result[0].counter);
    } else {
      console.log('Username and password are incorrect');
      res.redirect('/login');
    }
  });
}

function userAuthenticated(counter){
  req.session.counter = parseInt(counter);
  console.log('identities.token:'+identities.token);
  console.log('Secrets.getHash:'+tokenHash.getHashFromRandom(req.session.counter));
  if(identities.token==tokenHash.getHashFromRandom(req.session.counter)){
    global.counter++;
    console.log('counter:'+global.counter);
    req.session.counter++;
    req.session.authenticated = true;
    fs.writeFileSync('./counter.txt', req.session.counter);
    res.redirect('/listof');
  } else {
    console.log('Invalid token');
    res.redirect('/login');
  }
}