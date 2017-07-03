/* --------------------------------------------------------------------------
 --------------------------------Functions-----------------------------------
 -------------------------------------------------------------------------- */
module.exports.getStatusJSON= function getStatusJSON(code, value) {
    switch(code) {
        case 200:
            var status = new Object();
            status.code = 200;
            status.message = "OK";
            status.currentvalue = value;
            return JSON.stringify(status);
            break;
        case 201:
            return JSON.stringify(value);
            break;
        case 202:
            var status = new Object();
            status.code = 202;
            status.message = "Accepted";
            return JSON.stringify(status);
            break;
        case 204:
            var status = new Object();
            status.code = 204;
            status.message = "No Content";
            return JSON.stringify(status);
            break;
        case 301:
            var status = new Object();
            status.code = 301;
            status.message = "Moved Permanently";
            return JSON.stringify(status);
            break;
        case 304:
            var status = new Object();
            status.code = 304;
            status.message = "Not Modified";
            return JSON.stringify(status);
            break;
        case 400:
            var status = new Object();
            status.code = 400;
            status.message = "Bad Request";
            return JSON.stringify(status);
            break;
        case 401:
            var status = new Object();
            status.code = 401;
            status.message = "Unauthorized";
            return JSON.stringify(status);
            break;
        case 403:
            var status = new Object();
            status.code = 403;
            status.message = "Forbidden, This IP has used too much requests, please try again in 1 minute";
            return JSON.stringify(status);
            break;
        case 404:
            var status = new Object();
            status.code = 404;
            status.message = "Not Found";
            return JSON.stringify(status);
            break;
        case 405:
            var status = new Object();
            status.code = 405;
            status.message = "Method Not Allowed";
            return JSON.stringify(status);
            break;
        case 406:
            var status = new Object();
            status.code = 406;
            status.message = "Not Acceptable";
            return JSON.stringify(status);
            break;
        case 501:
            var status = new Object();
            status.code = 501;
            status.message = "Not Implemented";
            return JSON.stringify(status);
            break;
        default:
            var status = new Object();
            status.code = 500;
            status.message = "Internal Server Error";
            return JSON.stringify(status);
    }
};