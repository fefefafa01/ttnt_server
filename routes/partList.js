const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.router("/partlist").post(async (req, res) => {
    var partGroup, partName, OE, APrem, ASubPrem;
    const qpartGroup = await client.query(
        "SELECT part_group_name FROM part_group WHERE part_group_id = $1",
        [req.body]
    );
});
