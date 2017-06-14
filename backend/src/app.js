//Var
var fs = require('fs');
var https = require('https');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cors = require('cors');
const pool = require('./postgreSQL');
const peggy = require('./peggy');
const user = require('./user');
const objective = require('./objective');
const uuidV4 = require('uuid/v4');
const bearerToken = require('express-bearer-token');
var HTTPStatus = require('./HTTPStatus');
var privateKey = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var publicKey = fs.readFileSync('../misc/sslcert/key.pub', 'utf8');
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
app.all('*', cors(), bearerToken(), function(req, res, next) {
    //console.log('GET request from ' + jwt.decode(req.token).name);
    res.type('application/json');
    var re = /^\/$|(\/(peggy\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|users\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|objective\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?))|auth\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/;
    if (re.test(req.originalUrl)) {
        next();
    } else {
        //TODO error handeling
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    }
});



//GET
app.get('*', cors(), bearerToken(), function(req, res, next) {
    var re = /^\/$|auth\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?$/
    if (typeof(req.token) === 'undefined'&!re.test(req.originalUrl)){
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    } else{
        next();
    }
});

app.get('/', cors(), bearerToken(), function(req, res) {
    res.json(swaggerjson)
});

app.get('/auth/:id', cors(), bearerToken(), function(req, res) {

    user.getUser(req.params.id, function(response) {
        var out = new Object();
        out.token = jwt.sign(
            response, privateKey, { algorithm: 'RS512', expiresIn: '1h'});
        console.log(JSON.stringify(out));
        res.json(out);
    });
});

app.get('/peggy', cors(), bearerToken(), function(req, res) {
    peggy.getAllPeggy(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/peggy/:id', cors(), bearerToken(), function(req, res) {
    if (jwt.decode(req.token).peggyuuid == req.params.id){
    peggy.getPeggy(req.params.id, function(response) {
        console.log(JSON.stringify(response));
        res.json(response);
    });}
    else {
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    }
});

app.get('/users', cors(), bearerToken(), function(req, res) {
    user.getAllUsers(jwt.decode(req.token).peggyuuid, function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

app.get('/users/:id', cors(), bearerToken(), function(req, res) {
    if (jwt.decode(req.token).isparent){
    user.getUser(req.params.id, function(response) {
        console.log(jwt.decode(req.token).peggyuuid);
        console.log(response.peggyuuid);
        if (jwt.decode(req.token).peggyuuid == response.peggyuuid){
        console.log(JSON.stringify(response));
        res.json(response);
        } else{
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        }
    });} else{
        res.status(401).send(HTTPStatus.getStatusJSON(401));
    }
});

app.get('/objective', cors(), bearerToken(), function(req, res) {
    objective.getAllObjectives(jwt.decode(req.token).uuid, function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});


app.get('/objective/:id', cors(), bearerToken(), function(req, res) {
        objective.getObjective(req.params.id, function(response) {
            if (jwt.decode(req.token).isparent | jwt.decode(req.token).uuid == response.useruuid){
                console.log(JSON.stringify(response));
                res.json(response);
            }
        });
});
/* -------------------------------------------------------------------------- */




/* -------------------------------------------------------------------------- */
//POST
app.post('*', cors(), bearerToken(), function(req, res, next) {
    if (typeof(req.token) === 'undefined'){
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    } else if (!req.body || typeof(req.body) != 'object') {
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    } else {
        next();
    }
});

app.post('/auth', cors(), bearerToken(), function(req, res) {
    jwt.verify(req.token, publicKey, function(err, decoded) {
        if(err){
            res.json(false);
        }
        else {
            res.json(true);
        }
    });

});

app.post('/peggy', cors(), bearerToken(), function(req, res) {
    var uuid = uuidV4();
    peggy.postPeggy(uuid, req.body.name, req.body.password, req.body.isParent, function() {
        peggy.getPeggy(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(201).send(HTTPStatus.getStatusJSON(201, response));
        })
    });
});

app.post('/users', cors(), bearerToken(), function(req, res) {
    var uuid = uuidV4();
    user.postUser(uuid, req.body.name, req.body.password, req.body.isParent, "cf94737d-5d5b-4ca4-ba6f-33cc1f1f8de1", function() {
        user.getUser(uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(201).send(HTTPStatus.getStatusJSON(201, response));
        })
    });
});

app.post('/objective', cors(), bearerToken(), function(req, res) {
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
app.delete('*', cors(), bearerToken(), function(req, res, next) {
    res.type('application/json');
    if (typeof(req.token) === 'undefined'){
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    } else {
        next();
    }
});
app.delete('/peggy/:id', cors(), bearerToken(), function(req, res) {
    peggy.deletePeggy(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

app.delete('/users/:id', cors(), bearerToken(), function(req, res) {
    user.deleteUser(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

app.delete('/objective/:id', cors(), bearerToken(), function(req, res) {
    objective.deleteObjective(req.params.id);
    res.status(200).send(HTTPStatus.getStatusJSON(200));
});

/* -------------------------------------------------------------------------- */

// PUT
app.put('*', cors(), bearerToken(), function(req, res, next) {
    if (typeof(req.token) === 'undefined'){
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    } else if (!req.body || typeof(req.body) != 'object') {
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    } else {
        next();
    }
});

app.put('/peggy', cors(), bearerToken(), function(req, res) {
    peggy.putPeggy(req.body.uuid, req.body.coin5, req.body.coin2, req.body.coin1, req.body.coin50c, req.body.coin20c, req.body.coin10c, function() {
        peggy.getPeggy(req.body.uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(200).send(HTTPStatus.getStatusJSON(200, response));
        })
    });
});

app.put('/users', cors(), bearerToken(), function(req, res) {
    user.putUser(req.body.uuid, req.body.name, req.body.password, req.body.isParent, function() {
        user.getUser(req.body.uuid, function(response) {
            console.log(JSON.stringify(response));
            res.status(200).send(HTTPStatus.getStatusJSON(200, response));
        })
    });
});

app.put('/objective', cors(), bearerToken(), function(req, res) {
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
app.options('/peggy/:id', cors(), bearerToken()); // enable pre-flight request for DELETE request
app.options('/users/:id', cors(), bearerToken()); // enable pre-flight request for DELETE request
app.options('/objective/:id', cors(), bearerToken()); // enable pre-flight request for DELETE request

/* -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr.ch/');
https.createServer(credentials, app).listen(443);