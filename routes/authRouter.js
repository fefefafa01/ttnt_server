const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const bcrypt = require("bcrypt");
const logger = require("./logger.js");

router
    .route("/login")
    .post(async (req, res) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (req.body.email!=="" && regex.test(req.body.email)) {
            const potentialLogin = await client.query(
                "SELECT * FROM MS_User WHERE Username= $1",
                [req.body.email]
            );

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
                    logger.dlogger.log("info", "Logged In");
                    console.log("Logged In");
                    res.json({ loggedIn: true, email: req.body.email }); 
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
        } else {
            logger.dlogger.log("error", "Invalid Input");
        }
    });

router.post("/reg", async (req, res) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const passregex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/
    // console.log(req.body)
    if (
        req.body.email!=="" && req.body.password!=="" && 
        req.body.first_name!=="" && req.body.lastname!=="" &&
        regex.test(req.body.email) && passregex.test(req.body.password) &&
        req.body.password === req.body.confpassword
    ) 
    {
        const existingUser = await client.query(
            "SELECT Username from MS_User WHERE Username=$1",
            [req.body.email]
        );
        if (existingUser.rowCount === 0) {
            //reg
            var checkid = 0;
            console.log("Pre-Hashed");
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            console.log("Hashed");
            const latestID = await client.query(
                "SELECT user_id FROM ms_user ORDER BY user_id ASC"
            )
            for (let i = 0; i < latestID.rowCount; i++) {
                if (i+1 < latestID.rowCount) {
                    if ((latestID.rows[i].user_id+1)!==latestID.rows[i+1].user_id) {
                        console.log(latestID.rows[i].user_id)
                        console.log(latestID.rows[i+1].user_id)
                        checkid = latestID.rows[i].user_id+1;
                        break;
                    }
                } else {
                    checkid = latestID.rows[i].user_id+1;
                }
            }
            console.log(checkid)
            const newUserQuery = await client.query(
                "INSERT INTO MS_User(user_id, Username, Firstname, Lastname, Password, role_id, created_by) values ($1, $2, $3, $4, $5, $6, $7) RETURNING Username",
                [
                    checkid,
                    req.body.email,
                    req.body.first_name,
                    req.body.last_name,
                    hashedPass,
                    3,
                    checkid,
                ]
            );
            console.log("Inserted");
            req.session.user = {
                email: req.body.email,
                id: newUserQuery.rows[0].id,
            };
            res.json({
                loggedIn: false,
                email: req.body.email,
                status: "Registered",
            }); 
            logger.dlogger.log("info", "Account signed up successfully");
            console.log("Registered");
        } else {
            res.json({ loggedIn: false, status: "Email Taken" });
            logger.dlogger.log("error", "Email taken");
            console.log("Email Taken");
        }
    } else {
        logger.dlogger.log("error", "Invalid Input")
    }
});

router.post("/resetpwd", async (req, res) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const passregex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/
    // console.log(req.body)
    if (
        req.body.email!=="" && req.body.password!=="" && 
        regex.test(req.body.email) && passregex.test(req.body.password) &&
        req.body.password === req.body.confpassword
    ) 
    {
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
                res.json({
                    loggedIn: false,
                    email: req.body.email,
                    status: "Changed Pass",
                }); //Replacable
                console.log("Changed Pass");
                logger.dlogger.log("info", "Reset Password successfully");
            }
        } else {
            res.json({ loggedIn: false, status: "Email Unavailable" });
            console.log("Email Unavailable");
            logger.dlogger.log("error", "Email Unavailable");
        }
    } else {
        logger.dlogger.log("error", "Invalid Input")
    }
});
module.exports = router;