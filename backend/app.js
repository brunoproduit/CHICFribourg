
//Var
var express = require('express');
var app = express();

//Middleware
app.use(express.bodyParser());


//JSON
var coins = [
  { value : "5", amount : 0 },
  { value :"2", amount : 0 },
  { value : "1", amount : 0 },
  { value : "0.5", amount : 0 },
  { value : "0.2", amount : 0 },
  { value : "0.1", amount : 0 },
  { value : "0.05", amount : 0 },
];

var users = [
  { name : "mom", balance : 0, role : "admin" },
  { name : "dad", balance : 0, role : "admin" },
  { name : "kid1", balance : 0, role : "user" },
  { name : "kid2", balance : 0, role : "user" },
]

//GET
app.get('/', function(req, res) {
  res.type('text/plain');
  res.json(coins);
});

app.get('/coins/:id', function(req, res) {
  if(coins.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No coins found');
  }
var q = coins[req.params.id];
  res.json(q);
});

app.get('/users/:id', function(req, res) {
  if(users.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No coins found');
  }
var q = users[req.params.id];
  res.json(q);
});


//POST
app.post('/coins', function(req, res) {
  if(!req.body.hasOwnProperty('value') || 
     !req.body.hasOwnProperty('amount')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  } 
 
var newQuote = {
    value : req.body.value,
    amount : req.body.amount
  }; 
 
coins.push(newQuote);
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
console.log('Server running at http://chic.tic.heia-fr/');
app.listen(process.env.PORT || 80);
