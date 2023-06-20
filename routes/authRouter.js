const express = require("express");
const dbLogger = require('./loggers.js')
const router = express.Router();
const client = require('./connectdb')
const bcrypt = require('bcrypt')

router
    .route("/login") 
    .get(async (req, res) => {
        if (req.session.user && req.session.user.email) {
            res.json({ loggedIn: true, email: req.session.user.email });
          } else {
            res.json({ loggedIn: false });
          }
        })
    .post(async (req, res) => {
    dbLogger(req, res);

    const potentialLogin = await client.query(
        "SELECT id, email, passhash FROM users u WHERE u.email=$1", [req.body.email])

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
            res.json({loggedIn: true, email: req.body.email}) //Replacable
        } else {
            //Invalid Password
            //Logger
            res.json({loggedIn: false, status: "Wrong Email or Password"})
            console.log("User Invalid");
        }
    } else {
        //Invalid Email
        //Logger
        res.json({loggedIn: false, status: "Wrong Email or Password"})
    }

    
})

router.post("/reg", async (req, res) => {
    dbLogger(req, res);

    const existingUser = await client.query("SELECT email from users WHERE email=$1", 
    [req.body.email])

    if(existingUser.rowCount===0) {
        //reg
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await client.query(
            "INSERT INTO users(email, firstname, lastname, passhash) values ($1, $2, $3, $4) RETURNING email",
            [req.body.email, req.body.firstname, req.body.lastname, hashedPass]
        );
        req.session.user = {
            email: req.body.email,
            id: newUserQuery.rows[0].id,
        }
        //Logging Accessed to account (U Minh)
        res.json({loggedIn: true, emai: req.body.email}) //Replacable
    } else {
        //Logging Error (U Minh)
        res.json({loggedIn: false, status: 'Email Taken'}) //Replacable with loggers
    }
})

module.exports = router;