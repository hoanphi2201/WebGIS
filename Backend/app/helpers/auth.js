var jwt = require('jsonwebtoken');
const systemConfig = require(__pathConfig + 'system');
const usersModel = require(__pathModels + 'users');
const Response    = require(__pathHelper + 'response').Response;

module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.headers && req.headers.authorization) {
            var jwtToken = req.headers.authorization;
            jwt.verify(jwtToken, systemConfig.jwtSecret, async (err, payload) => {
                if (err) {
                    res.status(401).json(new Response(true, 401, 'error', `Failed to authenticate with token.`));
                } else {
                    const user = await usersModel.compareUserLogin(payload.username).then((user) => {
                        return user;
                    })
                    if (user) {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).json(new Response(true, 401, 'error', `Failed to authenticate with token.`));
                    }
                }
            });
        } else {
            res.status(401).json(new Response(true, 403, 'error', `No token provided.`));
        }
    },
    verifyJwtToken: (token, secretKey) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
}