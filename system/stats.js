const fs = require('fs');
const db = require('./db-module.js');

exports.globalCounter = () => {
  db.get().collection('stats').find().toArray((err, result) => {
    if (err) return console.log(err);
    global.counter = parseInt(result[0].counter);
  });
}