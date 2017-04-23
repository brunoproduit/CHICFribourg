module.exports.getStatusJSON= function getStatusJSON(code, value) {
    switch(code) {
        case 200:
            var status = new Object();
            status.success = new Object();
            status.success.code = 200;
            status.success.message = "OK";
            status.currentvalue = value;
            return JSON.stringify(status);
            break;
        case 201:
            var status = new Object();
            status.success = new Object();
            status.currentvalue = new Object();
            status.success.code = 201;
            status.success.message = "Created";
            status.success.details = "Entity has been added to the Database";
            status.currentvalue = value;
            return JSON.stringify(status);
            break;
        case 202:
            var status = new Object();
            status.success = new Object();
            status.success.code = 202;
            status.success.message = "Accepted";
            return JSON.stringify(status);
            break;
        case 204:
            var status = new Object();
            status.success = new Object();
            status.success.code = 204;
            status.success.message = "No Content";
            return JSON.stringify(status);
            break;
        case 301:
            var status = new Object();
            status.success = new Object();
            status.success.code = 301;
            status.success.message = "Moved Permanently";
            return JSON.stringify(status);
            break;
        case 304:
            var status = new Object();
            status.error = new Object();
            status.error.code = 304;
            status.error.message = "Not Modified";
            return JSON.stringify(status);
            break;
        case 400:
            var status = new Object();
            status.error = new Object();
            status.error.code = 400;
            status.error.message = "Bad Request";
            return JSON.stringify(status);
            break;
        case 401:
            var status = new Object();
            status.error = new Object();
            status.error.code = 401;
            status.error.message = "Unauthorized";
            status.error.details = "Please Authenticate";
            return JSON.stringify(status);
            break;
        case 403:
            var status = new Object();
            status.error = new Object();
            status.error.code = 403;
            status.error.message = "Forbidden";
            status.error.details = "You are not allowed to do that, please ask an administrator";
            return JSON.stringify(status);
            break;
        case 404:
            var status = new Object();
            status.error = new Object();
            status.error.code = 404;
            status.error.message = "Not Found";
            status.error.details = "Entity doesn't exist";
            return JSON.stringify(status);
            break;
        case 405:
            var status = new Object();
            status.error = new Object();
            status.error.code = 405;
            status.error.message = "Method Not Allowed";
            status.error.details = "This Method is intentionally blocked";
            return JSON.stringify(status);
            break;
        case 406:
            var status = new Object();
            status.error = new Object();
            status.error.code = 406;
            status.error.message = "Not Acceptable";
            status.error.details = "Please only use application/json format";
            return JSON.stringify(status);
            break;
        case 501:
            var status = new Object();
            status.error = new Object();
            status.error.code = 501;
            status.error.message = "Not Implemented";
            return JSON.stringify(status);
            break;
        default:
            var status = new Object();
            status.error = new Object();
            status.error.code = 500;
            status.error.message = "Internal Server Error";
            status.error.details = "Try again later";
            return JSON.stringify(status);
    }
};