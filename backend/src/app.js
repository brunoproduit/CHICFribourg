//Var
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var cors = require('cors');
const pool = require('./postgreSQL');
const coin = require('./coin');
const user = require('./user');
var HTTPStatus = require('./HTTPStatus');
var privateKey = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../misc/sslcert/fullchain.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();


app.use(bodyParser.json());
pool.connect();
//TODO change CORS whitelist for production


/* -------------------------------------------------------------------------- */
//GET
app.get('*', cors(), function(req, res, next) {
    res.type('application/json');
    var re = /^\/(coins\/?[0-9.]{0,4}|users\/?[a-zA-Z0-9]{0,40})$/;
    if (re.test(req.originalUrl)) {
        next();
    } else {
        //TODO error handeling
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    }
});

app.get('/', cors(), function(req, res) {
    res.json('ok')
});

app.get('/coins/:id', cors(), function(req, res) {
    coin.getCoin(req.params.id, function(response) {
        var out = response.pop();
        console.log(JSON.stringify(out));
        res.json(out);
    });
});

app.get('/users/:id', cors(), function(req, res) {
    user.getUser(req.params.id, function(response) {
        var out = response.pop();
        console.log(JSON.stringify(out));
        res.json(out);
    });
});

app.get('/users', cors(), function(req, res) {
    user.getAllUsers(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/coins', cors(), function(req, res) {
    coin.getAllCoins(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
//POST
app.post('*', cors(), function(req, res, next) {
    res.type('application/json');
    if (!req.body || typeof(req.body) != 'object') {
        res.statusCode = 400;
        return res.send(HTTPStatus.getStatusJSON(400));
    } else {
        next();
    }
});

app.post('/coins', cors(), function(req, res) {
    var name = req.body.name;
    coin.postCoin(req.body.name, req.body.amount, 1, function() {
        coin.getCoin(name, function(response) {
            var out = response.pop();
            console.log(JSON.stringify(out));
            res.status(201).send(HTTPStatus.getStatusJSON(201, out));
        })
    });
});

app.post('/users', cors(), function(req, res) {
    var name = req.body.name;
    user.postUser(req.body.name, req.body.balance, req.body.role, 1, 1, function() {
        user.getUser(name, function(response) {
            var out = response.pop();
            console.log(JSON.stringify(out));
            res.status(201).send(HTTPStatus.getStatusJSON(201, out));
        })
    });
});

/* -------------------------------------------------------------------------- */

//DELETE
app.delete('*', cors(), function(req, res, next) {
    res.type('application/json');
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    next();
});
app.delete('/coins/:id', cors(), function(req, res) {
    coin.deleteCoin(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

app.delete('/users/:id', cors(), function(req, res) {
    user.deleteUser(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

/* -------------------------------------------------------------------------- */

// PUT
app.put('*', cors(), function(req, res, next) {
    res.type('application/json');
    /*    if(coins.length <= req.params.id) {
     res.statusCode = 404;
     return res.send('Error 404: No coins found.');
     }*/ //TODO error handeling
    next();
});

app.put('/coins', cors(), function(req, res) {
    var name = req.body.name;
    coin.putCoin(req.body.name, req.body.amount, function() {
        coin.getCoin(name, function(response) {
            var out = response.pop();
            console.log(JSON.stringify(out));
            res.status(200).send(HTTPStatus.getStatusJSON(200, out));
        })
    });
});

app.put('/users', cors(), function(req, res) {
    var name = req.body.name;
    user.putUser(req.body.name, req.body.balance, req.body.role, function() {
        user.getUser(name, function(response) {
            var out = response.pop();
            console.log(JSON.stringify(out));
            res.status(200).send(HTTPStatus.getStatusJSON(200, out));
        })
    });
});
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

// OPTION
app.options('/coins/:id', cors()); // enable pre-flight request for DELETE request
app.options('/users/:id', cors()); // enable pre-flight request for DELETE request

/* -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr/');
https.createServer(credentials, app).listen(443);