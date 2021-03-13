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

const app = express();

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((res) => {
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
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

module.exports = { app, server };
