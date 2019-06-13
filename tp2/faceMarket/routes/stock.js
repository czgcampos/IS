var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');

API_KEY = '&apikey=STKRW67RG4VYBDMK'

/* GET home page. */
router.get('/:stock/:period', passport.authenticate('protegida', {session: false,
        failureRedirect: '../../signinup' 
    }), function(req, res) {
  var time_period
 
  if(req.params.period.localeCompare("hourly") == 0){
     
      axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+ req.params.stock +'&interval=60min&outputsize=compact' + API_KEY)
      .then(resposta=> res.render('stock', { answer: resposta.data }))
      .catch(erro => {
        console.log('Erro ao fazer pedido a stock.')
        res.render('error', {error: erro, message: "Erro ao fazer pedido a Alphavantage."})
      })
      
  }else{

      if(req.params.period.localeCompare("daily") == 0){
        time_period = "TIME_SERIES_DAILY"
       
      }else
      if(req.params.period.localeCompare("weekly") == 0){
        time_period = "TIME_SERIES_WEEKLY"
       
      }else
      if(req.params.period.localeCompare("monthly") == 0){
        time_period = "TIME_SERIES_MONTHLY"
       
      }
    
      axios.get('https://www.alphavantage.co/query?function=' + time_period + '&symbol=' + req.params.stock + API_KEY)
        .then(resposta=> res.render('stock', { answer: resposta.data }))
        .catch(erro => {
          console.log('Erro ao fazer pedido a stock.')
          res.render('error', {error: erro, message: "Erro ao fazer pedido a Alphavantage."})
        })

     
  }
  
});

module.exports = router;
