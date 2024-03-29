var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var mongoose = require('mongoose')
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

require('./auth/auth')

var indexRouter = require('./routes/index');
var cryptoRouter = require('./routes/crypto');
var stockRouter = require('./routes/stock');
var forexRouter = require('./routes/forex');
var commodityRouter = require('./routes/commodity');

var app = express();

// Base de Dados
const config = {
	autoIndex: false,
	useNewUrlParser: true,
};

mongoose
	.connect('mongodb://127.0.0.1:27017/faceMarket',config)
	.then(() => console.log('Mongo ready: ' + mongoose.connection.readyState))
	.catch(erro => console.log('Erro de conexão: ' + erro))

// Configuração da sessão
app.use(session({
	genid: () => {
		return uuid()
	},
	store: new FileStore(),
	secret: 'faceMarketIS',
	resave: false,
	saveUninitialized: true
}))

// Inicialização do passport
app.use(passport.initialize())
app.use(passport.session())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/crypto', cryptoRouter);
app.use('/stock', stockRouter);
app.use('/forex', forexRouter);
app.use('/commodity', commodityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
