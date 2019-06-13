var passport = require('passport')
var localStrategy = require('passport-local').Strategy
var JWTstrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
var UserModel = require('../models/user')

// Registo de um utilizador
passport.use('register', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try{
        var user = await UserModel.create({email, password})
        return done(null, user, {message: 'Successful registration.'})
    }
    catch(error){
        return done(new Error('User allready registed.'), false, {message: 'User allready registed.'})
    }
}))

// Login de utilizadores
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (em, pass, done) => {
    try{
        var user = await UserModel.findOne({email: em})
        if(!user) 
            return done(new Error('Non-existent User.'), false, {message: 'Non-existent User.'})
        var valid = await user.isValidPassword(pass)
        if(!valid)
            return done(new Error('Invalid password.'), false, {message: 'Invalid password.'})
        return done(null, user, {message: 'Login done successfully.'})
    }
    catch(error){
        return done(error)
    }
}))

//configurar a serialização do utilizador
passport.serializeUser((user, done)=>{
    done(null, user.email)
 })
  
passport.deserializeUser(function(user, done) {
    UserModel.findOne({email : user.email}, function(err, user) {
        if (err) done(err, null);
        done(null, user)
    })
})

var extractFromSession = (req) => {
    var token = null
    if(req && req.session) token = req.session.token
    if(!token && req.headers.authorization) token = req.headers.authorization
    return token
}

passport.use('protegida', new JWTstrategy({
    secretOrKey: 'faceMarketIS',
    jwtFromRequest: ExtractJWT.fromExtractors([extractFromSession]),
}, async (token, done) => {
    try{
        return done(null, token.user)
    }
    catch(error){
        return done(error)
    }
}))