const pool = require('./postgreSQL');
const uuidV4 = require('uuid/v4');
var bodyParser = require('body-parser');
var blake2 = require('blake2');
const SELECT = "SELECT uuid, name, isParent, peggyUuid FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECT_PASSWORD_HASH = "SELECT password FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT uuid, name, isParent, peggyUuid FROM users WHERE peggyuuid = $1 ORDER BY uuid";
const INSERT = 'INSERT INTO users(uuid, name, password, isParent, lastchanged, lastrequest, peggyUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM users WHERE uuid = $1';
const UPDATE = 'UPDATE users SET name = $2, password = $3, isParent = $4, lastchanged = $5 WHERE uuid = $1';
const INCREMENT_BALANCE = 'UPDATE users SET balance = balance + $2, lastchanged = $3 WHERE uuid = $1';

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
    var h = blake2.createHash('blake2b');
    h.update(new Buffer(password));
    pool.query(INSERT, [uuid, name, h.digest("hex"), isParent, new Date(), peggyUuid], function(){callback();});
};

module.exports.incrementUserBalance = function incrementUserBalance(uuid, increment,  callback) {
    pool.query(INCREMENT_BALANCE, [uuid, increment, new Date()], function(){callback();});
};

module.exports.deleteUser = function deleteUser(name) {
    pool.query(DELETE, [name]);
};

module.exports.putUser = function putUser(uuid, name, password, isParent, callback) {
    var h = blake2.createHash('blake2b');
    h.update(new Buffer(password));
    pool.query(UPDATE, [uuid, name, h.digest("hex"), isParent, new Date()], function(){callback();});
};

module.exports.getPasswordHash = function checkPassword(uuid, callback) {;
    pool.query(SELECT_PASSWORD_HASH, [uuid], function(err, res) {
        var results = [];
        if (err) {
            return console.error('error running query', err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        callback(results.pop().password);
        return;
    });
};