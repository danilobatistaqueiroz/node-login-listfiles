const fs = require('fs');
const users = require('../users.js');
const stats = require('../stats.js');

exports.root = (req, res) => {
	res.send("Welcome to list of ebooks!");
}
	
exports.listof = (req, res, next) => {
	var files = fs.readdirSync('./private/');
	res.render('index.ejs', {authenticated:req.session.authenticated, files:files, counter:req.session.counter});
};

exports.ebook = (req, res) => {
	binary = fs.readFileSync('./private/' + req.query.ebookname);
	res.attachment(req.query.ebookname);
	res.send(binary);
}

exports.login = (req, res, next) => {
	var counter = users.getCounter();
	res.render('login',{authenticated:req.session.authenticated, values:counter});
}

exports.loginp = (req, res, next) => {
	var identities = { username: '', password: '', token: '' };
	identities.username = req.body.username;
	identities.password = req.body.password;
	identities.token = req.body.token;
	console.log('token:'+req.body.token);
	const CryptoJS = require('./public/crypto-js.js');
	const Crypto = require('./public/crypto.js').Crypto;
	const tokenHash = require('./token-hash.js');
	
	req.session.counter = users.getCounter();
	console.log(req.session.counter);
	
	var Secrets = new tokenHash();
	var crypto = new Crypto(CryptoJS, Secrets.getSecret(), Secrets.getSecret());
	crypto.decrypt(identities);

  users.login(identities, req, res);
}

exports.welcome = (req, res, next) => {
  
	var counter = stats.getCounter();
	res.render('welcome', {authenticated:req.session.authenticated, values:counter});
}

exports.logout = (req, res) => {
	req.session.authenticated = false;
	var counter = users.getCounter();
	res.render('welcome', {authenticated:req.session.authenticated, values:counter});
}

exports.checkSignIn = (req, res, next) => {
	if(req.session.authenticated){
		next();
	} else {
		var err = new Error("Not logged in!");
		console.log('error trying to access unauthorized page!');
		var counter = users.getCounter();
		res.render('welcome', {authenticated:req.session.authenticated, values:counter});
	}
}