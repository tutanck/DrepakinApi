const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { blue, green } = require('chalk');
const Sentry = require('@sentry/node');

const dotenv = require('dotenv');
dotenv.config();

require('express-async-errors'); // Global error handler

const usersRouter = require('./routes/users');
const centersRouter = require('./routes/centers');
const ratesRouter = require('./routes/ec_rates');
const commentsRouter = require('./routes/ec_comments');
const error_handlers = require('./middlewares/error-handlers');

// constants
const PORT = process.env.PORT;

const app = express();

if (['production', 'staging'].includes(process.env.NODE_ENV)) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });

  app.use(Sentry.Handlers.requestHandler()); // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.errorHandler()); // The error handler must be before any other error middleware

  console.log('====================================');
  console.log(
    '------------------------------------------> SENTRY:',
    process.env.SENTRY_DSN,
  );
  console.log('====================================');
}

// mount classic middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// expose static resources
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../build')));

// serve static client webapp
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// mount routers middlewares
app.use('/users', usersRouter);
app.use('/centers', centersRouter);
app.use('/comments', commentsRouter);
app.use('/rates', ratesRouter);

// mount error handlers middlewares
/* /!\ SHOULD ALLWAYS BE THE LAST MOUNT !!! */
Object.values(error_handlers).map(fn => app.use(fn));

// connect to mongoose
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', () => {
    console.log(green('Mongoose is connected to Mongodb.'));

    //launch Express
    app.listen(PORT);
    console.log(blue(`Express started on port ${PORT}..`));
  });
}

module.exports = app;
