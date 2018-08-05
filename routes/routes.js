const fs = require('fs');
const controller = require('../controllers/controller.js');

module.exports = function (app) {
	
	app.get('/listof', controller.checkSignIn, controller.listof)

	app.get('/ebook', controller.ebook)

	app.get('/login', controller.login)

	app.post('/loginp', controller.loginp)

	app.get('/welcome', controller.welcome)

	app.get('/', controller.root)
		
	app.get('/logout', controller.logout)

}