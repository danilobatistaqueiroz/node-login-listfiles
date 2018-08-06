const MongoClient = require('mongodb').MongoClient

let connection = null;
let url = 'mongodb://danilo:abc123@ds111138.mlab.com:11138/mylistof';

module.exports.connect = () => new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, client) {
        if (err) { reject(err); return; };
        resolve(client);
        connection = client.db('mylistof');
        console.log('connected!');
    });
});

module.exports.get = () => {
    if(!connection) {
        throw new Error('Call connect first!');
    }

    return connection;
}