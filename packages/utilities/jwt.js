const jwt = require("jsonwebtoken");


exports.createToken = (user_id) => {
    const token = jwt.sign(
        {user_id},
        process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES_IN || "7days"
        }
    )
    return token
}

exports.parseToken = (req) => {
    const token = req.headers["token"]
    let data = jwt.decode(token, {secretKey: process.env.SECRET})
    return data
}