var Client = require('mysql').Client;
var client = new Client();
client.host = 'localhost';
client.port = 3306;
client.user = 'root';
client.password = 'root123';
client.database='test';

query(client);

function query(client){
    client.query(
        'select * from userinfo',
        function(err,res,fields){
            console.log(res);
            client.end();
        }
    );
};