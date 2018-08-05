const fs = require('fs');
const db = require('./db-module.js');

exports.getCounter = () => {
  db.get().collection('stats').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log('total:' + result[0].counter);
    let counter = parseInt(result[0].counter)+1;
    return counter;
  });
}