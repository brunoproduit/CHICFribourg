const pool = require('./postgreSQL');
const uuidV4 = require('uuid/v4');
const SELECT = "SELECT uuid, name, price, deadline, creation, userUuid FROM objective WHERE uuid = $1 ORDER BY creation";
const SELECTALL = "SELECT uuid, name, price, deadline, creation, userUuid FROM objective WHERE userUuid = $1 ORDER BY creation";
const INSERT = 'INSERT INTO objective(uuid, name, price, deadline, creation, lastchanged, userUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM objective WHERE uuid = $1';
const UPDATE = 'UPDATE objective SET name = $2, price = $3, deadline = $4, lastchanged = $5 WHERE uuid = $1';

module.exports.getObjective = function getObjective(uuid, callback) {
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

module.exports.getAllObjectives = function getAllObjectives(useruuid, callback) {
    pool.query(SELECTALL, [useruuid], function(err, res) {
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


module.exports.postObjective = function postObjective(uuid, name, price, userUuid, deadline, callback) {
    pool.query(INSERT, [uuid, name, price, deadline, new Date(), userUuid], function(){callback();});
};

module.exports.deleteObjective = function deleteObjective(uuid) {
    pool.query(DELETE, [uuid]);
};

module.exports.putObjective = function putObjective(uuid, name, price, deadline, callback) {
    pool.query(UPDATE, [uuid, name, price, deadline, new Date()], function(){callback();});
};