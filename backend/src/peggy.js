const pool = require('./postgreSQL');
const user = require('./user');
const uuidV4 = require('uuid/v4');
const SELECT = "SELECT * FROM peggy WHERE uuid = $1 ORDER BY uuid";
const SELECTALL = "SELECT * FROM peggy ORDER BY uuid";
const INSERT = 'INSERT INTO peggy(uuid, lastchanged) VALUES($1, $2)';
const DELETE = 'DELETE FROM peggy WHERE uuid = $1';
<<<<<<< HEAD
const UPDATE = 'UPDATE peggy SET coin5 = $2, coin2 = $3, coin1 = $4, coin50c = $5, coin20c = $6, coin10c = $7, lastchanged = $8 WHERE uuid = $1';
const UPDATE_RELATIVE_coin5 = 'UPDATE peggy SET coin5 = coin5 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin2 = 'UPDATE peggy SET coin2 = coin2 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin1 = 'UPDATE peggy SET coin1 = coin1 + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin50c = 'UPDATE peggy SET coin50c = coin50c + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin20c = 'UPDATE peggy SET coin20c = coin20c + $2, lastchanged = $3 WHERE uuid = $1';
const UPDATE_RELATIVE_coin10c = 'UPDATE peggy SET coin10c = coin10c + $2, lastchanged = $3 WHERE uuid = $1';
=======
const UPDATE = 'UPDATE peggy SET amount = $2, lastchanged = $3 WHERE name = $1';
const UPDATE_RELATIVE = 'UPDATE peggy SET amount = amount + $2, lastchanged = $3 WHERE name = $1';
>>>>>>> 1cba963b9c3a9ff083da87dedae85ef374a95c31

module.exports.getPeggy = function getPeggy(uuid, callback) {
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

<<<<<<< HEAD
module.exports.putPeggy = function putPeggy(uuid, coin5, coin2, coin1, coin50c, coin20c, coin10c, callback) {
    var re = /^(\u002B|\u002D)\d{1,2}$/i;

    if (re.test(coin5)){
        pool.query(UPDATE_RELATIVE_coin5, [uuid, coin5, new Date()], function(){callback();});
    } else if (re.test(coin2)) {
        pool.query(UPDATE_RELATIVE_coin2, [uuid, coin2, new Date()], function(){callback();});
    } else if (re.test(coin1)) {
        pool.query(UPDATE_RELATIVE_coin1, [uuid, coin1, new Date()], function(){callback();});
    } else if (re.test(coin50c)) {
        pool.query(UPDATE_RELATIVE_coin50c, [uuid, coin50c, new Date()], function(){callback();});
    } else if (re.test(coin20c)) {
        pool.query(UPDATE_RELATIVE_coin20c, [uuid, coin20c, new Date()], function(){callback();});
    } else if (re.test(coin10c)) {
        pool.query(UPDATE_RELATIVE_coin10c, [uuid, coin10c, new Date()], function(){callback();});
    } else { // if absolute number
        pool.query(UPDATE, [uuid, coin5, coin2, coin1, coin50c, coin20c, coin10c, new Date()], function(){callback();});
=======
module.exports.putPeggy = function putPeggy(name, amount, callback) {
    if (re.test(amount)) { // if relative (with plus or minus)
        pool.query(UPDATE_RELATIVE, [name, amount, new Date()], function(){callback();});
    } else { // if absolute number
        pool.query(UPDATE, [name, amount, new Date()], function(){callback();});
>>>>>>> 1cba963b9c3a9ff083da87dedae85ef374a95c31
    }
};