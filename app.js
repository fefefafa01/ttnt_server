// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var express = require("express");
const app = express();
var cors = require("cors");
const helmet = require("helmet");
const { Server } = require("socket.io");
const session = require("express-session");
require("dotenv").config();

    //Routers
var authRouter = require("./routes/authRouter"); //Added Authentication Router
var searchRouter = require("./routes/searchRouter"); //Added Searching Router
const logger = require("./routes/logger"); //Added Logger
var profileRouter = require("./routes/profileRouter"); //Added Profile Router
var pdfRouter = require("./routes/pdfRouter"); //Added PDF Parts Detail Router
var downloadRouter = require("./routes/downloadRouter") //Added Downloading Router
var tableRouter = require("./routes/tableRouter");

/**
 * Create HTTP server.
 */

const server = require("http").createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: "true",
    },
});

/**
 * Routing and create Session
 */

app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json({ strict: false }));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        credentials: "true",
        name: "sid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.ENVIROMENT === "production",
            httpOnly: true,
            sameSite: process.env.ENVIROMENT === "production" ? "none" : "lax",
        },
    })
);
app.use("/auth", authRouter); // Auth Router
app.use("/sch", searchRouter); //Search Router
app.use("/exp", pdfRouter); //Details and PartList Router
app.use("/prof", profileRouter); //Profile Router
app.use ("/down", downloadRouter) //Download Router
app.use("/table", tableRouter); //Table Router

/**
 * Listen on provided port, on all network interfaces.
 */
io.on("connect", (socket) => {});
server.listen(5000, () => {
    logger.dlogger.log("info", "Server is listening on 5000");
});

// view engine setup
var indexRouter = require("./routes/index");
const { signedCookie } = require("cookie-parser");
app.set("view engine", "jade");
app.use("/", indexRouter);

// app.use(logger('dev'));
module.exports = app;
