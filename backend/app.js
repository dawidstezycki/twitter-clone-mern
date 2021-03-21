const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const config = require('./utils/config');
const userRouter = require('./components/user/userRouter');
const micropostRouter = require('./components/micropost/micropostRouter');
const loginRouter = require('./components/user/loginRouter');
const relationshipRouter = require('./components/relationship/relationshipRouter');

const app = express();

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('DB Connected!');
  })
  .catch((err) => {
    logger.error(`${err}`);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users', userRouter);
app.use('/api/microposts', micropostRouter);
app.use('/api/relationships', relationshipRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
