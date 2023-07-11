const express = require("express");
const dbLogger = require("./loggers.js");
const router = express.Router();
const client = require("./connectdb");

router.route("/result").post(async (req, res) => {
    // if(req.body.aisin_part_name != NULL){
    //     if(req.body.aisin_part_code != NULL){
    //         if(req.body.aisin_premium_code != NULL){
    //             if(req.body.competitor_part_code != NULL){
    //         }
    //     }
    // }
    // const existingCompetitor = await client.query(
    //     "SELECT * from part_name_mapping WHERE is_active = true AND part_code IS NOT NULL"
    // );
});

module.exports = router;
