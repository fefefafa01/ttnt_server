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

router.route("/downoverall").post(async (req, res) => {
    var data = { sum: 0, coverage: 0, coverage_rate: 0 };
    if (
        //if no choose it will be all select
        (req.body.country_name.length === 0 || req.body.country_name === "") &&
        (req.body.manufacturer_name.length === 0 ||
            req.body.manufacturer_name === "") &&
        (req.body.transmission_type.length === 0 ||
            req.body.transmission_type === "") &&
        (req.body.part_group.length === 0 || req.body.part_group === "") &&
        (req.body.part_name.length === 0 || req.body.part_name === "")
    ) {
        const fullData = await client.query(
            `SELECT SUM(total) AS total_sum, SUM(coverage) AS total_coverage,
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            FROM part_summary_info
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2`,
            [req.body.start_cover, req.body.end_cover]
        );
        data.sum = fullData.rows[0].total_sum;
        data.coverage = fullData.rows[0].total_coverage;
        data.coverage_rate = fullData.rows[0].coverage_rate;
        console.log(data);
    } else {
        var makerdata = [],
            transdata = [],
            pnamedata = [],
            pgroupdata = [];
        //Country Querying
        if (req.body.country_name.length > 0 && req.body.country_name !== "") {
            console.log(req.body.country_name);
            var countrydata = { sum: 0, coverage: 0, coverage_rate: 0 };
            for (let i = 0; i < req.body.country_name.length; i++) {
                const fullCountryData = await client.query(
                    `SELECT SUM(total) AS total_sum, SUM(coverage) AS total_coverage,
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
                    from part_summary_info 
                    where country_name = $1
                    HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $2 AND $3`,
                    [
                        req.body.country_name[i],
                        req.body.start_cover,
                        req.body.end_cover,
                    ]
                );
                countrydata.sum += Number(fullCountryData.rows[0].total_sum);
                countrydata.coverage += Number(
                    fullCountryData.rows[0].total_coverage
                );
            }
            countrydata.coverage_rate = parseInt(
                (Number(countrydata.coverage) * 100) / Number(countrydata.sum)
            );
            data = countrydata;
            console.log(data);
        }

        //Manufacturer Querying
    }
    res.json({ summary: data });
});

module.exports = router;
