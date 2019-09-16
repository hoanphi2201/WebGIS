const usersModel = require(__pathModels + 'users');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
    passport.use('local-login', new LocalStrategy({
        usernameField: `username`,
        passwordField: `password`,
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick( async () => {
                const user = await usersModel.compareUserLogin(username).then((user) => {
                    return user;
                });
                if (!user) {
                    return done(null, false,  { message: 'Username or password is incorrect' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Username or password is incorrect' });
                }
                
                return done(null, user);
            })
        })
    );
};