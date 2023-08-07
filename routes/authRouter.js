const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const bcrypt = require("bcrypt");
const logger = require("./logger.js");

router
    .route("/login")
    .post(async (req, res) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (req.body.email!=="" && regex.test(req.body.email) && req.body.password!=="") {
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
                    //Check firsttime
                    const firsttime = await client.query(
                        "SELECT firsttime_login FROM ms_user WHERE username = $1", [req.body.email]
                    )
                    if (firsttime.rows[0].firsttime_login===null || firsttime.rows[0].firsttime_login===false) {
                        const updater = await client.query (
                            "UPDATE ms_user SET firsttime_login=true WHERE Username = $1", [req.body.email]
                        )
                    }
                    //Login
                    req.session.user = {
                        email: req.body.email,
                        id: potentialLogin.rows[0].id,
                    };
                    logger.dlogger.log("info", "Logged In");
                    console.log("Login Status (authRouter.js): Logged In");
                    res.json({ loggedIn: true, email: req.body.email }); 
                } else {
                    //Invalid Password
                    //Logger
                    res.json({ loggedIn: false, status: "Wrong Password" });
                    console.log("Login Status (authRouter.js): Wrong Password");
                    logger.dlogger.log("error", "Invalid Password");
                }
            } else {
                //Invalid Email
                //Logger
                res.json({ loggedIn: false, status: "Wrong Email" });
                console.log("Login Status (authRouter.js): Wrong Email");
                logger.dlogger.log("error", "Invalid Email");
            }
        } else {
            logger.dlogger.log("error", "Invalid Input");
            res.status(422).send("Unprocessable Entity")
        }
    });

router.post("/reg", async (req, res) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const passregex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/
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
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            const latestID = await client.query(
                "SELECT user_id FROM ms_user ORDER BY user_id ASC"
            )
            if (latestID.rows[0].user_id!==1) {
                checkid = 1
            } else {
                for (let i = 0; i < latestID.rowCount; i++) {
                    if (i+1 < latestID.rowCount) {
                        if ((latestID.rows[i].user_id+1)!==latestID.rows[i+1].user_id) {
                            checkid = latestID.rows[i].user_id+1;
                            break;
                        }
                    } else {
                        checkid = latestID.rows[i].user_id+1;
                    }
                }
            }
            const newUserQuery = await client.query(
                `INSERT INTO MS_User(user_id, Username, Firstname, Lastname, Password, role_id, created_by, is_active, updated_by, firsttime_login) 
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING Username`,
                [
                    checkid,
                    req.body.email,
                    req.body.first_name,
                    req.body.last_name,
                    hashedPass,
                    3,
                    checkid,
                    true,
                    checkid,
                    false
                ]
            );
            console.log("Register Status (authRouter.js): Inserted Data. Chosen ID: ", checkid);
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
            console.log("Register Status (authRouter.js): Registered");
        } else {
            res.json({ loggedIn: false, status: "Email Taken" });
            logger.dlogger.log("error", "Email taken");
            console.log("Register Status (authRouter.js): Email Taken");
        }
    } else {
        logger.dlogger.log("error", "Invalid Input")
        res.status(422).send("Unprocessable Entity")
    }
});

router.post("/resetpwd", async (req, res) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    const passregex = /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}/
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
            //Current Time
            var date_ob = new Date();
            var day = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();
            var hours = date_ob.getHours();
            var minutes = date_ob.getMinutes();
            var seconds = date_ob.getSeconds();
            var milisecs = date_ob.getMilliseconds();
            var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milisecs;
            //Update Database
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            const newPasswordQuery = await client.query(
                "UPDATE ms_user SET Password = $1, updated_by = user_id, updated_date = $2 WHERE Username = $3",
                [hashedPass, dateTime, req.body.email]
            );
            req.session.user = {
                email: req.body.email,
            };
            res.json({
                loggedIn: false,
                email: req.body.email,
                status: "Changed Pass",
            }); //Replacable
            console.log("Reset Password Status (authRouter.js): Changed Pass");
            logger.dlogger.log("info", "Reset Password successfully");
        } else {
            res.json({ loggedIn: false, status: "Email Unavailable" });
            console.log("Reset Password Status (authRouter.js): Email Unavailable");
            logger.dlogger.log("error", "Email Unavailable");
        }
    } else {
        logger.dlogger.log("error", "Invalid Input")
        res.status(422).send("Unprocessable Entity")
    }
});
module.exports = router;