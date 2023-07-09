const connectDatabase = require("../database");
const router = require("express").Router()

const jwt = require("jsonwebtoken")


// get all users
router.get("/", async function (req, res, next) {
    let client = null
    try {
        client = await connectDatabase()
        let {rows} = await client.query(`
          select * from users
        `)
        res.send(rows)

    } catch (ex) {
        next(ex)
    }
})

// create account
router.post("/create", async function (req, res, next) {
    try {
        const {
            username,
            avatar = "",
            email,
            password
        } = req.body

        let client = await connectDatabase()

        let result = await client.query(`select user_id from users where email = $1`,
            [email]
        )

        if (result.rowCount) return next("User already registered")

        const sql = `insert into users(username, email, password, avatar) values ($1, $2, $3, $4) returning *`
        result = await client.query(sql, [username, email, password, avatar])

        if (result.rowCount) {
            let user = result.rows[0]
            return res.status(201).json({
                message: "User successfully register",
                user: user
            })
        }

        return next("user registration fail")

    } catch (ex) {
        next(ex)
    }
})

// login user
router.post("/login", async function (req, res, next) {
    try {
        const {
            email,
            password
        } = req.body

        let client = await connectDatabase()

        let result = await client.query(`select * from users where email = $1`,
            [email]
        )
        if (!result.rowCount) return next("You are not registered")

        let user = result.rows[0]
        if (user.password !== password) return next("Your password wrong")

        const token = jwt.sign({user_id: user.user_id}, process.env.SECRET, {expiresIn: "1min"})

        delete user["password"]

        res.status(200).json({
            token,
            user
        })

    } catch (ex) {
        next(ex)
    }
})

// auth re-validate
router.get("/validate", async function (req, res, next) {

    try {
        let client = await connectDatabase()

        const token = req.headers["token"]
        let data = jwt.decode(token, {secretKey: process.env.SECRET})

        if (!data) return next("Token expired, Please login first")

        let result = await client.query(`select user_id, username, avatar, email from users where user_id = $1`,
            [data.user_id]
        )

        if (!result.rowCount) return next("You are not registered")

        let user = result.rows[0]
        res.status(200).json({user})

    } catch (ex) {
        next(ex)
    }
})


module.exports = router