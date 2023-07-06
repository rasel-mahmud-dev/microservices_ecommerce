const express = require("express")
const router = require("./routes");

const { Client } = require('pg')

const app = express()

app.use(router)

connectDatabase().then(client=>{
    client.query("select * from products")
})


const PORT = process.env.PORT || 1003
app.listen(PORT, () => console.log("Products service is running port " + PORT))

function connectDatabase(){
    return new Promise(async (resolve, reject)=>{
        try{
            const client = new Client({
                password: "12345",
                user: "rasel",
                database: "product_services",
                host: "0.0.0.0",
                port: 5432
            })
            await client.connect()

            resolve(client)

            // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
            // console.log(res.rows[0].message) // Hello world!
            // await client.end()

        } catch(ex){
            reject(ex)
        }
    })
}