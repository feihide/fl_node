var exec = require("child_process").exec;
var formidable = require('formidable');
var fs = require("fs");
var hc = require('./module/httpclient');
var date = require('./module/date');
var mongodb = require('mongodb');
var jpush = require('jpush-sdk');
var nodemailer = require("nodemailer");

var config= require('./config').getconfig;


function savelog(table,msg){
    msg.time = Date.now();
    var server = new mongodb.Server(config.mongo, 27017, {auto_reconnect: true});
    var db = new mongodb.Db('common_mongo', server, {safe: true});
    //连接db
    //console.log(msg);
    db.open(function (err, db) {
        if (!err) {
            //console.log('connect db');
            db.createCollection(table, {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                    db.close();
                } else {
                    collection.insert(msg, {safe: true}, function (err, result) {
                       // console.log(result);
                        db.close();

                    })
                }

            })
        } else {
            console.log(err);
            db.close();
        }
    });
}

function systemlog(msg){
    //新增数据
    msg.ctime=date.formate('',Date.now());
    savelog('console_log',msg);
}

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

function test(response, request){
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body><h1>111</h1>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post"><input name ="ff"  type="text">' +
        '<input type="file" name=""upload1111>' +
        '<input type="submit" value="Upload" />' +
        '</form>' +
        '</body>' +
        '</html>';

    console.log(request.get);
    console.log(request.post);
    response.write(body);
    response.end();
}

function main(response,request){
    response.write('welcome');
    response.end();
}

function mail(response,request){
    // 开启一个 SMTP 连接池
    var smtpTransport = nodemailer.createTransport("SMTP",{
       service:'QQex',
        auth: {
            user: "webmaster@farmlink.cn", // 账号
            pass: "mail951357fl" // 密码
        }
    });
// 设置邮件内容
    var mailOptions = {
        from: "fl", // 发件地址
        to: "zhangyifei@farmlink.cn", // 收件列表
        subject: "Hello world", // 标题
        html: "<b>thanks a for visiting!</b> 世界，你好！" // html 内容
    }
// 发送邮件
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
        smtpTransport.close(); // 如果没用，关闭连接池
    });
}

function call(response, request) {
    console.log(request.get);
    console.log(request.post);
    hc.getJson(config.api_host+'/dict/list?limit=10&offset=0&parent_id=0&access_token=', {'limit': 10, 'offset': 0, 'parent_id': 0}, function (res) {
        // sleep(10000);
        console.log(res);
        response.write('ok');
        response.end();

    });
    console.log('end');
}

function operatelog(response,request){
    response.write('ok');
    response.end();
    savelog('operate_log',request.post);
}

function errorlog(response,request){
    response.write('ok');
    response.end();
    savelog('error_log',request.post);
}


//9c118e668d4bd4cb
//{"n_builder_id":0,"n_title":"","n_content":"订单创建成功","n_extras":{"type":3,"content":"订单创建成功","url":"","action_id":"196","created_at":"2015-08-25 20:38:32","order_sn":"150825203832041627"},"type":3}
function push(response,request){
    response.write('ok');
    response.end();
    var type = request.post.type;
    var action_id = request.post.action_id;
    var title = request.post.title;
    var success;
    var deviceToken = request.post.deviceToken;
    var client = jpush.buildClient(request.post.appkeys,request.post.masterSecret);
    client.push().setPlatform('android')
        .setAudience(jpush.alias(deviceToken))
        .setNotification(title,null, jpush.android(title, null, 1,{'type':type,'action_id':action_id}))
        //.setMessage('')
        .setOptions(null, 0)
        .send(function(err, res) {
            if (err) {
                success=0;
                console.log(err.message);
            } else {
                success=1;
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
            }
            var msg = { 'type': 'push', 'request':request.post,'response':res,'success':success};
            systemlog(msg);
        });
}

//function dealorder(response, request){
//    console.log(request.post);
//    response.write('ok');
//    response.end();
//    hc.post(config.api_host+'/order/dealorder', {'order_id':request.post.order_id,'city':request.post.city}, function (res) {
//        // sleep(10000);
//        console.log(res);
//        r = eval('(' + res + ')');
//        var success;
//        //报错则计入日志
//        if(r.errno==0){
//            success=1;
//        }
//        else{
//            success=0;
//        }
//        var msg = { 'type': 'dealorder', 'request':request.post,'response':res,'success':success};
//        systemlog(msg);
//    });
//}

function asynmodel(response,request){
    console.log(request.post);
    response.write('ok');
    response.end();
    hc.post(config.api_host+'/model/arouse', request.post, function (res) {
        // sleep(10000);
        console.log(res);
        r = eval('(' + res + ')');
        var success;
        //报错则计入日志
        if(r.errno==0){
            success=1;
        }
        else{
            success=0;
        }
        var msg = { 'type': 'asynmodel', 'request':request.post,'response':res,'success':success};
        systemlog(msg);
    });
}


function sendsms(response, request) {
    response.write('ok');
    response.end();

    var mobile = request.post.mobile;
    var msg = request.post.msg;
    var type = request.post.type;

    console.log(msg);
    console.log(mobile);
    if(type){
        var ac ='Liannhd2';
        var pwd='liannong!@#$1234';
    }
    else{
        var ac ='Liannhd';
        var pwd='Txb123456';
    }

    var s = {'account': ac, 'pswd': pwd, 'mobile': mobile, 'msg': msg};
    console.log('发送' + s);
    hc.post('http://222.73.117.158/msg/HttpBatchSendSM?', s, function (resp) {
        var res = resp.split(',');
        var success=0;
        console.log('返回' + res);
        if (res[1] != '0') {
            console.log('错误码' + res[1]);
            success =0;
            //插入报错系统
        }
        else {
            console.log('发送成功');
            success =1;
            //插入日志
        }
        var msg = { 'type': 'sms', 'request':request.post,'response':res,'success':success};
        systemlog(msg);


    });
}


function start(response, request) {
    console.log("Request handler 'start' was called.");

//    exec("find /",
//        { timeout: 10000, maxBuffer: 20000*1024 },
//        function (error, stdout, stderr) {
//
//            response.write(stdout);
//            response.end();
//        });
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" ' +
        'content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name=""upload>' +
        '<input type="submit" value="Upload1111" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "/zyf/test.jpg");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });

}

function show(response, request) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/zyf/test.jpg", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}
exports.test = test;
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.call = call;
exports.sendsms = sendsms;
exports.mail = mail;
exports.asynmodel = asynmodel;
exports.push = push;
exports.operatelog= operatelog;
exports.errorlog= errorlog;

exports.main = main;
