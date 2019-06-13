var express = require('express');
var router = express.Router();
var axios = require('axios');
var passport = require('passport');

const API_KEY = '&api_key=QY8zng_hFHyM3DEwWxiM';

/* GET home page. */
router.get('/', passport.authenticate('protegida', {session: false,
        failureRedirect: '../signinup' 
    }), function(req, res) {

  axios.all([
    // GOLD COMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_GC1/data.json?&limit=1&collapse=daily' + API_KEY),
    // SILVER COMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_SI1/data.json?&limit=1&collapse=daily' + API_KEY),
    // PLATINUM NYMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_PL1/data.json?&limit=1&collapse=daily' + API_KEY),
    // PALADIUM NYMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_PA1/data.json?&limit=1&collapse=daily' + API_KEY),
    // COPPER COMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_HG1/data.json?&limit=1&collapse=daily' + API_KEY),
    // OIL NYMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_CL1/data.json?&limit=1&collapse=daily' + API_KEY),
    // NATURAL GAS NYMEX
    axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/CME_NG1/data.json?&limit=1&collapse=daily' + API_KEY)
  ])
  .then(axios.spread((r1,r2,r3,r4,r5,r6,r7) => {
    
    // add commodity name
    r1.data.dataset_data.data[0].unshift('Gold')
    r2.data.dataset_data.data[0].unshift('Silver')
    r3.data.dataset_data.data[0].unshift('Platinum')
    r4.data.dataset_data.data[0].unshift('Paladium')
    r5.data.dataset_data.data[0].unshift('Copper')
    r6.data.dataset_data.data[0].unshift('Oil')
    r7.data.dataset_data.data[0].unshift('Natural Gas')

    // concatenate both responses
    var target = [].concat(
                            r1.data.dataset_data.data,
                            r2.data.dataset_data.data,
                            r3.data.dataset_data.data,
                            r4.data.dataset_data.data,
                            r5.data.dataset_data.data,
                            r6.data.dataset_data.data,
                            r7.data.dataset_data.data
                          );

    res.render('commodity', { answer: target })
  }))
  .catch(erro => {
    console.log('Erro ao fazer pedido a commodity.')
    res.render('error', {error: erro, message: "Erro ao fazer pedido a Quandl."})
  });

});

/* GET Commodity Period. */
router.get('/:com/:period', passport.authenticate('protegida', {session: false,
        failureRedirect: '../../signinup' 
    }), function(req, res) {
  
  // filter wrong pediod
  if( req.params.period.localeCompare("daily") != 0 &&
      req.params.period.localeCompare("weekly") != 0 &&
      req.params.period.localeCompare("monthly") != 0  ) 
  {
    return res.redirect('/commodity')
  }

  // get commodity
  var com
  if(req.params.com.localeCompare("Gold") == 0) {
    com = 'CME_GC1'
  }
  else if(req.params.com.localeCompare("Silver") == 0) {
    com = 'CME_SI1'
  }
  else if(req.params.com.localeCompare("Platinum") == 0) {
    com = 'CME_PL1'
  }
  else if(req.params.com.localeCompare("Paladium") == 0) {
    com = 'CME_PA1'
  }
  else if(req.params.com.localeCompare("Copper") == 0) {
    com = 'CME_HG1'
  }
  else if(req.params.com.localeCompare("Oil") == 0) {
    com = 'CME_CL1'
  }
  else if(req.params.com.localeCompare("Natural Gas") == 0) {
    com = 'CME_NG1'
  }

  axios.get('https://www.quandl.com/api/v3/datasets/CHRIS/' + com + '/data.json?&limit=50&collapse=' + req.params.period + API_KEY)
    .then(resposta=> {
      res.render('commodity-time', { commodity: req.params.com + ' ' + req.params.period, answer: resposta.data.dataset_data.data })
    })
    .catch(erro => {
      console.log('Erro ao fazer pedido a commodity.')
      return res.redirect('/commodity')
      //res.render('error', {error: erro, message: "Erro ao fazer pedido a Quandl."})
    })

});

module.exports = router;
