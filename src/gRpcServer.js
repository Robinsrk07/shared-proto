const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { authenticateUser } = require('./services/authService');

const PROTO_PATH = path.resolve(__dirname, '../protos/auth.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

function startServer() {
    const server = new grpc.Server();
    
    server.addService(authProto.AuthService.service, {
        AuthenticateUser: authenticateUser
    });

    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.error(error);
                return;
            }
            server.start();
            console.log(`Auth gRPC server running on port 50051`);
        }
    );
}
console.log("okay server.js running");

module.exports ={startServer}