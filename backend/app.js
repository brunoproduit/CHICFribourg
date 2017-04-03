/* -------------------------------------------------------------------------- */
//Var
var fs = require('fs');
var https = require('https');
//var pg = require('pg');
var bodyParser = require('body-parser');

var cors = require('cors');


var privateKey  = fs.readFileSync('sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

//var PASSWORD = fs.readFileSync('passwd', 'utf8');

var express = require('express');
var app = express();
app.use(bodyParser.json());
/* -------------------------------------------------------------------------- */

//TODO change CORS whitelist for production

/* -------------------------------------------------------------------------- */


function coin (name, amount) {
    this.name = name;
    this.amount = amount;
}

function user (name, balance, role) {
    this.name = name;
    this.balance = balance;
    this.role = role;
}

/* -------------------------------------------------------------------------- */

//JSON
var coins = [
    { "name" : 5,    "amount" : 0 },
    { "name" : 2,    "amount" : 0 },
    { "name" : 1,    "amount" : 0 },
    { "name" : 0.5,  "amount" : 0 },
    { "name" : 0.2,  "amount" : 0 },
    { "name" : 0.1,  "amount" : 0 },
    { "name" : 0.05, "amount" : 0 }
];

var users = [
    { "name" : "mom",  "balance" : 0, "role" : "admin" },
    { "name" : "dad",  "balance" : 0, "role" : "admin" },
    { "name" : "kid1", "balance" : 0, "role" : "user" },
    { "name" : "kid2", "balance" : 0, "role" : "user" }
];


/* -------------------------------------------------------------------------- */
// var conString = "pg://".concat(PASSWORD).concat("@127.0.0.1:5432/chic");
// console.log(new Date(new Date().getTime()).toISOString());
// var client = new pg.Client(conString);
// client.connect();
//
// for (var i=0; i < users.length; i++)
// {
//     client.query("INSERT INTO users(name, balance, lastchanged, role) values($1, $2, $3, $4)", [users[i].name, users[i].balance, new Date(new Date().getTime()).toISOString(), users[i].role]);
// }
//
// for (var i=0; i < coins.length; i++)
// {
//     client.query("INSERT INTO coins(name, amount, lastchanged) values($1, $2, $3)", [coins[i].name, coins[i].amount,  new Date(new Date().getTime()).toISOString()]);
// }



/* -------------------------------------------------------------------------- */
//Middleware

Array.prototype.get = function(name) {
    for (var i=0, len=this.length; i<len; i++) {
        if (typeof this[i] != "object") continue;
        if (this[i].name == name) return this[i];
    }
};

Array.prototype.remove = function(name) {
    for (var i=0, len=this.length; i<len; i++) {
        if (typeof this[i] != "object") continue;
        if (this[i].name == name)  this.splice(i,1);
    }
};

/* -------------------------------------------------------------------------- */
/*client.connect(function (err) {
    if (err) throw err;
}*/


/* -------------------------------------------------------------------------- */
//GET
app.get('/', cors(), function(req, res) {
    res.type('application/json');
    res.json(coins.concat(users));
});

app.get('/coins/:id', cors(), function(req, res) {
    if(coins.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }
    var q = coins.get(req.params.id);
    res.type('application/json');
    res.json(q);
});

app.get('/users/:id', cors(), function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No users found');
    }
    var q = users.get(req.params.id);
    res.type('application/json');
    res.json(q);
});

app.get('/users', cors(), function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No users found');
    }
    res.type('application/json');
    res.json(users);
});

app.get('/coins', cors(), function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }
    res.type('application/json');
    res.json(coins);
});
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
//POST
app.post('/coins', function(req, res) {
    res.type('application/json');
    if (!req.body || typeof(req.body) != 'object') {
        res.statusCode = 400;
        return res.json({ message: 'No Request Body' });
    }
    if (coins.get(req.body.name)==null) {
        var newcoin = new coin(req.body.name, req.body.amount);
        console.log(newcoin);
        coins.push(newcoin);
        res.json({message: 'Coin created!'});
    } else {
        for (var i=0, len=coins.length; i<len; i++) {
            if (coins[i].name == req.body.name) {
                coins[i].amount += req.body.amount;
            }
        }
        console.log(req.body);
        res.json({message: 'Coin Added!'});
    }
});

app.post('/users', function(req, res) {
    res.type('application/json');
    if (!req.body || typeof(req.body) != 'object') {
        res.statusCode = 400;
        return res.json({message: 'No Request Body'});
    }
        var newuser = new user(req.body.name, req.body.balance, req.body.role);
        console.log(newuser);
        users.push(newuser);
        res.json({message: 'User created!'});
});



/* -------------------------------------------------------------------------- */


//DELETE
app.delete('/coins/:id', function(req, res) {
    if(coins.length <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found.');
    }
    coins.remove(req.params.id);
    res.type('application/json');
    res.json(true);
});

app.delete('/users/:id', function(req, res) {
    if(coins.length <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }

    users.remove(req.params.id);
    res.type('application/json');
    res.json(true);
});

/* -------------------------------------------------------------------------- */

// OPTION
app.options('/products/:id', cors()) // enable pre-flight request for DELETE request
app.delete('/products/:id', cors(), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})

/* -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr/');
https.createServer(credentials, app).listen(443);
