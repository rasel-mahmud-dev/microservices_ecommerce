# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app



COPY package*.json ./

# install npm dependency
RUN npm install

RUN npm install --save-dev nodemon

## Copy the enrire application code

COPY . .


# Define the command to run your app using npm
CMD ["npm", "start"]