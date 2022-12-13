let jwt = require('jsonwebtoken');

function creareTokens(userName, hashedPassword){
    let accessToken = jwt.sign({
        login: userName,
        token_type: 'access'
    }, 'secret-jwt-key', {expiresIn: '1h'});

    let refreshToken = jwt.sign({
        userName: userName,
        token_type: 'refresh',
        password: hashedPassword
    }, 'secret-jwt-key', {expiresIn: '30d'});
    return [accessToken, refreshToken];
}

function createAccessToken(req){
    let accessToken = jwt.sign({
        userName: req.body.userName,
        token_type: 'access'
    }, 'secret-jwt-key', {expiresIn: '1h'});
    return accessToken
}

// module.exports.createAccessToken = createAccessToken;
module.exports.createTokens = creareTokens;
