var ng = require('nodegrass');
var $ = require('underscore');

var domain = '';

exports.setDomain=function(value){
  domain = value;
};

exports.header = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

exports.get = function (url, data, success) {
    ajax(url, 'get', data, success,0);
};

exports.post = function (url, data, success) {
    ajax(url, 'post', data, success,0);
};

exports.getJson = function (url, data, success) {
    ajax(url, 'get', data, success,1);
};

exports.postJson = function (url, data, success) {
    ajax(url, 'post', data, success,1);
};

function ajax(url, httpMethod, data, success,type) {
    var args = [function (res, status, headers) {
        try {
            if(type)
                res = JSON.parse(res);
            success(res, headers);
        }
        catch(ex) {
            if(res.success)
                console.log('ajax fail: %s', url);
        }
    }, exports.header];

    if (httpMethod == 'get') {
        args.unshift([
            domain,
            url,
            '?',
            $.map(data, function (v, k) {
                return [k, v].join('=');
            }).join('&')
        ].join(''));
    }
    else {
        data._ = '';
        args.unshift(domain + url);
        args.push(data);
    }
    args.push('utf8');
    ng[httpMethod].apply(ng, args).on('error', function () {
        console.log('ajax error: %s', url);
    });
}