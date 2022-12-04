const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        // 401 -> בעיית אבטחה
        return res.status(401).json({ msg: "you must send token to this endpoint" })
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenSecret)
        req.tokenData = decodeToken;
        next()
    }
    catch (err) {
        return res.status(401).json({ msg: "Token invalid or expired" })
    }
}