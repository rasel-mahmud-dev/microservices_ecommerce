const jwt = require("jsonwebtoken")

async function auth(req, res, next) {
    try {
        const token = req.headers["token"]
        let data = jwt.decode(token, {secretKey: process.env.SECRET})

        if (!data) return next("Token expired, Please login first")
        req.user = {
            user_id: data.user_id
        }
        next()

    } catch (ex) {
        next("Unauthenticated, Please login first")
    }
}

module.exports = auth