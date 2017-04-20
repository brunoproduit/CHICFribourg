const pool = require('./postgreSQL');
const SELECT = "SELECT name, amount FROM coins WHERE name = $1 ORDER BY name";
const SELECTALL = "SELECT name, amount FROM coins ORDER BY name";
const INSERT = 'INSERT INTO coins(name, amount, lastchanged, peggy_id) VALUES($1, $2, $3, $4)';
const DELETE = 'DELETE FROM coins WHERE name = $1';
const UPDATE = 'UPDATE coins SET amount = $2, lastchanged = $3 WHERE name = $1';
const UPDATE_RELATIVE = 'UPDATE coins SET amount = amount + $2, lastchanged = $3 WHERE name = $1';

module.exports.getCoin= function getCoin(name, callback) {
    pool.query(SELECT, [name], function(err, res) {
        var results = [];
        if(err) {
            return console.error('error running query', err);
        }
        for (var i=0; i < res.rowCount;i++){
            results.push(res.rows[i]);
            results[i].amount = String(results[i].amount);
        }
        callback(results);
        return;
    });
};

module.exports.getAllCoins= function getAllCoins(callback) {
    pool.query(SELECTALL, 0, function(err, res) {
        var results = [];
        if(err) {
            return console.error('error running query', err);
        }
        for (var i=0; i < res.rowCount;i++){
            results.push(res.rows[i]);
            results[i].amount = String(results[i].amount);
        }
        callback(results);
        return;
    });
};


module.exports.postCoin = function postCoin(name, amount, peggy_id, callback){
    pool.query(INSERT, [name, amount, new Date(), peggy_id]);
    callback();
};

module.exports.deleteCoin = function deleteCoin(name){
    pool.query(DELETE, [name]);
};

module.exports.putCoin = function putCoin(name, amount){
    var re = /[\u002B|\u002D]\d{1,2}$/i;
    if (re.test(amount)){ // if relative (with plus or minus)
        pool.query(UPDATE_RELATIVE, [name, amount, new Date()]);
    } else { // if absolute number
        pool.query(UPDATE, [name, amount, new Date()]);
    }
};
