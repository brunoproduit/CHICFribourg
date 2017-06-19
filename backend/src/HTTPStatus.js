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
            return JSON.stringify(value);
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
            return JSON.stringify(status);
            break;
        case 403:
            var status = new Object();
            status.error = new Object();
            status.error.code = 403;
            status.error.message = "Forbidden";
            return JSON.stringify(status);
            break;
        case 404:
            var status = new Object();
            status.error = new Object();
            status.error.code = 404;
            status.error.message = "Not Found";
            return JSON.stringify(status);
            break;
        case 405:
            var status = new Object();
            status.error = new Object();
            status.error.code = 405;
            status.error.message = "Method Not Allowed";
            return JSON.stringify(status);
            break;
        case 406:
            var status = new Object();
            status.error = new Object();
            status.error.code = 406;
            status.error.message = "Not Acceptable";
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
            return JSON.stringify(status);
    }
};