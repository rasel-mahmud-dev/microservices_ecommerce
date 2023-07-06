const express = require("express")
const router = require("./routes");

const {readFileSync} = require("fs");
const connectDatabase = require("./database");

const app = express()

app.use(express.json())

app.use(router)

app.use((err, req, res, next)=>{
    res.status(500).send({
        message: typeof err === "string" ? err : err?.message
    })
})


const PORT = process.env.PORT || 1003
app.listen(PORT, () => console.log("Products service is running port " + PORT))


connectDatabase().then(client=>{
    let t = readFileSync("sql/product.sql")
    let result = client.query(t.toString())
})
