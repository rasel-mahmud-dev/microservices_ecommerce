const {Client} = require("pg");

let client;

function connectDatabase() {
    return new Promise(async (resolve, reject) => {
        try {
            if (client && client._connected) {
                resolve(client)
            } else {

                const newClient = new Client({
                    password: "12345",
                    user: "rasel",
                    database: "product_services",
                    // host: "postgres",
                    host: "172.17.0.1",
                    port: 5432
                })

                await newClient.connect()
                client = newClient
                resolve(newClient)
            }

            // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
            // console.log(res.rows[0].message) // Hello world!
            // await client.end()

        } catch (ex) {
            reject(ex)
        }
    })
}


module.exports = connectDatabase