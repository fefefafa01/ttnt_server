const express = require("express");
const dbLogger = require("./loggers.js");
const router = express.Router();
const client = require("./connectdb");
const bcrypt = require("bcrypt");
const logger = require("./logger.js");

router
    .route("/login") 
    // .get(async (req, res) => {
    //     if (req.session.user && req.session.user.email) {
    //         res.json({ loggedIn: true, email: req.session.user.email });
    //       } else {
    //         res.json({ loggedIn: false });
    //       }
    //     })
    .post(async (req, res) => {
    dbLogger(req, res);
        const potentialLogin = await client.query(
            "SELECT * FROM users u WHERE u.email= $1", [req.body.email])
        //........//
        if (potentialLogin.rowCount > 0) {              
        //User Found, Checking Password
        const isSamePass = await bcrypt.compare(
            req.body.password, potentialLogin.rows[0].passhash)
            if (isSamePass) {
                //Login
                req.session.user = {
                    email: req.body.email,
                    id: potentialLogin.rows[0].id,
                }
                //Logging Accessed to account (U Minh)
                logger.dlogger.log("info", "Logged In");
                console.log('Logged In');
                res.json({ loggedIn: true, email: req.body.email }); //Replacable
            } else {
                //Invalid Password
                //Logger
                res.json({ loggedIn: false, status: "Wrong Email or Password" });
                console.log('Wrong Password');
                logger.dlogger.log("error", "Invalid Password");
            }
        } else {
            //Invalid Email
            //Logger
            res.json({ loggedIn: false, status: "Wrong Email or Password" });
            console.log('Wrong Email');
            logger.dlogger.log("error", "Invalid Email");
        }
    })

router.post("/reg", async (req, res) => {
    dbLogger(req, res);

    const existingUser = await client.query("SELECT email from users WHERE email=$1", 
    [req.body.email])

    if(existingUser.rowCount===0) {
        //reg
        console.log('Pre-Hashed')

        const hashedPass = await bcrypt.hash(req.body.password, 10);
        console.log('Hashed')
        const newUserQuery = await client.query(
            "INSERT INTO users(email, firstname, lastname, passhash) values ($1, $2, $3, $4) RETURNING email",
            [req.body.email, req.body.first_name, req.body.last_name, hashedPass]
        );
        console.log('Inserted')
        req.session.user = {
            email: req.body.email,
            id: newUserQuery.rows[0].id,
        }
        //Logging Accessed to account (U Minh)
        res.json({ loggedIn: true, email: req.body.email }); //Replacable
        logger.dlogger.log("info", "Account signed up successfully");
    } else {
        //Logging Error (U Minh)
        res.json({ loggedIn: false, status: "Email Taken" }); //Replacable with loggers
        logger.dlogger.log("error", "Email taken");
    }
});

router.post("/resetpwd", async (req, res) => {
  dbLogger(req, res);

  const existingUser = await client.query(
    "SELECT email from users WHERE email=$1",
    [req.body.email]
  );

  if (existingUser.rowCount > 0) {
    //reg
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newPasswordQuery = await client.query(
      "UPDATE users SET passhash = $1 WHERE email = $2",
      [hashedPass, req.body.email]
    );
    req.session.user = {
      email: req.body.email,
    };
    console.log(req.body.email);
    //Logging Accessed to account (U Minh)
    res.json({ loggedIn: true, email: req.body.email }); //Replacable
    console.log('Changed Pass');
    logger.dlogger.log("info", "Reset Password successfully");
  } else {
    //Logging Error (U Minh)
    res.json({ loggedIn: false, status: "Email not Valid" }); //Replacable with loggers
    console.log('Wrong Email');
    logger.dlogger.log("error", "Email not valid");
  }
});
module.exports = router;
