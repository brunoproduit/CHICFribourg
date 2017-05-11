const pool = require('./postgreSQL');
var bodyParser = require('body-parser');
const SELECT = "SELECT name, balance, role FROM users WHERE name = $1 ORDER BY user_id";
const SELECTALL = "SELECT name, balance, role FROM users ORDER BY user_id";
const INSERT = 'INSERT INTO users(name, balance, lastchanged, role, peggy_id, token) VALUES($1, $2, $3, $4, $5, $6)';
const DELETE = 'DELETE FROM users WHERE name = $1';
const UPDATE = 'UPDATE users SET balance = $2, role = $3, lastchanged = $4 WHERE name = $1';

module.exports.getUser = function getUser(name, callback) {
    pool.query(SELECT, [name], function(err, res) {
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

module.exports.postUser = function postUser(name, balance, role, peggy_id, token, callback) {
    pool.query(INSERT, [name, balance, new Date(), role, peggy_id, token], function(){callback();});
};

module.exports.deleteUser = function deleteUser(name) {
    pool.query(DELETE, [name]);
};

module.exports.putUser = function putUser(name, balance, role, callback) {
    pool.query(UPDATE, [name, balance, role, new Date()], function(){callback();});
};