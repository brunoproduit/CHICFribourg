const pool = require('./postgreSQL');
const uuidV4 = require('uuid/v4');
var bodyParser = require('body-parser');
const SELECT = "SELECT * FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT * FROM users ORDER BY uuid";
const INSERT = 'INSERT INTO users(uuid, name, password, isParent, lastchanged, lastrequest, peggyUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM users WHERE name = $1';
const UPDATE = 'UPDATE users SET balance = $2, isParent = $3, lastchanged = $4 WHERE uuid = $1';

module.exports.getUser = function getUser(uuid, callback) {
    pool.query(SELECT, [uuid], function(err, res) {
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

module.exports.getAllUsers = function getAllUsers(callback) {
    pool.query(SELECTALL, 0, function(err, res) {
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

module.exports.postUser = function postUser(name, password, isParent, peggyUuid, callback) {
    pool.query(INSERT, [uuidV4(), name, password, isParent, new Date(), peggyUuid], function(){callback();});
};

module.exports.deleteUser = function deleteUser(name) {
    pool.query(DELETE, [name]);
};

module.exports.putUser = function putUser(name, balance, role, callback) {
    pool.query(UPDATE, [name, balance, role, new Date()], function(){callback();});
};