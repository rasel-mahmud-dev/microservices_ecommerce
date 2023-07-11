const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connectDatabase = require("../database");

const packageDefinition = protoLoader.loadSync('protos/product.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;


// Implement the gRPC service methods
const productService = {
    GetProduct: function (call, callback) {
        const request = call.request;
        // Implement the logic to get the product based on the request
        // Example: retrieve the product from the database or perform other operations
        // ...

        const product = {
            id: request.id,
            name: 'Sample Product',
            description: 'This is a sample product',
            price: 9.99
        };

        const response = {
            product: product
        };

        callback(null, response);

    },
    ListProducts: async function (call, callback) {
        const request = call.request;

        /** get product by given ids */


        try{
            const client = await connectDatabase()
            const placeholders = request.productIds.map((_, index)=> `$${index + 1}`).join(", ")
            const sql = `select title, description, price, image, product_id from products where product_id IN (${placeholders})`
            let result = await client.query(sql, request.productIds)

            const response = {
                products: result.rows
            };

            callback(null, response);

        } catch (ex){
            callback(ex, null);
        }


    }
};

// Create a new gRPC server
const server = new grpc.Server();

// Add the cart service to the server
server.addService(productProto.ProductService.service, productService);


// Start the gRPC server
server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind gRPC server:', err);
        return;
    }
    console.log('gRPC product server running at http://0.0.0.0:' + port);
    server.start();
});


// const grpcClient = new productProto.ProductService('http://0.0.0.0:50053', grpc.credentials.createInsecure());

//
// // Create the gRPC client
// const client = new productProto.ProductService('0.0.0.0:50053', grpc.credentials.createInsecure());
//
// // Define the request message
// const request = {
//     page_size: 10,
//     page_number: 1
// };
//
// // Make the gRPC call to list the products
// client.ListProducts(request, (error, response) => {
//     if (error) {
//         console.error('Error:', error.message);
//         return;
//     }
//
//     const products = response.products;
//     console.log('List of Products:', products);
//
// });