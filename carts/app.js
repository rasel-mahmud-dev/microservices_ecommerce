const express = require("express")
const router = require("./routes");
const cors = require("cors")
require("dotenv").config({})


const {readFileSync} = require("fs");
const connectDatabase = require("./database");

const app = express()

app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true)
    }
}))


app.use("carts-service", router)

app.use((err, req, res, next)=>{
    res.status(500).send({
        message: typeof err === "string" ? err : err?.message
    })
})


const PORT = process.env.PORT || 1004
app.listen(PORT, () => console.log("Cart service is running port " + PORT))


connectDatabase().then(client=>{
    console.log("database connected")
    let t = readFileSync("sql/tables.sql")
    let result = client.query(t.toString())
}).catch(ex=>{
    console.log(ex.message)
})
