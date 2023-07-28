const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/summary").post(async (req, res) => {
    //Querying Car IDs
    const summary = await client.query(
        `select sum(total) as total_sum, sum(coverage) as total_coverage from part_summary_info`
    );
    //Results can be exported
    var summaryVal = {};
    summaryVal.maker = summary.rows[0].total_sum;
    summaryVal.coverage = summary.rows[0].total_coverage;
    summaryVal.coverage_rate = (summaryVal.coverage / summaryVal.maker).toFixed(
        2
    );

    console.log(summaryVal);

    res.json({ summary: summaryVal });
});

module.exports = router;
