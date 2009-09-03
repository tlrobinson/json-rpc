exports.app = require("json-rpc/jsgi").JSONRPC({
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
});
