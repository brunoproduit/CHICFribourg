/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var pool = require('./postgreSQL');
var uuidV4 = require('uuid/v4');


/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const SELECT = "SELECT uuid, name, price, deadline, creation, userUuid FROM objective WHERE uuid = $1 ORDER BY creation";
const SELECTALL = "SELECT uuid, name, price, deadline, creation, userUuid FROM objective WHERE userUuid = $1 ORDER BY creation";
const INSERT = 'INSERT INTO objective(uuid, name, price, deadline, creation, lastchanged, userUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM objective WHERE uuid = $1';
const UPDATE = 'UPDATE objective SET name = $2, price = $3, deadline = $4, lastchanged = $5 WHERE uuid = $1';



/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
module.exports.getObjective = function getObjective(uuid, callback) {
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

module.exports.getAllObjectives = function getAllObjectives(useruuid, callback) {
    pool.query(SELECTALL, [useruuid], function(err, res) {
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


module.exports.postObjective = function postObjective(uuid, name, price, userUuid, deadline, callback) {
    pool.query(INSERT, [uuid, name, price, deadline, new Date(), userUuid], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.deleteObjective = function deleteObjective(uuid, callback) {
    pool.query(DELETE, [uuid], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.putObjective = function putObjective(uuid, name, price, deadline, callback) {
    pool.query(UPDATE, [uuid, name, price, deadline, new Date()], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};