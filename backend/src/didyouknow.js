/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var pool = require('./postgreSQL');

/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const SELECT = "SELECT content FROM didyouknow ORDER BY RANDOM() LIMIT 1;";


/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
module.exports.getDidyouknow = function getObjective(callback) {
    pool.query(SELECT, 0, function(err, res) {
        var results = [];
        if (err) {
            console.error('error running query', err);
            return callback(err);
        }
        for (var i = 0; i < res.rowCount; i++) {
            results.push(res.rows[i]);
        }
        return callback(results.pop().content);
    });
};