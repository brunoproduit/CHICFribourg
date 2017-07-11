/* --------------------------------------------------------------------------
 --------------------------------Imports----------------------------------
 -------------------------------------------------------------------------- */
var fs = require('fs');
var https = require('https');
var http = require('http');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cors = require('cors');
var ocsp = require('ocsp');
var csp = require('express-csp-header');
var sts = require('strict-transport-security');
var cache = new ocsp.Cache();
var hpkp = require('hpkp');
var RateLimit = require('express-rate-limit');
var pool = require('./postgreSQL');
var validator = require('validator');

var peggy = require('./peggy');
var user = require('./user');
var objective = require('./objective');
var didyouknow = require('./didyouknow');
var change = require('./change');

var uuidV4 = require('uuid/v4');
var bearerToken = require('express-bearer-token');
var HTTPStatus = require('./HTTPStatus');
var crypto = require('crypto');
var privateKey = fs.readFileSync('../misc/sslcert/privkey.pem', 'utf8');
var publicKey = fs.readFileSync('../misc/sslcert/key.pub', 'utf8');
var certificate = fs.readFileSync('../misc/sslcert/fullchain.pem', 'utf8');
var express = require('express');
var app = express();
var credentials = {
    key: privateKey,
    cert: certificate,
    ciphers: [
        "ECDHE-ECDSA-CHACHA20-POLY1305",
        "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
        "ECDHE-RSA-AES256-SHA384",
        "DHE-RSA-AES256-SHA384",
        "ECDHE-RSA-AES256-SHA256",
        "DHE-RSA-AES256-SHA256",
        "ECDHE-RSA-AES128-SHA256",
        "DHE-RSA-AES128-SHA256",
        "HIGH",
        "!aNULL",
        "!eNULL",
        "!EXPORT",
        "!DES",
        "!RC4",
        "!MD5",
        "!PSK",
        "!SRP",
        "!CAMELLIA"
    ].join(':'),
    secureOptions: require('constants').SSL_OP_NO_TLSv1,
    honorCipherOrder: true
};



/* --------------------------------------------------------------------------
 --------------------------------Constants-----------------------------------
 -------------------------------------------------------------------------- */
const NINETY_DAYS_IN_SECONDS = 7776000; // Time to pin the public keys in HPKP
const HSTS_DAYS  = 180;                 // Time used for HSTS
const HTTPS_PORT = 443;                 // Default port for HTTPS
const maxcoin5 = 20;
const maxcoin2 = 21;
const maxcoin1 = 30;
const maxcoin50c = 37;
const maxcoin20c = 28;
const maxcoin10c = 32;



/* --------------------------------------------------------------------------
--------------------------------Middlewares----------------------------------
 -------------------------------------------------------------------------- */

app.use(bodyParser.json());             // Used to parse incoming JSON data
app.use(csp({                           // CSP header rules
    policies: {
        'default-src': [csp.SELF],      // Files source self
        'script-src': [csp.SELF],       // If scripts are used, then source self
        'style-src': [csp.SELF],        // If CSS is used, then source self
        'img-src': [csp.SELF],          // If images are used, then source self
        'block-all-mixed-content': true // No other content
    }
}));


app.use(sts.getSTS({"max-age": {days: HSTS_DAYS}}));            // Middleware for HSTS

app.use(hpkp({                                                  // Public key pinning
    maxAge: NINETY_DAYS_IN_SECONDS,                             // pin key for ninety days
    sha256s: ['yAs3QPoZf+wDpRWBPNV2Dvi0tq7tysNuOCH4VaWPxMQ=',   // Own public key
              'YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg=',   // Let’s Encrypt Authority X3
              'Vjs8r4z+80wjNcr1YKepWQboSIRi63WsWXhIMN+eWys=',   // ISRG Root X1
              'rQfc9Oew5VQWfPh6qaKE7QfPqTWUi10XC5X4Oe3ig2s=']   // Own backup key
}));

app.disable('x-powered-by');                                    // Disable x-powered-by header

var corsOptions = {origin: 'chic.tic.heia-fr.ch'};              // Set CORS origin to only self

var limiter = new RateLimit({
    windowMs: 60 * 10000,                       // 10 min window
    delayAfter: 600000,                         // begin slowing down responses after 60 requests
    delayMs: 500,                               // slow down subsequent responses by 0.5s per request
    max: 60 * 500000,                           // start blocking after 300 requests
    message: HTTPStatus.getStatusJSON(403)      // Send back blocking message
});

app.use(limiter);                               // Use the declared limits for the API to prevent abuse

pool.connect();                                 // Connect to the postgreSQL pool









/* --------------------------------------------------------------------------
 --------------------------------Routes--------------------------------------
 -------------------------------------------------------------------------- */


//-----------------------------------ALL-------------------------------------

//All requests will go through here at first
app.all('*', cors(corsOptions), bearerToken(), function (req, res, next) {
    try {
        console.log("Request from " + req.connection.remoteAddress + " on " + req.get('host') + req.originalUrl);
        res.type('application/json');
        res.header('X-XSS-Protection', ['1; mode=block']);
        res.header('X-Content-Type-Options', ['nosniff']);
        res.header('X-Frame-Options', ['SAMEORIGIN']);
        res.header('Referrer-Policy', ['no-referrer']);
        // Check if URL is valid
        var re = /^\/$|(\/(peggy\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|users\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?|objective\/?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})?))|auth\/?(\?uuid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))\&(password=(.{0,128}))|change\/([0-9]{1,3})(\.[0-9]{1,3})?|didyouknow$/;
        if (re.test(req.originalUrl)) {

            // Check URL to know if user is authenticating
            var re2 = /^\/$|auth\/?(\?uuid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))\&(password=(.{0,128}))$|users\/?(\?uuid=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))|peggy|didyouknow/;
            if (re2.test(req.originalUrl)) {
                // User is authenticating, no need for token
                next();
            } else if (typeof(req.token) === 'undefined') {

                // User not authenticating and no token in header
                res.status(401).send(HTTPStatus.getStatusJSON(401));
            } else {

                // Verify token validity
                jwt.verify(req.token, publicKey, function (err, decoded) {
                    if (err) {

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
            res.status(400).send(HTTPStatus.getStatusJSON(400))
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});




//-----------------------------------GET-------------------------------------
app.get('*', cors(corsOptions), bearerToken(), function (req, res, next) {
    next();
});

app.get('/', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        var swagger = fs.readFileSync('../swagger/swagger.json', 'utf8');
        var swaggerjson = new Object(JSON.parse(swagger));
        // Respond with API definition
        res.json(swaggerjson)
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return a random "did you know?" page
 */
app.get('/didyouknow', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        res.type('text/html');
        didyouknow.getDidyouknow(function(content){
            var response = fs.readFileSync('./index.html', 'utf8');
            res.write(response);
            res.write("<p>" + content + "</p>");
            res.send();
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return an Array of coins which are the best possible change in CHF for the given money, for the given peggy.
 * @param money
 */
app.get('/change/:id', cors(corsOptions), bearerToken(), function (req, res) {
    //try {
    peggy.getPeggy(jwt.decode(req.token).peggyuuid, function (peggy) {
        console.log(JSON.stringify(peggy));
        delete peggy['uuid'];
        delete peggy['lastchanged'];
        var result = change.getChange(req.params.id, peggy);
        res.json(result);
    });
});

/**
 *
 * Return a signed JSON Web token if authentication is sucessfull.
 * @param uuid
 * @param password
 */
app.get('/auth', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        console.log(req.query.uuid);
        var re = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
        if (re.test(req.query.uuid)) {
            user.getPasswordHash(req.query.uuid, function (response) {
                if (user.isPasswordCorrect(response, req.query.password)) {
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
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return a list of peggy.
 */
app.get('/peggy', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        if (typeof(req.token)!='undefined' && jwt.decode(req.token).isparent) {
            console.log(jwt.decode(req.token).isparent);
            peggy.getAllPeggy(function (response) {
                console.log(JSON.stringify(response));
                return res.json(response);
            });
        } else {
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return a peggy by ID. Authenticated user must be in the peggy.
 * @param uuid
 */
app.get('/peggy/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        re=/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
        if (typeof(req.token)!='undefined' && jwt.decode(req.token).peggyuuid == req.params.id && re.test(id)) {
            peggy.getPeggy(req.params.id, function (response) {
                console.log(JSON.stringify(response));
                res.json(response);
            });
        }
        else {
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return an Array of users inside the given peggy.
 * @param uuid
 */
app.get('/users', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        user.getAllUsers(req.query.uuid, function (response) {
            console.log(JSON.stringify(response));
            return res.json(response);
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return a user by ID. IsParent must be true and in the peggy, or user must be self.
 * @param uuid
 */
app.get('/users/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        if (jwt.decode(req.token).isparent | jwt.decode(req.token).uuid == req.params.id) {
            user.getUser(req.params.id, function (response) {
                console.log(jwt.decode(req.token).peggyuuid);
                console.log(response.peggyuuid);
                if (jwt.decode(req.token).peggyuuid == response.peggyuuid) {
                    console.log(JSON.stringify(response));
                    res.json(response);
                } else {
                    res.status(401).send(HTTPStatus.getStatusJSON(401));
                }
            });
        } else {
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Return a list of objective owned by the authenticated user.
 */
app.get('/objective', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        objective.getAllObjectives(jwt.decode(req.token).uuid, function (response) {
            console.log(JSON.stringify(response));
            return res.json(response);
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Returns a objective by ID. isParent must be true or authenticated user must own objective.
 * @param uuid
 */
app.get('/objective/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        objective.getObjective(req.params.id, function (response) {
            if (jwt.decode(req.token).isparent | jwt.decode(req.token).uuid == response.useruuid) { // TODO check if parent in good peggy
                console.log(JSON.stringify(response));
                res.json(response);
            } else {
                res.status(401).send(HTTPStatus.getStatusJSON(401));
            }
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});
/* -------------------------------------------------------------------------- */




//-----------------------------------POST-------------------------------------
app.post('*', cors(corsOptions), bearerToken(), function (req, res, next) {
    try {
        var re=/\/?peggy\/?/;
        if (typeof(req.token) === 'undefined' && !re.test(req.originalUrl)) {
            res.status(401).send(HTTPStatus.getStatusJSON(401))
        } else if (!req.body || typeof(req.body) != 'object') {
            res.status(400).send(HTTPStatus.getStatusJSON(400))
        } else {
            next();
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Create a new peggy with a parent user inside.
 * @param { "name"     : string,
 *          "password" : string }
 */
app.post('/peggy', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        var peggyuuid = uuidV4();
        var useruuid = uuidV4();
        if (typeof(req.body.name) != 'string' | typeof(req.body.password) != 'string') {
            res.status(406).send(HTTPStatus.getStatusJSON(406))
        }
        else {
            var name = validator.escape(req.body.name);
            peggy.postPeggy(peggyuuid, name, req.body.password, true, useruuid, function () {
                peggy.getPeggy(peggyuuid, function (peggy) {
                    user.getUser(useruuid, function (user) {
                        response = new Object();
                        response.peggy = peggy;
                        response.user = user;
                        console.log(JSON.stringify(response));
                        res.status(201).send(HTTPStatus.getStatusJSON(201, response));
                    })
                })
            });
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Creates a new user in the peggy of the authenticated user. IsParent must be true for the authenticated user.
 * @param { "name"     : string,
 *          "password" : string,
 *          "isParent" : boolean }
 */
app.post('/users', cors(corsOptions), bearerToken(), function (req, res) {
    try {

        var uuid = uuidV4();

        if (jwt.decode(req.token).isparent) {
            if (typeof(req.body.name) != 'string' | typeof(req.body.password) != 'string' | typeof(req.body.isParent) != 'boolean') {
                res.status(406).send(HTTPStatus.getStatusJSON(406))
            }
            else {
                var name = validator.escape(req.body.name);
                user.postUser(uuid, name, req.body.password, req.body.isParent, jwt.decode(req.token).peggyuuid, function () {
                    user.getUser(uuid, function (response) {
                        console.log(JSON.stringify(response));
                        res.status(201).send(HTTPStatus.getStatusJSON(201, response));
                    })
                });
            }
        } else {
            res.status(401).send(HTTPStatus.getStatusJSON(401));
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});


/**
 *
 * Creates a new objective for the authenticated user.
 * @param {  "name"     : string,
 *           "price"    : integer,
 * @optional "deadline" : string }
 */
app.post('/objective', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        var uuid = uuidV4();
        if (typeof(req.body.name) != 'string' | typeof(req.body.price) != 'number') {
            res.status(406).send(HTTPStatus.getStatusJSON(406))
        } else {
            var name = validator.escape(req.body.name);
            if (typeof(deadline)!='undefined') var deadline = validator.escape(deadline);
            console.log(name, deadline);
            objective.postObjective(uuid, name, req.body.price, jwt.decode(req.token).uuid, deadline, function () {
                objective.getObjective(uuid, function (response) {
                    console.log(JSON.stringify(response));
                    res.status(201).send(HTTPStatus.getStatusJSON(201, response));
                })
            });
        }
    }
    catch (err) {
        console.log(err, name);
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});



//-----------------------------------PUT-------------------------------------
app.put('*', cors(corsOptions), bearerToken(), function (req, res, next) {
    try {
        if (typeof(req.token) === 'undefined') {
            res.status(401).send(HTTPStatus.getStatusJSON(401))
        } else if (!req.body || typeof(req.body) != 'object') {
            res.status(400).send(HTTPStatus.getStatusJSON(400))
        } else {
            next();
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Insert or remove coins in a specific peggy. At least one optional is required
 * @param {  "uuid"    : string,
 * @optional "coin5"   : string,
 * @optional "coin2"   : string,
 * @optional "coin1"   : string,
 * @optional "coin50c" : string,
 * @optional "coin20c" : string,
 * @optional "coin10c" : string  }
 */
app.put('/peggy', cors(corsOptions), bearerToken(), function (req, res) {
        if (typeof(req.body.uuid) != 'string') {
            return res.status(406).send(HTTPStatus.getStatusJSON(406));
        } else {
            var uuid = validator.escape(req.body.uuid);
            peggy.putPeggy(uuid, req.body.coin5, req.body.coin2, req.body.coin1, req.body.coin50c, req.body.coin20c, req.body.coin10c, jwt.decode(req.token).uuid, function (err) {
                if (typeof(err.constraint)!='undefined'){
                    return res.status(304).send(HTTPStatus.getStatusJSON(304));
                } else {
                    peggy.getPeggy(uuid, function (peggy) {
                        user.getUser(jwt.decode(req.token).uuid, function (user) {
                            peggy.balance = user.balance;
                            console.log(JSON.stringify(peggy));
                            res.json(peggy);
                            return res.end();
                        });
                    });
                }
            });
        }
});

/**
 *
 * Updates a user. isParent must be true or user must be self
 * @param  { "uuid"     : string,
 *           "name"     : string,
 *           "password" : string,
 *           "isParent" : boolean }
 */
app.put('/users', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        var uuid = validator.escape(req.body.uuid);
        var name = validator.escape(req.body.name);

        user.putUser(uuid, name, req.body.password, req.body.isParent, function () {
            if (typeof(req.body.uuid) != 'string' | typeof(req.body.name) != 'string' | typeof(req.body.password) != 'string' | typeof(req.body.isParent) != 'boolean') {
                res.status(406).send(HTTPStatus.getStatusJSON(406))
            }
            else {
                user.getUser(uuid, function (response) {
                    console.log(JSON.stringify(response));
                    res.json(response);
                })
            }
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Update an objective. isParent or owner of the objective
 * @param {  "uuid"     : string
 *           "name"     : string,
 *           "price"    : integer,
 * @optional "deadline" : string }
 */
app.put('/objective', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        var uuid = validator.escape(req.body.uuid);
        var name = validator.escape(req.body.name);
        objective.putObjective(uuid, name, req.body.price, req.body.deadline, function () {
            if (typeof(req.body.uuid) != 'string' | typeof(req.body.name) != 'string' | typeof(req.body.price) != 'number') {
                res.status(406).send(HTTPStatus.getStatusJSON(406))
            } else {
                objective.getObjective(req.body.uuid, function (response) {
                    console.log(JSON.stringify(response));
                    res.json(response);
                })
            }
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});



//-----------------------------------DELETE-------------------------------------
app.delete('*', cors(corsOptions), bearerToken(), function (req, res, next) {
    try {
        res.type('application/json');
        if (typeof(req.token) === 'undefined') {
            res.status(401).send(HTTPStatus.getStatusJSON(401))
        } else {
            next();
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Deletes a peggy. isParent must be true and in the same peggy. Peggy must be empty.
 * @param uuid
 */
app.delete('/peggy/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        if (!jwt.decode(req.token).isparent) {
            res.status(401).send(HTTPStatus.getStatusJSON(401))
        } else {
            peggy.deletePeggy(req.params.id);
            res.status(200).send(HTTPStatus.getStatusJSON(200));
        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Deletes a user. Isparent must be true and in the same peggy.
 * @param uuid
 */
app.delete('/users/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        if (!jwt.decode(req.token).isparent) {
            res.status(401).send(HTTPStatus.getStatusJSON(401))
        } else {
            user.deleteUser(req.params.id, function(err){
                res.status(200).send(HTTPStatus.getStatusJSON(200));
            });

        }
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});

/**
 *
 * Delete an objective.
 * @param uuid
 */
app.delete('/objective/:id', cors(corsOptions), bearerToken(), function (req, res) {
    try {
        objective.deleteObjective(req.params.id);
        res.status(200).send(HTTPStatus.getStatusJSON(200));
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});



//-----------------------------------OPTION-------------------------------------
app.options('/peggy/:id', cors(corsOptions), bearerToken());        // enable pre-flight request for DELETE request
app.options('/users/:id', cors(corsOptions), bearerToken());        // enable pre-flight request for DELETE request
app.options('/objective/:id', cors(corsOptions), bearerToken());    // enable pre-flight request for DELETE request



//-----------------------------------Other HTTP Methods-------------------------------------
app.patch('*', cors(corsOptions), bearerToken(), function (req, res) {
    res.status(405).send(HTTPStatus.getStatusJSON(405));
});
app.trace('*', cors(corsOptions), bearerToken(), function (req, res) {
    res.status(405).send(HTTPStatus.getStatusJSON(405));
});
app.connect('*', cors(corsOptions), bearerToken(), function (req, res) {
    res.status(405).send(HTTPStatus.getStatusJSON(405));
});




/* --------------------------------------------------------------------------
 --------------------------------Events--------------------------------------
 -------------------------------------------------------------------------- */

/**
 *
 * Handler for OCSP requests
 */
app.on('OCSPRequest', function (certificate, issuer, cb) {
    try {
        ocsp.getOCSPURI(certificate, function (err, uri) {
            if (err)
                return cb(err);

            var req = ocsp.request.generate(certificate, issuer);
            var options = {
                url: uri,
                ocsp: req.data
            };

            cache.request(req.id, options, cb);
        });
    }
    catch (err) {
        res.status(500).send(HTTPStatus.getStatusJSON(500));
    }
});



/* --------------------------------------------------------------------------
 --------------------------------Start Server--------------------------------
 -------------------------------------------------------------------------- */

console.log('Server running at https://chic.tic.heia-fr.ch/');  // Write startup in log
https.createServer(credentials, app).listen(HTTPS_PORT);        // Start server on port 443 (HTTPS default)