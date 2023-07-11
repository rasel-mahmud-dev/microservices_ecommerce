# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app



COPY package*.json ./

# install npm dependency
RUN npm install

## Copy the enrire application code

COPY . .

# Copy the protobuf files
#COPY protos/product.proto ./protos/


# Generate gRPC client and server code
RUN npm install -g grpc-tools
RUN grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:./product \
  --grpc_out=./product \
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
  ./protos/product.proto

# Copy the service code
#COPY product/ ./

# Define the command to run your app using npm
CMD ["npm", "start"]

# Expose the  port
EXPOSE 1003