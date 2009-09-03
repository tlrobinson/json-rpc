var jsonrpc = require("../json-rpc");

exports.JSONRPC_HTTP_ERRORS = {
    "-32700" : 500, // Parse error.
    "-32600" : 400, // Invalid Request.
    "-32601" : 404, // Method not found.
    "-32602" : 500, // Invalid params.
    "-32603" : 500  // Internal error.
};

exports.JSONRPC_CONTENT_TYPE = "application/json-rpc";

exports.JSONRPC = function(object) {
    return function(env) {
        return exports.dispatchJSGI(env, object);
    }
}

exports.dispatchJSGI = function(env, object) {
    var response = null;
    
    if (env["REQUEST_METHOD"] === "POST") {
        response = jsonrpc.handleJSON(object, env["jsgi.input"].read().decodeToString());
    }
    else {
        return { status : 405, headers : {}, body : [] }
    }
    
    if (response) {
        var body = JSON.stringify(response).toByteString();
        return {
            status : response.error ?
                (exports.JSONRPC_HTTP_ERRORS[response.error] || 500) :
                200,
            headers : {
                "Content-Type" : exports.JSONRPC_CONTENT_TYPE,
                "Content-Length" : String(body.length)
            },
            body : [body]
        };
    }
    else {
        return { status : 204, headers : {}, body : [] };
    }
}
