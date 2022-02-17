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

    // services to function execution logic executer
    var server = new grpc.Server();
    server.addService(greetproto.GreetService.service, {
        Greet: (call, callback) => {
            console.log('\nCalled Greet Method with input payload: ', call.request);

            // logging input metadata.
            console.log("input metadata: ", call.metadata.toJSON());

            // send custom metadata
            var metadata = new grpc.Metadata();
            metadata.set('key1', 'value1');
            metadata.add('key1', 'value2');
            call.sendMetadata(metadata);

            // response payload
            var reply = { result: 'Hello ' + call.request.greeting.first_name };
            return callback(null, reply);
        }
    });
    console.log('Services Added');

    // defining the host, port and server creds for server
    const port = await bindServer(server, '0.0.0.0:50053', grpc.ServerCredentials.createInsecure())

    // starting the server
    server.start();
    console.log('Server is running in port: ' + port);
}

main();