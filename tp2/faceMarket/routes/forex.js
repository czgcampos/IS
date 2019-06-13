var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');

API_KEY = '&apikey=STKRW67RG4VYBDMK'

/* GET Pair Period. */
router.get('/:fst/:snd/:period', passport.authenticate('protegida', {session: false,
        failureRedirect: '../../../signinup' 
    }), function(req, res) {
  var time_period
  
  if(req.params.period.localeCompare("hourly") == 0){
      
      axios.get('https://www.alphavantage.co/query?function=FX_INTRADAY&from_symbol='+req.params.fst+'&to_symbol='+req.params.snd+'&interval=60min&outputsize=compact' + API_KEY)
      .then(resposta=> res.render('forex', { answer: resposta.data }))
      .catch(erro => {
        console.log('Erro ao fazer pedido a forex.')
        res.render('error', {error: erro, message: "Erro ao fazer pedido a Alphavantage."})
      })


  }else{

      if(req.params.period.localeCompare("daily") == 0){
        time_period = "FX_DAILY"
        
      }else
      if(req.params.period.localeCompare("weekly") == 0){
        time_period = "FX_WEEKLY"
        
      }else
      if(req.params.period.localeCompare("monthly") == 0){
        time_period = "FX_MONTHLY"
        
      }
    
      axios.get('https://www.alphavantage.co/query?function=' + time_period + '&from_symbol=' + req.params.fst + '&to_symbol=' + req.params.snd + API_KEY)
        .then(resposta=> {
          res.render('forex', { answer: resposta.data })
        })
        .catch(erro => {
          console.log('Erro ao fazer pedido a forex.')
          res.render('error', {error: erro, message: "Erro ao fazer pedido a Alphavantage."})
        })
     
  }
  
});

module.exports = router;
