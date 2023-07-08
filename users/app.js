const express = require("express")

const app = express()




app.get("/api/users", (req, res, next)=>{
    res.send("users sd sdf")
})


app.get("/api/users/:userId", (req, res, next)=>{
    res.send(req.params.userId + " single user")
})

app.get("/api/users/create", (req, res, next)=>{
    res.send("regisas sd sdf")
})


app.listen(1000, ()=>console.log("User service is running on port 1000"))

