const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

app.get("/", (req, res)=>{
    res.status(200).send("Welcome API Gateway")
})


app.all('/api/users/*', (req, res) => {
    proxy.web(req, res, { target: 'http://172.17.0.1:1000' });
});

app.all('/api/orders/*', (req, res) => {
    proxy.web(req, res, { target: 'http://172.17.0.1:1002' });
});


app.all('/api/products', (req, res) => {
    proxy.web(req, res, { target: 'http://172.17.0.1:1003' });
});

// Start the Express app
app.listen(80, () => {
    console.log('API Gateway listening on port 80');
});
