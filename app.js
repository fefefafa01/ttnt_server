// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var express = require('express');
const app = express();
var cors = require('cors');
const helmet = require('helmet')
const { Server } = require('socket.io');
const session = require('express-session');
require('dotenv').config()
var authRouter = require('./routes/authRouter'); //Added Router Here

/**
 * Create HTTP server.
 */

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  }
})

/**
 * Routing and create Session
 */

app.use(helmet());
app.use(cors ({
  origin: "http://localhost:3000",
  credentials: "true",
  })
);

app.use(express.json())
app.use (session({
  secret:process.env.COOKIE_SECRET,
  credentials: 'true',
  name: "sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIROMENT === "production",
    httpOnly: true,
    sameSite: process.env.ENVIROMENT === "production" ? "none" : "lax",
    }
  }))
app.use('/auth', authRouter) // Auth Router

/**
 * Listen on provided port, on all network interfaces.
 */
io.on("connect", socket => {});
server.listen(5000, () => {
  console.log('Server is listening on 5000')
})


// view engine setup
var indexRouter = require('./routes/index');
const { signedCookie } = require('cookie-parser');
app.set('view engine', 'jade');
app.use('/', indexRouter);


// app.use(logger('dev'));
module.exports = app;
