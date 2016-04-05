function route(handle,pathname,response,request) {
//    console.log("About to route a request for " + pathname);
    //response.writeHead(200, {"Content-Type": "text/html"});
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response,request);
    } else {
        console.log("No request handler found for " + pathname);
        response.write("404 Not found");
        response.end();
    }
    console.log('end action');
}

exports.route = route;