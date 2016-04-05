var http = require("http");
var url = require("url");
var qs = require("querystring");

function start(route,handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("start action : " + pathname );
        request['get']= qs.parse(url.parse(request.url).query);

        if(request.method == "GET"){
            route(handle, pathname, response, request);
        }
        else if(request.method == "POST"){
        // 设置接收数据编码格式为 UTF-8
            request.setEncoding('utf-8');
            var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
            // 数据块接收中
            request.addListener("data", function (postDataChunk) {
                postData += postDataChunk;
            });
            // 数据接收完毕，执行回调函数
            request.addListener("end", function () {
                console.log('数据接收完毕');
                request['post'] = eval('(' + qs.parse(postData).data+ ')');

                route(handle, pathname, response, request);
            });
        }
    }

    http.createServer(onRequest).listen(8848);
    console.log("Server has started.");
}

exports.start = start;