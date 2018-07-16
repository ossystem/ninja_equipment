const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./utils/config');
const session = require('./utils/session.js');
const statistics = require('./utils/statistics.js');

require('console-stamp')(console);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
if (config.cors && config.cors.enabled) {
  app.use(cors(config.cors));
}

app.use(session.verify);
app.use('/login', require('./app/login'));
app.use('/register', require('./app/register'));
app.use('/product', require('./app/product'));
app.use('/order', require('./app/order'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.log('err', err);
    res.status(err.status || 500);
    res.json(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  console.log('err', err);
  res.status(err.status || 500);
  res.json(err);
});

statistics();
// Check all approved bookings and send notification before 48 hours to start event
/*cron.schedule(config.cron.day.statistics, () => {
  statistics();
});*/

module.exports = app;
