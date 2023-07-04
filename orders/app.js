const express = require("express")

const app = express()

app.get("/api/orders", (req, res, next) => {
    res.send("order list asd asd asd  asd asd asd")
})

app.get("/api/orders/create", (req, res, next) => {
    res.send("create an order as")
})


app.listen(1001, () => console.log("Orders service is running port 1001"))

