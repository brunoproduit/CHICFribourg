const pool = require('./postgreSQL');
const uuidV4 = require('uuid/v4');
var bodyParser = require('body-parser');
const SELECT = "SELECT uuid, name, isParent, peggyUuid FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT * FROM users WHERE peggyuuid = $1 ORDER BY uuid";
const INSERT = 'INSERT INTO users(uuid, name, password, isParent, lastchanged, lastrequest, peggyUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM users WHERE uuid = $1';
const UPDATE = 'UPDATE users SET name = $2, password = $3, isParent = $4, lastchanged = $5 WHERE uuid = $1';

module.exports.getUser = function getUser(uuid, callback) {
    pool.query(SELECT, [uuid], function(err, res) {
        var results = [];
        if (err) {
            return console.error('error running query', err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        callback(results.pop());
        return;
    });
};

module.exports.getAllUsers = function getAllUsers(peggyuuid, callback) {
    pool.query(SELECTALL, [peggyuuid], function(err, res) {
        var results = [];
        if (err) {
            return console.error('error running query', err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        callback(results);
        return;
    });
};

module.exports.postUser = function postUser(uuid, name, password, isParent, peggyUuid, callback) {
    pool.query(INSERT, [uuid, name, password, isParent, new Date(), peggyUuid], function(){callback();});
};

module.exports.deleteUser = function deleteUser(name) {
    pool.query(DELETE, [name]);
};

module.exports.putUser = function putUser(uuid, name, password, isParent, callback) {
    pool.query(UPDATE, [uuid, name, password, isParent, new Date()], function(){callback();});
};