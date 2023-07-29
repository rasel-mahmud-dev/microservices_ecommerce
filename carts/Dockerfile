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
# Copy the shared proto files
#COPY protos /app/protos

# Copy the shared proto files from the Docker volume
#COPY --from=proto-volume:/proto-files /app/protos /app/protos

# Generate gRPC client and server code
RUN npm install -g grpc-tools
RUN grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:./cart \
  --grpc_out=./cart \
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
  ./protos/cart.proto

# Copy the service code
#COPY cart/ ./

# Expose the  port
EXPOSE 1004


