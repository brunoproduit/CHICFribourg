/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var fs = require('fs');
var pg = require('pg');


/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const PASSWORD = fs.readFileSync('../misc/passwd', 'utf8');
const config = {
    user: 'postgres',
    database: 'chic',
    password: PASSWORD,
    host: 'localhost',
    port: 5432,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
const pool = new pg.Pool(config);



/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});



module.exports.query = function (text, values, callback) {
    console.log('query:', text, values);
    return pool.query(text, values, callback);
};

module.exports.connect = function (callback) {
    return pool.connect(callback);
};