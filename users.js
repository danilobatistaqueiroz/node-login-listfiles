const fs = require('fs');
const db = require('./db-module.js');

exports.getCounter = (name) => {
	//var text = fs.readFileSync('./counter.txt');
  var conn = db.get();
  conn.collection('users').findOne(name).toArray((err, result) => {
    if (err) return console.log(err)
    //return result;
    console.log('total:' + result.counter);
    let counter = parseInt(result.counter)+1;
    return counter;
  });
}

exports.login = (identities, req, res) => {
	if (identities.username === 'superuser' && identities.password === 'abc') {
		console.log('identities.token:'+identities.token);
		console.log('Secrets.getHash:'+Secrets.getHashFromRandom(req.session.counter));
		if(identities.token==Secrets.getHashFromRandom(req.session.counter)){
			req.session.authenticated = true;
			fs.writeFileSync('./counter.txt', req.session.counter);
			res.redirect('/listof');
		} else {
			console.log('Invalid token');
			res.redirect('/login');
		}
	} else {
		console.log('Username and password are incorrect');
		res.redirect('/login');
	}
}

function users () { 
  this.db;
	return {
		connect: function() {
      const MongoClient = require('mongodb').MongoClient
      const urldb = 'mongodb://danilo:abc123@ds111138.mlab.com:11138/mylistof';
      MongoClient.connect(urldb, (err, client) => {
        if (err) {
          return console.log(err)
        }
        this.db = client.db('mylistof')
      })
		}
	}
	return {
		getCounter: function(name) {
      db.collection('users').findOne(name).toArray((err, result) => {
        if (err) return console.log(err)
        return result;
      })
		}
	}
	return {
		updateCounter: function(name, counter) {
      db.collection('users').update({name:name},{name:name,counter:counter},{upsert:true}).toArray((err, result) => {
        if (err) return console.log(err)
        return result;
      })
    }
	}
}
exports.users = users();
