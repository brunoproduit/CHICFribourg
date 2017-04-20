//Var
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var cors = require('cors');
const pool = require('./postgreSQL');
const coin = require('./coin');
const user = require('./user');
var privateKey  = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../misc/sslcert/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(bodyParser.json());

//TODO change CORS whitelist for production
pool.connect();






/* -------------------------------------------------------------------------- */
//GET
app.get('/', cors(), function(req, res) {
    //TODO error handeling
    res.type('application/json');
    coin.getAllCoins(function(response){
        console.log(JSON.stringify(response));
        res.json(response);
    });
});

app.get('/coins/:id', cors(), function(req, res) {
    /*    if(coins.length <= req.params.id || req.params.id < 0) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found');
     }*/ //TODO error handeling
    res.type('application/json');
    coin.getCoin(req.params.id, function(response){
        var out = response.pop();
        console.log(JSON.stringify(out));
        res.json(out);
    });
});

app.get('/users/:id', cors(), function(req, res) {
    /*    if(users.length <= req.params.id || req.params.id < 0) {
     res.statusCode = 404;
     return res.send('Error 404: No users found');
     }*/ //TODO error handeling
    res.type('application/json');
    user.getUser(req.params.id, function(response){
        var out = response.pop();
        console.log(JSON.stringify(out));
        res.json(out);
    });
});

app.get('/users', cors(), function(req, res) {
    /*    if(users.length <= req.params.id || req.params.id < 0) {
     res.statusCode = 404;
     return res.send('Error 404: No users found');
     }*/ //TODO error handeling
    res.type('application/json');
    user.getAllUsers(function(response){
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/coins', cors(), function(req, res) {
    /*    if(users.length <= req.params.id || req.params.id < 0) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found');
     }*/ //TODO error handeling
    res.type('application/json');
    coin.getAllCoins(function(response){
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
//POST
app.post('/coins', cors(), function(req, res) {
    res.type('application/json');
    if (!req.body || typeof(req.body) != 'object') {
        res.statusCode = 400;
        return res.json({message: 'No Request Body'});
    }
    else {
        coin.postCoin(req.body.name, req.body.amount, 1);
        return res.json(true); //TODO return value
    }
});

app.post('/users', cors(), function(req, res) {
    res.type('application/json');
    if (!req.body || typeof(req.body) != 'object') {
        res.statusCode = 400;
        return res.json({message: 'No Request Body'});
    }
    else {
        user.postUser(req.body.name, req.body.balance, req.body.role, 1 , 1);
        return res.json(true); //TODO return value
    }
});



/* -------------------------------------------------------------------------- */


//DELETE
app.delete('/coins/:id', cors(), function(req, res) {
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    coin.deleteCoin(req.params.id);
    res.type('application/json');
    res.json(true); //TODO return value
});

app.delete('/users/:id', cors(), function(req, res) {
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    user.deleteUser(req.params.id);
    res.type('application/json');
    res.json(true); //TODO return value
});

/* -------------------------------------------------------------------------- */

// OPTION
app.put('/coins', cors(), function(req, res) {
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    coin.putCoin(req.body.name,req.body.amount);
    res.type('application/json');
    res.json(true); //TODO return value
});
app.put('/users', cors(), function(req, res) {
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    user.putUser(req.body.name, req.body.balance, req.body.role);
    res.type('application/json');
    res.json(true); //TODO return value
});
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

// OPTION
app.options('/coins/:id', cors()); // enable pre-flight request for DELETE request
app.options('/users/:id', cors()); // enable pre-flight request for DELETE request

/* -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr/');
https.createServer(credentials, app).listen(443);
