const pool = require('./postgreSQL');
const user = require('./user');
const uuidV4 = require('uuid/v4');
const SELECT = "SELECT * FROM peggy WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT * FROM peggy ORDER BY uuid";
const INSERT = 'INSERT INTO peggy(uuid, lastchanged) VALUES($1, $2)';
const DELETE = 'DELETE FROM peggy WHERE uuid = $1';
const UPDATE = 'UPDATE peggy SET amount = $2, lastchanged = $3 WHERE name = $1';
const UPDATE_RELATIVE = 'UPDATE peggy SET amount = amount + $2, lastchanged = $3 WHERE name = $1';

module.exports.getPeggy = function getPeggy(uuid, callback) {
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

module.exports.getAllPeggy = function getAllPeggy(callback) {
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


module.exports.postPeggy = function postPeggy(uuid, name, password, isParent, callback) {
    pool.query(INSERT, [uuid, new Date()], function(){
        user.postUser(name, password, isParent, uuid, function(){callback();});
    });

};

module.exports.deletePeggy = function deletePeggy(uuid) {
    pool.query(DELETE, [uuid]);
};

module.exports.putPeggy = function putPeggy(name, amount, callback) {
    if (re.test(amount)) { // if relative (with plus or minus)
        pool.query(UPDATE_RELATIVE, [name, amount, new Date()], function(){callback();});
    } else { // if absolute number
        pool.query(UPDATE, [name, amount, new Date()], function(){callback();});
    }
};