//Var and libraries
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
var blake2 = require('blake2');
var privateKey = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var publicKey = fs.readFileSync('../misc/sslcert/key.pub', 'utf8');
var certificate = fs.readFileSync('../misc/sslcert/fullchain.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};
var express = require('express');
var app = express();
var swagger = fs.readFileSync('../swagger/swagger.json', 'utf8');
var swaggerjson = new Object(JSON.parse(swagger))



/* -------------------------------------------------------------------------- */
app.use(bodyParser.json());
pool.connect();
//TODO change CORS whitelist for production


/* -------------------------------------------------------------------------- */
//All requests will go through here at first
app.all('*', cors(), bearerToken(), function(req, res, next) {
    console.log("Request from " + req.connection.remoteAddress + " on " + req.get('host') + req.originalUrl)
    res.type('application/json');

    // Check if URL is valid
    var re = /^\/$|(\/(peggy\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|users\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|objective\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?))|auth\/?(\?uuid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))\&(password=(.{0,128}))$/;
    if (re.test(req.originalUrl)) {

        // Check URL to know if user is authenticating
        var re2 = /^\/$|auth\/?(\?uuid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))\&(password=(.{0,128}))$/;
        if(re2.test(req.originalUrl)){
            // User is authenticating, no need for token
            next();
        } else if (typeof(req.token) === 'undefined'){

            // User not authenticating and no token in header
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        } else {

            // Verify token validity
            jwt.verify(req.token, publicKey, function(err, decoded) {
                if(err){

                    // Token is not valid
                    res.status(401).send(HTTPStatus.getStatusJSON(401))
                }
                else {

                    // Valid token, continue
                    next();
                }
            });
        }
    } else {
        //TODO error handeling
        res.status(400).send(HTTPStatus.getStatusJSON(400))
    }
});



//GET
app.get('*', cors(), bearerToken(), function(req, res, next) {
    next();
});

app.get('/', cors(), bearerToken(), function(req, res) {

    // Respond with API definition
    res.json(swaggerjson)
});

// Authentication
app.get('/auth', cors(), bearerToken(), function(req, res) {
    console.log(req.query.uuid);
    var re = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
    if (re.test(req.query.uuid)) {
            user.getPasswordHash(req.query.uuid, function (response) {
                var h = blake2.createHash('blake2b');
                h.update(new Buffer(req.query.password));
                var hash = h.digest("hex")
                if (response == hash){
                    user.getUser(req.query.uuid, function (user) {
                        var out = new Object();
                        out.token = jwt.sign(
                            user, privateKey, {algorithm: 'RS512', expiresIn: '1h'});
                        console.log(JSON.stringify(out));
                        res.json(out);
                });
            } else {
                    res.status(401).send(HTTPStatus.getStatusJSON(401));
                }
        });
    } else {
        res.status(406).send(HTTPStatus.getStatusJSON(406));
    }
});

// List all peggy status/content
app.get('/peggy', cors(), bearerToken(), function(req, res) {
    peggy.getAllPeggy(function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

// Returns specific peggy status/content
app.get('/peggy/:id', cors(), bearerToken(), function(req, res) {
    if (jwt.decode(req.token).peggyuuid == req.params.id){
    peggy.getPeggy(req.params.id, function(response) {
        console.log(JSON.stringify(response));
        res.json(response);
    });}
    else {
        res.status(401).send(HTTPStatus.getStatusJSON(401));
    }
});

// List all users in one peggy, user must be parent
app.get('/users', cors(), bearerToken(), function(req, res) {
    if (jwt.decode(req.token).isparent){
        user.getAllUsers(jwt.decode(req.token).peggyuuid, function(response) {
            console.log(JSON.stringify(response));
            return res.json(response);
        });
    } else {
        res.status(401).send(HTTPStatus.getStatusJSON(401));
    }
});

// Returns user informations, must be self or parent in the same peggy
app.get('/users/:id', cors(), bearerToken(), function(req, res) {
    if (jwt.decode(req.token).isparent|jwt.decode(req.token).uuid == req.params.id){
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

// List all objectives of one user
app.get('/objective', cors(), bearerToken(), function(req, res) {
    objective.getAllObjectives(jwt.decode(req.token).uuid, function(response) {
        console.log(JSON.stringify(response));
        return res.json(response);
    });
});

// Returns information about specific objective, must be owned by self or be a parent in the same peggy
app.get('/objective/:id', cors(), bearerToken(), function(req, res) {
        objective.getObjective(req.params.id, function(response) {
            if (jwt.decode(req.token).isparent | jwt.decode(req.token).uuid == response.useruuid){ // TODO check if parent in good peggy
                console.log(JSON.stringify(response));
                res.json(response);
            } else {
                res.status(401).send(HTTPStatus.getStatusJSON(401));
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

app.post('/peggy', cors(), bearerToken(), function(req, res) {
    var uuid = uuidV4();
    peggy.postPeggy(uuid, req.body.name, req.body.password, req.body.isParent, function() {
        peggy.getPeggy(uuid, function(peggy) {
            user.getUser(uuid, function(user) {
                response = new Object();
                response.peggy = peggy;
                response.user = user;
                console.log(JSON.stringify(response));
                res.status(201).send(HTTPStatus.getStatusJSON(201, response));
            })
        })
    });
});

app.post('/users', cors(), bearerToken(), function(req, res) {
    var uuid = uuidV4();
    if (jwt.decode(req.token).isparent){
        user.postUser(uuid, req.body.name, req.body.password, req.body.isParent, jwt.decode(req.token).peggyuuid , function() {
            user.getUser(uuid, function(response) {
                console.log(JSON.stringify(response));
                res.status(201).send(HTTPStatus.getStatusJSON(201, response));
            })
        });
    } else {
        res.status(401).send(HTTPStatus.getStatusJSON(401));
    }
});

app.post('/objective', cors(), bearerToken(), function(req, res) {
    var uuid = uuidV4();
    objective.postObjective(uuid, req.body.name, req.body.price, jwt.decode(req.token).uuid, req.body.deadline, function() {
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
    if (typeof(req.token) === 'undefined') {
        res.status(401).send(HTTPStatus.getStatusJSON(401))
    } else if(!jwt.decode(req.token).isparent){
        res.status(401).send(HTTPStatus.getStatusJSON(401))
        }
    else {
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
    peggy.putPeggy(req.body.uuid, req.body.coin5, req.body.coin2, req.body.coin1, req.body.coin50c, req.body.coin20c, req.body.coin10c, jwt.decode(req.token).uuid, function() {
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


