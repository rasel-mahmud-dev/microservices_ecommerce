const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_FILE ='protos/product.proto';

const packageDefinition = protoLoader.loadSync(PROTO_FILE, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;


// Create the gRPC client
const productGRPCClient = new productProto.ProductService('172.20.0.5:50053', grpc.credentials.createInsecure());

module.exports = productGRPCClient