/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var pool = require('./postgreSQL');
var user = require('./user');
var uuidV4 = require('uuid/v4');


/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const SELECT = "SELECT * FROM peggy WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT * FROM peggy ORDER BY uuid";
const INSERT = 'INSERT INTO peggy(uuid, lastchanged) VALUES($1, $2)';
const DELETE = 'DELETE FROM peggy WHERE uuid = $1';
const UPDATE = 'UPDATE peggy SET coin5 = $2, coin2 = $3, coin1 = $4, coin50c = $5, coin20c = $6, coin10c = $7, lastchanged = $8 WHERE uuid = $1';
const UPDATE_RELATIVE_coin5 = 'UPDATE peggy SET coin5 = coin5 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin2 = 'UPDATE peggy SET coin2 = coin2 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin1 = 'UPDATE peggy SET coin1 = coin1 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin50c = 'UPDATE peggy SET coin50c = coin50c + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin20c = 'UPDATE peggy SET coin20c = coin20c + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin10c = 'UPDATE peggy SET coin10c = coin10c + $2, lastchanged = $3 WHERE uuid = $1';



/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
module.exports.getPeggy = function getPeggy(uuid, callback) {
    pool.query(SELECT, [uuid], function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            for (var i = 0; i < res.rowCount; i++) {
                results.push(res.rows[i]);
            }
            return callback(results.pop());
        }
    });
};

module.exports.getAllPeggy = function getAllPeggy(callback) {
    pool.query(SELECTALL, 0, function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            for (var i = 0; i < res.rowCount; i++) {
                results.push(res.rows[i]);
            }
            return callback(results);
        }
    });
};


module.exports.postPeggy = function postPeggy(peggyuuid, name, password, isParent, useruuid, callback) {
    pool.query(INSERT, [peggyuuid, new Date()], function(err, res){
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            user.postUser(useruuid, name, password, isParent, peggyuuid, function(err, res) {
                if (err) {
                    console.error('error running query', err);
                    return callback(err);
                } else {
                    return callback(res);
                }
            });
        }
    });

};

module.exports.deletePeggy = function deletePeggy(uuid) {
    pool.query(DELETE, [uuid], function(err, res) {
        if (err) {
            console.error('error running query', err);
            return callback(err);
        } else {
            return callback(res);
        }
    });
};

module.exports.putPeggy = function putPeggy(uuid, coin5, coin2, coin1, coin50c, coin20c, coin10c, useruuid, callback) {
    var re = /^(\u002B|\u002D)\d{1,2}$/i;

    if (re.test(coin5)){
        pool.query(UPDATE_RELATIVE_coin5, [uuid, coin5, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin5 * 5, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else if (re.test(coin2)) {
        pool.query(UPDATE_RELATIVE_coin2, [uuid, coin2, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin2 * 2, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else if (re.test(coin1)) {
        pool.query(UPDATE_RELATIVE_coin1, [uuid, coin1, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin1, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else if (re.test(coin50c)) {
        pool.query(UPDATE_RELATIVE_coin50c, [uuid, coin50c, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin50c * 0.5, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else if (re.test(coin20c)) {
        pool.query(UPDATE_RELATIVE_coin20c, [uuid, coin20c, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin20c * 0.2, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else if (re.test(coin10c)) {
        pool.query(UPDATE_RELATIVE_coin10c, [uuid, coin10c, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin10c * 0.1, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    } else { // if absolute number
        pool.query(UPDATE, [uuid, coin5, coin2, coin1, coin50c, coin20c, coin10c, new Date()], function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin5 * 5, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin2 * 2, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin1, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin50c * 0.5, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin20c * 0.2, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
        user.incrementUserBalance(useruuid, coin10c * 0.1, function(err, res) {
            if (err) {
                console.error('error running query', err);
                return callback(err);
            } else {
                return callback(res);
            }
        });
    }
};