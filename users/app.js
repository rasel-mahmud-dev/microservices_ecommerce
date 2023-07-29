const express = require("express")
const cors = require("cors")
const router = require("./routes");

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



app.use("/users-service", router)

app.use((err, req, res, next)=>{
    res.status(500).send({
        message: typeof err === "string" ? err : err?.message
    })
})


const PORT = process.env.PORT || 1000
app.listen(PORT, () => console.log("Users service is running on port " + PORT))


connectDatabase().then(client=>{
    console.log("database connected")
    let t = readFileSync("sql/tables.sql")
    let result = client.query(t.toString())
}).catch(ex=>{
    console.log(ex.message)
})
