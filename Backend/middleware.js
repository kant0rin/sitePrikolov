jwt = require('jsonwebtoken');

function checkToken(req, res, next){
    let token;
    try {
        token = req.body.accessToken || req.query.token || req.headers["x-access-token"];
    } catch (err) {
        return res.status(403).send("A token is required for authentication");
    }
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, 'secret-jwt-key');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports.checkToken = checkToken;