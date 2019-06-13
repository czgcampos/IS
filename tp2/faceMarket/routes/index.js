var express = require('express');
var router = express.Router();
var axios = require('axios');
var jwt = require('jsonwebtoken')
var passport = require('passport');

/* GET home page. */
router.get('/', passport.authenticate('protegida', {session: false,
        failureRedirect: '/signinup' 
    }), (req, res) => {
	res.render('index');
});

router.post('/search', passport.authenticate('protegida', {session: false,
        failureRedirect: '/signinup' 
    }), (req, res) => {
        if(req.body.market==='crypto'){
            res.redirect('/'+req.body.market+'/'+req.body.crypto+'/'+req.body.periodicity)
        }else if(req.body.market==='commodity'){
            res.redirect('/'+req.body.market+'/'+req.body.commodity+'/'+req.body.periodicity)
        }else if(req.body.market==='forex'){
            res.redirect('/'+req.body.market+'/'+req.body.forex1+'/'+req.body.forex2+'/'+req.body.periodicity)
        }else if(req.body.market==='stock'){
            res.redirect('/'+req.body.market+'/'+req.body.stock+'/'+req.body.periodicity)
        }
});

/* Sign in or Sign up */
router.get('/signinup', (req, res) => {
	res.render('signinup');
});

// Login de um utilizador
router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {     
        try {
            if(err || !user)
                next(err);
            req.login(user, {session: false}, async (error) => {
                if(error) return next(error)
                const myuser = {_id: user._id} 
                const token = jwt.sign({user: myuser}, 'faceMarketIS')
                req.user.token = token
                req.session.token = token
                res.redirect('/')
            });     
        } 
        catch (error) {
            return next(error);
        }
    })(req, res, next);
});

// Registo de um utilizador
router.post('/register', async (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {     
        try {
            if(err || !user)
                next(err);
            req.login(user, {session: false}, async (error) => {
                if(error) return next(error)
                const myuser = {_id: user._id} 
                const token = jwt.sign({user: myuser}, 'faceMarketIS')
                req.user.token = token
                req.session.token = token
                res.redirect('/')
            });     
        } 
        catch (error) {
            return next(error);
        }
    })(req, res, next);
});

router.get('/logout',(req,res) => {
    req.session.destroy()
    req.logout()
    res.redirect('/signinup')
})

module.exports = router;