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
            "SELECT * FROM MS_User WHERE Username= $1",
            [req.body.email]
        );
        //........//
        if (potentialLogin.rowCount > 0) {
            //User Found, Checking Password
            const isSamePass = await bcrypt.compare(
                req.body.password,
                potentialLogin.rows[0].password
            );
            if (isSamePass) {
                //Login
                req.session.user = {
                    email: req.body.email,
                    id: potentialLogin.rows[0].id,
                };
                //Logging Accessed to account (U Minh)
                logger.dlogger.log("info", "Logged In");
                console.log("Logged In");
                // const userRoleID = await client.query(
                //     "SELECT Rold_Id FROM MS_User WHERE email= $1", [req.body.email]
                // )
                // const userRole = await client.query(
                //     "SELECT Role_Name FROM MS_Roles WHERE Role_Id= $1", [userRoleID]
                // )
                // if (userRole==='Admin') {
                //     res.json({ loggedIn: true, email: req.body.email, status:'Admin User'})
                // } else if (userRole==='Viewer') {
                //     res.json({ loggedIn: true, email: req.body.email, status:'Viewer User'})
                // }
                res.json({ loggedIn: true, email: req.body.email }); //Replacable
            } else {
                //Invalid Password
                //Logger
                res.json({ loggedIn: false, status: "Wrong Password" });
                console.log("Wrong Password");
                logger.dlogger.log("error", "Invalid Password");
            }
        } else {
            //Invalid Email
            //Logger
            res.json({ loggedIn: false, status: "Wrong Email" });
            console.log("Wrong Email");
            logger.dlogger.log("error", "Invalid Email");
        }
    });

router.post("/reg", async (req, res) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    dbLogger(req, res);
    if (!req.body.first_name || !req.body.last_name) {
        res.json({ loggedIn: false, status: "Name must not be empty" });
        return;
    } else if (!regex.test(req.body.email) || !req.body.password) {
        res.json({ loggedIn: false, status: "Invalid Email or Password" });
        return;
    }
    console.log("Passed");
    const existingUser = await client.query(
        "SELECT Username from MS_User WHERE Username=$1",
        [req.body.email]
    );
    if (existingUser.rowCount === 0) {
        //reg
        console.log("Pre-Hashed");
        if (req.body.password !== req.body.confpassword) {
            res.json({ loggedIn: false, status: "Password Unmatched" });
            logger.dlogger.log("info", "Password Unmatch");
            console.log("Password Unmatch");
        } else {
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            console.log("Hashed");
            const latestID = await client.query(
                "SELECT user_id FROM ms_user"
            )
            const newUserQuery = await client.query(
                "INSERT INTO MS_User(user_id, Username, Firstname, Lastname, Password) values ($1, $2, $3, $4, $5) RETURNING Username",
                [
                    ((latestID.rowCount)+1),
                    req.body.email,
                    req.body.first_name,
                    req.body.last_name,
                    hashedPass,
                ]
            );
            console.log("Inserted");
            req.session.user = {
                email: req.body.email,
                id: newUserQuery.rows[0].id,
            };
            //Logging Accessed to account (U Minh)
            res.json({
                loggedIn: false,
                email: req.body.email,
                status: "Registered",
            }); //Replacable
            logger.dlogger.log("info", "Account signed up successfully");
            console.log("Registered");
        }
    } else {
        //Logging Error (U Minh)
        res.json({ loggedIn: false, status: "Email Taken" }); //Replacable with loggers
        logger.dlogger.log("error", "Email taken");
        console.log("Email Taken");
    }
});

router.post("/resetpwd", async (req, res) => {
    dbLogger(req, res);

    const existingUser = await client.query(
        "SELECT Username from ms_user WHERE Username=$1",
        [req.body.email]
    );
    if (existingUser.rowCount > 0) {
        if (req.body.password !== req.body.confpassword) {
            res.json({ loggedIn: false, status: "Password Unmatched" });
            logger.dlogger.log("info", "Password Unmatch");
            console.log("Password Unmatch");
        } else {
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            const newPasswordQuery = await client.query(
                "UPDATE ms_user SET Password = $1 WHERE Username = $2",
                [hashedPass, req.body.email]
            );
            req.session.user = {
                email: req.body.email,
            };
            console.log(req.body.email);
            //Logging Accessed to account (U Minh)
            res.json({
                loggedIn: false,
                email: req.body.email,
                status: "Changed Pass",
            }); //Replacable
            console.log("Changed Pass");
            logger.dlogger.log("info", "Reset Password successfully");
        }
    } else {
        //Logging Error (U Minh)
        res.json({ loggedIn: false, status: "Email Unavailable" }); //Replacable with loggers
        console.log("Email Unavailable");
        logger.dlogger.log("error", "Email Unavailable");
    }
});
module.exports = router;
