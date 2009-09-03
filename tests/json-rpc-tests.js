var assert = require("test/assert"),
    jsonrpc = require("json-rpc");

function testJSONRPC(input, output, object) {
    var result = jsonrpc.handleJSON(object, input);

    assert.isSame(output, result);
}

var methods = {
    subtract : function() {
        var a, b;
        //print("subtract: " + Array.prototype.concat.apply([],arguments).join(","));
        if (arguments[0].constructor === Object) {
            a = arguments[0].minuend;
            b = arguments[0].subtrahend;
        }
        else {
            a = arguments[0];
            b = arguments[1];
        }
        
        return a - b;
    },
    update : function() {
        //print("update: " + Array.prototype.concat.apply([],arguments).join(","));
    },
    sum : function() {
        //print("sum: " + Array.prototype.concat.apply([],arguments).join(","));
        for (var i = 0, sum = 0; i < arguments.length; i++)
            sum += arguments[i];
        return sum;
    },
    notify_hello : function(message) {
        //print("notify_hello: " + Array.prototype.concat.apply([],arguments).join(","));
    },
    get_data : function() {
        //print("get_data: " + Array.prototype.concat.apply([],arguments).join(","));
        return ["hello", 5];
    }
}

exports["testProcedureCallWithPositionalParameters"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}',
        {"jsonrpc": "2.0", "result": 19, "id": 1},
        methods
    );
}

exports["testProcedureCallWithPositionalParameters2"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "subtract", "params": [23, 42], "id": 2}',
        {"jsonrpc": "2.0", "result": -19, "id": 2},
        methods
    );
}

exports["testProcedureCallWithNamedParameters"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "subtract", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}',
        {"jsonrpc": "2.0", "result": 19, "id": 3},
        methods
    );
}

exports["testProcedureCallWithNamedParameters2"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "subtract", "params": {"minuend": 42, "subtrahend": 23}, "id": 4}',
        {"jsonrpc": "2.0", "result": 19, "id": 4},
        methods
    );
}

exports["testNotification"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "update", "params": [1,2,3,4,5]}',
        null,
        methods
    );
}

exports["testNotification2"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "foobar"}',
        null,
        methods
    );
}

exports["testProcedureCallOfNonExistentProcedure"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "foobar", "id": "1"}',
        {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found."}, "id": "1"},
        methods
    );
}

exports["testProcedureCallWithInvalidJSON"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": "foobar, "params": "bar", "baz]',
        {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error."}, "id": null},
        methods
    );
}

exports["testProcedureCallWithInvalidJSONRPC"] = function() {
    testJSONRPC(
        '[1,2,3]',
        {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request."}, "id": null},
        methods
    );
}

exports["testProcedureCallWithInvalidJSONRPC2"] = function() {
    testJSONRPC(
        '{"jsonrpc": "2.0", "method": 1, "params": "bar"}',
        {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request."}, "id": null},
        methods
    );
}

exports["testBatchedCall"] = function() {
    testJSONRPC(
        '[ {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},\
            {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]},\
            {"jsonrpc": "2.0", "method": "subtract", "params": [42,23], "id": "2"},\
            {"foo": "boo"},\
            {"jsonrpc": "2.0", "method": "foo.get", "params": {"name": "myself"}, "id": "5"},\
            {"jsonrpc": "2.0", "method": "get_data", "id": "9"} ]',
        [ {"jsonrpc": "2.0", "result": 7, "id": "1"},
            
            {"jsonrpc": "2.0", "result": 19, "id": "2"},
            {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request."}, "id": null},
            {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found."}, "id": "5"},
            {"jsonrpc": "2.0", "result": ["hello", 5], "id": "9"} ],
        methods
    );
}

exports["testBatchedCallItselfFails"] = function() {
    testJSONRPC(
        '[ {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},\
            {"jsonrpc": "2.0", "method" ]',
        {"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error."}, "id": null},
        methods
    );
}


if (require.main === module.id)
    require("test/runner").run(exports);
