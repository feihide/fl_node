var server = require("./server");
var router = require("./router");
var requestHandlers = require("./handler");
var config = require("./config");
var handle = {}
var action = ['main','start','upload','show','call','mail','test','sendsms','asynmodel','push','operatelog','errorlog'];
function start(){
handle["/"] = requestHandlers.main;

    for (var i=0, l=action.length; i<l; i++){
        var code = "requestHandlers."+action[i];
        handle["/"+action[i]] = eval(code);
    }

    server.start(router.route,handle);
}
exports.start = start;
exports.setapihost = config.setapihost;
exports.setmongo = config.setmongo;