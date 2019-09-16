
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const systemConfig = require(__pathConfig + 'system');
const authHelper = require(__pathHelper + 'auth');
const Response    = require(__pathHelper + 'response').Response;
const tokenList = {};

module.exports = (passport) => {
    router.post('/login', (req, res, next) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(new Response(true, 401, 'error', 'Username or password is incorrect'));
            }
            if (!user) {
                return res.status(401).json(new Response(true, 401, 'error', info.message));
            }
            req.logIn(user, (err) => {
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                };
                const jwtToken = jwt.sign(payload, systemConfig.jwtSecret, { expiresIn: systemConfig.tokenLife });
                const refresh_token = jwt.sign(payload, systemConfig.refreshTokenSecret, { expiresIn: systemConfig.refreshTokenLife })
                tokenList[refresh_token] = user;
                const result = [{
                    access_token: jwtToken,
                    refresh_token: refresh_token
                }]
                return res.status(200).json(new Response(false, 200, 'success', 'Login success', result));
            });
        })(req, res, next);
    });
    router.post('/refresh_token', async (req, res, next) => {
        const { refresh_token } = req.body;
        if ((refresh_token) && (refresh_token in tokenList)) {
            try {
                await authHelper.verifyJwtToken(refresh_token, systemConfig.refreshTokenSecret);
                const user = tokenList[refresh_token];
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                };
                const access_token = jwt.sign(payload, systemConfig.jwtSecret, {
                    expiresIn: systemConfig.tokenLife,
                });
                res.status(200).json(new Response(false, 200, 'success', 'Success', [{access_token}])); 
            } catch (err) {
                res.status(403).json(new Response(true, 403, 'error', 'Invalid refresh token'));
            }
        } else {
            res.status(400).json(new Response(true, 400, 'error', 'Invalid request'));
        }
    })
    router.post('/logout', async (req, res, next) => {
        const { refresh_token } = req.body;
        if ((refresh_token) && (refresh_token in tokenList)) {
            try {
                await authHelper.verifyJwtToken(refresh_token, systemConfig.refreshTokenSecret);
                delete tokenList[refresh_token];
                res.status(200).json(new Response(false, 200, 'success', 'Logout success')); 
            } catch (err) {
                res.status(403).json(new Response(true, 403, 'error', 'Invalid refresh token'));
            }
        } else {
            res.status(400).json(new Response(true, 400, 'error', 'Invalid request'));
        }
    })
    return router;
}

