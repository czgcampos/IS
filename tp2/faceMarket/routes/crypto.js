var express = require('express');
var router = express.Router();
var axios = require('axios');
const moment = require('moment');
var passport = require('passport');

const API_KEY = '&api_key={031d68b9a5d59bce09ffa82ef258b56f97a125a7aebd7ba266e3583035ad3ed6}';

/* GET home page. */
router.get('/', passport.authenticate('protegida', {session: false,
        failureRedirect: '../signinup' 
    }), function(req, res) {
  axios.get('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD' + API_KEY)
    .then(resposta=> res.render('crypto', { answer: resposta.data.Data }))
    .catch(erro => {
      console.log('Erro ao fazer pedido a crypto.')
      res.render('error', {error: erro, message: "Erro ao fazer pedido a Cryptocompare."})
    })
});

/* GET Crypto Period. */
router.get('/:crypto/:period', passport.authenticate('protegida', {session: false,
        failureRedirect: '../../signinup' 
    }), function(req, res) {
  // get period
  var time_period
  switch (req.params.period) {
    case "hourly":
      time_period = 'histohour'
      break;
    case "daily":
      time_period = 'histoday'
      break;
    default:
      console.log("Período escolhido indisponível ou errado.")
      break;
  }

  axios.get('https://min-api.cryptocompare.com/data/' + time_period + '?fsym=' + req.params.crypto + '&tsym=USD&limit=50' + API_KEY)
    .then(resposta=> {
      var ans = resposta.data.Data
      // reverter lista
      ans = ans.reverse()      
      // modificar milisec para date
      ans.forEach(entry => entry.time = moment.unix(entry.time).format('YYYY-MM-DD H:mm:ss'));
      res.render('crypto-time', { crypto: req.params.crypto + ' ' + req.params.period, answer: ans })
    })
    .catch(erro => {
      console.log('Erro ao fazer pedido a commodity.')
      res.redirect('/crypto')
      //res.render('error', {error: erro, message: "Pedido não suportado."})
    })

});

module.exports = router;