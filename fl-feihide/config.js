var config = [];
exports.setapihost = function setapihost(host){
    config['api_host'] = host;
}

exports.setmongo = function setmongo(host){
    config['mongo'] = host;
}

exports.getconfig = config;
