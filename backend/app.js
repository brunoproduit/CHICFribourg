
//Var
var express = require('express');
var app = express();

//Middleware
app.use(express.bodyParser());

Array.prototype.get = function(name) {
    for (var i=0, len=this.length; i<len; i++) {
        if (typeof this[i] != "object") continue;
        if (this[i].name === name) return this[i];
    }
};


//JSON
var coins = [
    { name : "5", amount : 0 },
    { name :"2", amount : 0 },
    { name : "1", amount : 0 },
    { name : "0.5", amount : 0 },
    { name : "0.2", amount : 0 },
    { name : "0.1", amount : 0 },
    { name : "0.05", amount : 0 }
];

var users = [
    { name : "mom", balance : 0, role : "admin" },
    { name : "dad", balance : 0, role : "admin" },
    { name : "kid1", balance : 0, role : "user" },
    { name : "kid2", balance : 0, role : "user" }
];

//GET
app.get('/', function(req, res) {
    res.type('text/plain');
    res.json(coins.concat(users));
});

app.get('/coins/:id', function(req, res) {
    if(coins.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }
    var q = coins.get(req.params.id);
    res.json(q);
});

app.get('/users/:id', function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No users found');
    }
    var q = users.get(req.params.id);
    res.json(q);
});

app.get('/users', function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No users found');
    }
    res.json(users);
});

app.get('/coins', function(req, res) {
    if(users.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }
    res.json(coins);
});

//POST
app.post('/coins', function(req, res) {
    if(!req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('amount')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }

    var newQuote = {
        value : req.body.name,
        amount : req.body.amount
    };

    coins.push(newQuote);
    res.json(true);
});

app.post('/users', function(req, res) {
    if(!req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('balance') ||
        !req.body.hasOwnProperty('role')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    }

    var newQuote = {
        value : req.body.name,
        amount : req.body.balance,
        role : req.body.role
    };

    users.push(newQuote);
    res.json(true);
});


//DELETE
app.delete('/coins/:id', function(req, res) {
    if(coins.length <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }

    coins.splice(req.params.id, 1);
    res.json(true);
});

app.delete('/users/:id', function(req, res) {
    if(coins.length <= req.params.id) {
        res.statusCode = 404;
        return res.send('Error 404: No coins found');
    }

    users.splice(req.params.id, 1);
    res.json(true);
});


console.log('Server running at http://chic.tic.heia-fr/');
app.listen(process.env.PORT || 80);
