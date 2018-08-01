var fs = require('fs');

module.exports = function (app) {
	
	app.get('/listof', checkSignIn, (req, res, next) => {
		var files = fs.readdirSync('./private/');
		res.render('index.ejs', {files : files});
	})

	app.get('/ebook', (req, res) => {
		binary = fs.readFileSync('./private/' + req.query.ebookname);
		res.attachment(req.query.ebookname);
		res.send(binary);
	})


	app.get('/login', function (req, res, next) {
		res.render('login');
	})

	app.post('/login', function (req, res, next) {
		console.log('logando');
		console.log('username:' + req.body.username);
		if (req.body.username && req.body.username === 'superuser' && req.body.password && req.body.password === 'abc1') {
			console.log('user logged in');
			req.session.authenticated = true;
			res.redirect('/listof');
		} else {
			console.log('Username and password are incorrect');
			res.redirect('/login');
		}

	})

	app.get('/welcome', function (req, res, next) {
		res.render('welcome', {authenticated : req.session.authenticated});
	})

	app.get('/', function(req, res){
		res.send("Welcome to list of ebooks!");
	})
		
	app.get('/logout', function (req, res) {
		req.session.authenticated = false;
		res.render('welcome', {authenticated : req.session.authenticated});
	})

	function checkSignIn(req, res, next){
	   if(req.session.authenticated){
		  next();
	   } else {
		  var err = new Error("Not logged in!");
		  console.log('error trying to access unauthorized page!');
		  res.render('welcome', {authenticated : req.session.authenticated});
	   }
	}

}