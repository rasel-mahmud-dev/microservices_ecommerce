const express = require("express")
const {readFileSync} = require("fs");

const cors = require("cors")

const router = require("./routes")

const connectDatabase = require("@micro-service/utilities/connectDatabase");



const app = express()



app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true)
    }
}))


app.use("/orders-service", router)


app.use((err, req, res, next)=>{
    res.status(500).send({
        message: typeof err === "string" ? err : err?.message
    })
})

const PORT = process.env.PORT || 1005
app.listen(PORT, () => console.log("Order service is running on port " + PORT))

connectDatabase().then(client=>{
    console.log("database connected")
    let t = readFileSync("./table.sql")
    let result = client.query(t.toString())
}).catch(ex=>{
    console.log(ex.message)
})
