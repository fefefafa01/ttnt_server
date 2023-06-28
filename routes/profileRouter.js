const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router
    .route("/info")
    .post(async (req, res) => {
        var firstname, lastname, role
        const qfirstname = await client.query(
            "SELECT firstname FROM ms_user WHERE username = $1", [req.body]
        )
        const qlastname = await client.query(
            "SELECT lastname FROM ms_user WHERE username = $1", [req.body]
        )
        const qrole = await client.query(
            "SELECT role_id FROM ms_user WHERE username = $1", [req.body]
        )
        if (qrole.rows[0].role_id===null || qrole.rows[0].role_id === 0) {
            role = "Viewer"
        } else {
            role = "Admin"
        }
        firstname = qfirstname.rows[0].firstname
        lastname = qlastname.rows[0].lastname
        res.json({ firstname: {firstname}, lastname: {lastname}, roleid: {role}})
        logger.dlogger.log("info", "User Profile Seen")
    })

module.exports = router;