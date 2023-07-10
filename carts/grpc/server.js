const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('protos/cart.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const cartProto = grpc.loadPackageDefinition(packageDefinition).cart;

// Implement the gRPC service methods
const cartService = {
    AddToCart: function (call, callback) {
        const request = call.request;
        // Implement the logic to add the item to the cart based on the request
        // Example: save the item to the database or perform other operations
        // ...

        const response = {
            success: true,
            message: 'Item added to cart successfully'
        };

        callback(null, response);
    }
};

// Create a new gRPC server
const server = new grpc.Server();

// Add the cart service to the server
server.addService(cartProto.CartService.service, cartService);

// Start the gRPC server
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind gRPC server:', err);
        return;
    }
    console.log('gRPC server running at http://0.0.0.0:' + port);
    server.start();
});