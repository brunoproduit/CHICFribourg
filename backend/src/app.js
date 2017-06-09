//Var
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var cors = require('cors');
const pool = require('./postgreSQL');
const peggy = require('./peggy');
const user = require('./user');
const objective = require('./objective');
const uuidV4 = require('uuid/v4');

var HTTPStatus = require('./HTTPStatus');
var privateKey = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('../misc/sslcert/fullchain.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();
var swagger = fs.readFileSync('../swagger/swagger.json', 'utf8')
var swaggerjson = new Object(JSON.parse(swagger))

app.use(bodyParser.json());
pool.connect();
//TODO change CORS whitelist for production


/* -------------------------------------------------------------------------- */
//GET
app.get('*', cors(), function(req, res, next) {
    res.type('application/json');
    var re = /^\/$|(\/(peggy\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|users\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|objective\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?))$/;
    if (re.test(req.originalUrl)) {
        next();
    } else {
        //TODO error handeling
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    }
});

app.get('/', cors(), function(req, res) {
    res.json(swaggerjson)
});

app.get('/peggy', cors(), function(req, res) {
    peggy.getAllPeggy(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/peggy/:id', cors(), function(req, res) {
    peggy.getPeggy(req.params.id, function(response) {
        console.log(JSON.stringify(response));
        res.json(response);
    });
});

app.get('/users', cors(), function(req, res) {
    user.getAllUsers(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/users/:id', cors(), function(req, res) {
    user.getUser(req.params.id, function(response) {
        console.log(JSON.stringify(response));
        res.json(response);
    });
});

app.get('/objective', cors(), function(req, res) {
    objective.getAllObjectives(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});


app.get('/objective/:id', cors(), function(req, res) {
    objective.getObjective(req.params.id, function(response) {
        console.log(JSON.stringify(response));
        res.json(response);
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

app.post('/peggy', cors(), function(req, res) {
    var uuid = uuidV4();
    peggy.postPeggy(uuid, req.body.name, req.body.password, req.body.isParent, function() {
        peggy.getPeggy(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(201).send(HTTPStatus.getStatusJSON(201, response));
        })
    });
});

app.post('/users', cors(), function(req, res) {
    var uuid = uuidV4();
    user.postUser(uuid, req.body.name, req.body.password, req.body.isParent, "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1", function() {
        user.getUser(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(201).send(HTTPStatus.getStatusJSON(201, response));
        })
    });
});

app.post('/objective', cors(), function(req, res) {
    var uuid = uuidV4();
    objective.postObjective(uuid, req.body.name, req.body.price, "4c3c9845-5ef6-4556-87b0-f04a4c33004e", req.body.deadline, function() {
        objective.getObjective(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(201).send(HTTPStatus.getStatusJSON(201, response));
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
app.delete('/peggy/:id', cors(), function(req, res) {
    peggy.deletePeggy(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

app.delete('/users/:id', cors(), function(req, res) {
    user.deleteUser(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

app.delete('/objective/:id', cors(), function(req, res) {
    objective.deleteObjective(req.params.id);
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

app.put('/peggy', cors(), function(req, res) {
    peggy.putPeggy(req.body.uuid, req.body.coin5, req.body.coin2, req.body.coin1, req.body.coin50c, req.body.coin20c, req.body.coin10c, function() {
        peggy.getPeggy(req.body.uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(200).send(HTTPStatus.getStatusJSON(200, response));
        })
    });
});

app.put('/users', cors(), function(req, res) {
    user.putUser(req.body.uuid, req.body.name, req.body.password, req.body.isParent, function() {
        user.getUser(req.body.uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(200).send(HTTPStatus.getStatusJSON(200, response));
        })
    });
});

app.put('/objective', cors(), function(req, res) {
    objective.putObjective(req.body.uuid, req.body.name, req.body.price, req.body.deadline, function() {
        objective.getObjective(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(200).send(HTTPStatus.getStatusJSON(200, response));
        })
    });
});


/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */

// OPTION
app.options('/peggy/:id', cors()); // enable pre-flight request for DELETE request
app.options('/users/:id', cors()); // enable pre-flight request for DELETE request
app.options('/objective/:id', cors()); // enable pre-flight request for DELETE request

/* -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr.ch/');
https.createServer(credentials, app).listen(443);