/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var pool = require('./postgreSQL');
var uuidV4 = require('uuid/v4');
var bodyParser = require('body-parser');
var crypto = require('crypto');



/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const SELECT = "SELECT uuid, name, isParent, balance, peggyUuid FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECT_PASSWORD_HASH = "SELECT password FROM users WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT uuid, name, isParent, balance, peggyUuid FROM users WHERE peggyuuid = $1 ORDER BY uuid";
const INSERT = 'INSERT INTO users(uuid, name, password, isParent, lastchanged, lastrequest, peggyUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM users WHERE uuid = $1';
const UPDATE = 'UPDATE users SET name = $2, password = $3, isParent = $4, lastchanged = $5 WHERE uuid = $1';
const INCREMENT_BALANCE = 'UPDATE users SET balance = balance + $2, lastchanged = $3 WHERE uuid = $1';
const iterations = 10000;



/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
module.exports.isPasswordCorrect = function isPasswordCorrect(hash, password) {
    var salt = hash.split("$")[1];
    var hashwithoutsalt = hash.split("$")[2];
    return hashwithoutsalt == crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('base64');
};

function hashPassword(password) {
    var salt = crypto.randomBytes(128).toString('base64');
    var hash = crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512').toString('base64');
    var result = "$" + salt + "$" + hash;
    return result;
}

module.exports.hashPassword = hashPassword;

module.exports.getUser = function getUser(uuid, callback) {
    pool.query(SELECT, [uuid], function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        return callback(results.pop());
    });
};

module.exports.getAllUsers = function getAllUsers(peggyuuid, callback) {
    pool.query(SELECTALL, [peggyuuid], function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        return callback(results);
    });
};

module.exports.postUser = function postUser(uuid, name, password, isParent, peggyUuid, callback) {
    var hash = hashPassword(password);
    pool.query(INSERT, [uuid, name, hash, isParent, new Date(), peggyUuid], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.incrementUserBalance = function incrementUserBalance(uuid, increment,  callback) {
    pool.query(INCREMENT_BALANCE, [uuid, increment, new Date()], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.deleteUser = function deleteUser(name, callback) {
    pool.query(DELETE, [name], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.putUser = function putUser(uuid, name, password, isParent, callback) {
    var hash = hashPassword(password);
    pool.query(UPDATE, [uuid, name, hash, isParent, new Date()], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};


module.exports.getPasswordHash = function checkPassword(uuid, callback) {
    pool.query(SELECT_PASSWORD_HASH, [uuid], function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        return callback(results.pop().password);
    });
};

