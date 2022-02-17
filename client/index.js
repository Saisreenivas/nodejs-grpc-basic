var grpc = require('@grpc/grpc-js');
var PROTO_PATH = __dirname + '/proto_files/greet.proto';
var protoLoader = require('@grpc/proto-loader');


async function bindServer(server, url, creds) {
    return new Promise((resolve, reject) => {
        server.bindAsync(url, creds, (err, port) => {
            if (err) reject(err);
            console.log("binded to port: " + port);
            resolve(port);
        })
    })
}

async function main() {
    // dynamic proto loader
    var packageDefinition = protoLoader.loadSync(
        PROTO_PATH,
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
    var greetproto = grpc.loadPackageDefinition(packageDefinition).greet;
    console.log('Prototypes loaded');


    const client = new greetproto.GreetService('0.0.0.0:50053', grpc.credentials.createInsecure());

    client.Greet({ greeting: { first_name: "Sai" } }, (error, response) => {
        if (error) throw error
        console.log('Message received from Server: ', response);
    })


}

main();