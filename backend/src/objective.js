const pool = require('./postgreSQL');
const uuidV4 = require('uuid/v4');
const SELECT = "SELECT * FROM objective WHERE uuid = $1 ORDER BY creation";
const SELECTALL = "SELECT * FROM objective ORDER BY creation";
const INSERT = 'INSERT INTO objective(uuid, name, price, deadline, creation, lastchanged, userUuid) VALUES($1, $2, $3, $4, $5, $5, $6)';
const DELETE = 'DELETE FROM objective WHERE uuid = $1';
<<<<<<< HEAD
const UPDATE = 'UPDATE objective SET name = $2, price = $3, deadline = $4, lastchanged = $5 WHERE uuid = $1';
=======
const UPDATE = 'UPDATE objective SET name, = $2 price = $3, deadline = $4, lastchanged = $5 WHERE uuid = $1';
>>>>>>> 1cba963b9c3a9ff083da87dedae85ef374a95c31

module.exports.getObjective = function getObjective(uuid, callback) {
    pool.query(SELECT, [uuid], function(err, res) {
        var results = [];
        if (err) {
            return console.error('error running query', err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
<<<<<<< HEAD
        callback(results.pop());
=======
        callback(results);
>>>>>>> 1cba963b9c3a9ff083da87dedae85ef374a95c31
        return;
    });
};

module.exports.getAllObjectives = function getAllObjectives(callback) {
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


module.exports.postObjective = function postObjective(uuid, name, price, userUuid, deadline, callback) {
<<<<<<< HEAD
    pool.query(INSERT, [uuid, name, price, deadline, new Date(), userUuid], function(){callback();});
=======
    pool.query(INSERT, [uuid, name, price, deadline, new Date(), new Date(), userUuid], function(){callback();});
>>>>>>> 1cba963b9c3a9ff083da87dedae85ef374a95c31
};

module.exports.deleteObjective = function deleteObjective(uuid) {
    pool.query(DELETE, [uuid]);
};

module.exports.putObjective = function putObjective(uuid, name, price, deadline, callback) {
    pool.query(UPDATE, [uuid, name, price, deadline, new Date()], function(){callback();});
};