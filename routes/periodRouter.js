const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/brandChart").post(async (req, res) => {
    var brandName = [];
    var coverageRate = [];
    var partName = [];
    var coveragePart = [];
    var data = { sum: 0, coverage: 0, coverage_rate: 0 };
    if (
        (req.body.country_name.length === 0 || req.body.country_name === "") &&
        (req.body.manufacturer_name.length === 0 ||
            req.body.manufacturer_name === "") &&
        (req.body.transmission_type.length === 0 ||
            req.body.transmission_type === "") &&
        (req.body.part_group.length === 0 || req.body.part_group === "") &&
        (req.body.part_name.length === 0 || req.body.part_name === "")
    ) {
        const fullData = await client.query(
            `select car_brand_name, ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            from part_summary_info
            group by car_brand_name
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2
            order by coverage_rate DESC;`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (fullData.rowCount > 0) {
            for (let i = 0; i < fullData.rowCount; i++) {
                brandName.push(fullData.rows[i].car_brand_name);
                coverageRate.push(fullData.rows[i].coverage_rate);
            }
        } else {
            brandName.push("");
            coverageRate.push(0);
        }

        const fullPartData = await client.query(
            `select original_part_name, ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            from part_summary_info
            group by original_part_name
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2
            order by coverage_rate DESC;`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (fullPartData.rowCount > 0) {
            for (let i = 0; i < fullPartData.rowCount; i++) {
                partName.push(fullPartData.rows[i].original_part_name);
                coveragePart.push(fullPartData.rows[i].coverage_rate);
            }
        } else {
            partName.push("");
            coveragePart.push(0);
        }
        const fullSumData = await client.query(
            `SELECT SUM(total) AS total_sum, SUM(coverage) AS total_coverage,
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            FROM part_summary_info
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (fullSumData.rowCount > 0) {
            data.sum = fullSumData.rows[0].total_sum;
            data.coverage = fullSumData.rows[0].total_coverage;
            data.coverage_rate = parseInt(
                (Number(data.coverage) * 100) / Number(data.sum)
            );
        } else {
            data.sum = 0;
            data.coverage = 0;
            data.coverage_rate = 0;
        }
    } else {
        var countrydata = [],
            makerdata = [],
            transdata = [],
            pnamedata = [],
            pgroupdata = [];
        //Country Querying
        if (req.body.country_name.length > 0 && req.body.country_name !== "") {
            for (let i = 0; i < req.body.country_name.length; i++) {
                const fullCountryData = await client.query(
                    `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                        from part_summary_info
                        where   country_name = $1 and SUBSTRING(end_of_production, 1, 4)::INT <= $2
                                AND SUBSTRING(start_of_production, 1, 4)::INT >= $3
                        group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
        				HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $4 AND $5
                        order by car_brand_name, country_name, part_group_name, original_part_name;`,
                    [
                        req.body.country_name[i],
                        parseInt(req.body.end_year),
                        parseInt(req.body.start_year),
                        parseInt(req.body.start_cover),
                        parseInt(req.body.end_cover),
                    ]
                );
                countrydata.push(fullCountryData.rows);
            }
        } else if (
            req.body.country_name.length === 0 ||
            req.body.country_name === ""
        ) {
            const fullCountryData = await client.query(
                `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                    from part_summary_info
                    where   SUBSTRING(end_of_production, 1, 4)::INT <= $1
                            AND SUBSTRING(start_of_production, 1, 4)::INT >= $2
                    group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                    HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $3 AND $4
                    order by country_name, car_brand_name, part_group_name, original_part_name;`,
                [
                    parseInt(req.body.end_year),
                    parseInt(req.body.start_year),
                    parseInt(req.body.start_cover),
                    parseInt(req.body.end_cover),
                ]
            );
            countrydata.push(fullCountryData.rows);
        }
        //Manufacturer Querying
        if (
            req.body.manufacturer_name.length > 0 &&
            req.body.manufacturer_name !== ""
        ) {
            for (let i = 0; i < req.body.manufacturer_name.length; i++) {
                const fullManuData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, total, coverage
                        from part_summary_info
                        where   car_brand_name = $1 and SUBSTRING(end_of_production, 1, 4)::INT <= $2
                                AND SUBSTRING(start_of_production, 1, 4)::INT >= $3
                                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
        				HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $4 AND $5
                        order by country_name, car_brand_name, part_group_name, original_part_name;`,
                    [
                        req.body.manufacturer_name[i],
                        parseInt(req.body.end_year),
                        parseInt(req.body.start_year),
                        parseInt(req.body.start_cover),
                        parseInt(req.body.end_cover),
                    ]
                );
                makerdata.push(fullManuData.rows);
            }
        } else if (
            req.body.manufacturer_name.length === 0 ||
            req.body.manufacturer_name === ""
        ) {
            const fullManuData = await client.query(
                `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                from part_summary_info
                where   SUBSTRING(end_of_production, 1, 4)::INT <= $1
                        AND SUBSTRING(start_of_production, 1, 4)::INT >= $2
                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $3 AND $4
                order by country_name, car_brand_name, part_group_name, original_part_name;`,
                [
                    parseInt(req.body.end_year),
                    parseInt(req.body.start_year),
                    parseInt(req.body.start_cover),
                    parseInt(req.body.end_cover),
                ]
            );
            makerdata.push(fullManuData.rows);
        }
        //Transmission Querying
        if (
            req.body.transmission_type.length > 0 &&
            req.body.transmission_type !== ""
        ) {
            for (let i = 0; i < req.body.transmission_type.length; i++) {
                const fullTransData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, total, coverage
                    from part_summary_info
                    where   transmission_type = $1 and SUBSTRING(end_of_production, 1, 4)::INT <= $2
                            AND SUBSTRING(start_of_production, 1, 4)::INT >= $3
                            group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                    HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $4 AND $5
                    order by country_name, car_brand_name, part_group_name, original_part_name;`,
                    [
                        req.body.transmission_type[i],
                        parseInt(req.body.end_year),
                        parseInt(req.body.start_year),
                        parseInt(req.body.start_cover),
                        parseInt(req.body.end_cover),
                    ]
                );
                transdata.push(fullTransData.rows);
            }
        } else if (
            req.body.transmission_type.length === 0 ||
            req.body.transmission_type === ""
        ) {
            const fullTransData = await client.query(
                `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                from part_summary_info
                where   SUBSTRING(end_of_production, 1, 4)::INT <= $1
                        AND SUBSTRING(start_of_production, 1, 4)::INT >= $2
                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $3 AND $4
                order by country_name, car_brand_name, part_group_name, original_part_name;`,
                [
                    parseInt(req.body.end_year),
                    parseInt(req.body.start_year),
                    parseInt(req.body.start_cover),
                    parseInt(req.body.end_cover),
                ]
            );
            transdata.push(fullTransData.rows);
        }
        //Part Group Querying
        if (req.body.part_group.length > 0 && req.body.part_group !== "") {
            for (let i = 0; i < req.body.part_group.length; i++) {
                const fullPGData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, total, coverage
                    from part_summary_info
                    where   part_group_name = $1 and SUBSTRING(end_of_production, 1, 4)::INT <= $2
                            AND SUBSTRING(start_of_production, 1, 4)::INT >= $3
                            group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                    HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $4 AND $5
                    order by country_name, car_brand_name, part_group_name, original_part_name;`,
                    [
                        req.body.part_group[i],
                        parseInt(req.body.end_year),
                        parseInt(req.body.start_year),
                        parseInt(req.body.start_cover),
                        parseInt(req.body.end_cover),
                    ]
                );
                pgroupdata.push(fullPGData.rows);
            }
        } else if (
            req.body.part_group.length === 0 ||
            req.body.part_group === ""
        ) {
            const fullPGData = await client.query(
                `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                from part_summary_info
                where   SUBSTRING(end_of_production, 1, 4)::INT <= $1
                        AND SUBSTRING(start_of_production, 1, 4)::INT >= $2
                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $3 AND $4
                order by country_name, car_brand_name, part_group_name, original_part_name;`,
                [
                    parseInt(req.body.end_year),
                    parseInt(req.body.start_year),
                    parseInt(req.body.start_cover),
                    parseInt(req.body.end_cover),
                ]
            );
            pgroupdata.push(fullPGData.rows);
        }
        //Part Name Querying
        if (req.body.part_name.length > 0 && req.body.part_name !== "") {
            for (let i = 0; i < req.body.part_name.length; i++) {
                const fullPNData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, total, coverage
                        from part_summary_info
                        where   original_part_name = $1 and SUBSTRING(end_of_production, 1, 4)::INT <= $2
                                AND SUBSTRING(start_of_production, 1, 4)::INT >= $3
                                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                        HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $4 AND $5
                        order by country_name, car_brand_name, part_group_name, original_part_name;`,
                    [
                        req.body.part_name[i],
                        parseInt(req.body.end_year),
                        parseInt(req.body.start_year),
                        parseInt(req.body.start_cover),
                        parseInt(req.body.end_cover),
                    ]
                );
                pnamedata.push(fullPNData.rows);
            }
        } else if (
            req.body.part_name.length === 0 ||
            req.body.part_name === ""
        ) {
            const fullPNData = await client.query(
                `select country_name ,car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                from part_summary_info
                where   SUBSTRING(end_of_production, 1, 4)::INT <= $1
                        AND SUBSTRING(start_of_production, 1, 4)::INT >= $2
                group by country_name, car_brand_name, part_group_name, transmission_type, original_part_name, total, coverage
                HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $3 AND $4
                order by country_name, car_brand_name, part_group_name, original_part_name;`,
                [
                    parseInt(req.body.end_year),
                    parseInt(req.body.start_year),
                    parseInt(req.body.start_cover),
                    parseInt(req.body.end_cover),
                ]
            );
            pnamedata.push(fullPNData.rows);
        }
        var temperal = [],
            temp = [];
        //Country to Car-Maker
        for (let i = 0; i < countrydata[0].length; i++) {
            for (let j = 0; j < makerdata[0].length; j++) {
                if (
                    countrydata[0][i].car_brand_name ===
                        makerdata[0][j].car_brand_name &&
                    countrydata[0][i].part_group_name ===
                        makerdata[0][j].part_group_name &&
                    countrydata[0][i].original_part_name ===
                        makerdata[0][j].original_part_name &&
                    countrydata[0][i].total === makerdata[0][j].total &&
                    countrydata[0][i].coverage === makerdata[0][j].coverage
                ) {
                    temperal.push(countrydata[0][i]);
                }
            }
        }
        //C-M to Transmission
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < transdata[0].length; j++) {
                if (
                    temperal[i].car_brand_name ===
                        transdata[0][j].car_brand_name &&
                    temperal[i].part_group_name ===
                        transdata[0][j].part_group_name &&
                    temperal[i].original_part_name ===
                        transdata[0][j].original_part_name &&
                    temperal[i].total === transdata[0][j].total &&
                    temperal[i].coverage === transdata[0][j].coverage
                ) {
                    temp.push(temperal[i]);
                }
            }
        }
        //C-M-T to Part Group
        temperal = [];
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < pgroupdata[0].length; j++) {
                if (
                    temp[i].car_brand_name ===
                        pgroupdata[0][j].car_brand_name &&
                    temp[i].part_group_name ===
                        pgroupdata[0][j].part_group_name &&
                    temp[i].original_part_name ===
                        pgroupdata[0][j].original_part_name &&
                    temp[i].total === pgroupdata[0][j].total &&
                    temp[i].coverage === pgroupdata[0][j].coverage
                ) {
                    temperal.push(temp[i]);
                }
            }
        }
        //C-M-T-PG to Part Name
        temp = [];
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < pnamedata[0].length; j++) {
                if (
                    temperal[i].car_brand_name ===
                        pnamedata[0][j].car_brand_name &&
                    temperal[i].part_group_name ===
                        pnamedata[0][j].part_group_name &&
                    temperal[i].original_part_name ===
                        pnamedata[0][j].original_part_name &&
                    temperal[i].total === pnamedata[0][j].total &&
                    temperal[i].coverage === pnamedata[0][j].coverage
                ) {
                    temp.push(temperal[i]);
                }
            }
        }
        console.log(temp.length);
        console.log(temp[1]);

        const mergedData = temp.reduce((acc, current) => {
            const existingIndex = acc.findIndex(
                (item) => item.car_brand_name === current.car_brand_name
            );

            if (existingIndex !== -1) {
                acc[existingIndex].total += current.total;
                acc[existingIndex].coverage += current.coverage;
            } else {
                acc.push({ ...current });
            }

            return acc;
        }, []);

        for (let i = 0; i < mergedData.length; i++) {
            brandName.push(mergedData[i].car_brand_name);
            var coverage_rate = parseInt(
                (Number(mergedData[i].coverage) * 100) /
                    Number(mergedData[i].total)
            );
            coverageRate.push(coverage_rate);
        }

        if (temp.length > 0) {
            for (let i = 0; i < temp.length - 1; i++) {
                data.sum += Number(temp[i].total);
                data.coverage += Number(temp[i].coverage);
            }
            data.coverage_rate = parseInt((data.coverage * 100) / data.sum);
        }

        const mergedPart = temp.reduce((acc, current) => {
            const existingIndex = acc.findIndex(
                (item) => item.original_part_name === current.original_part_name
            );

            if (existingIndex !== -1) {
                acc[existingIndex].total += current.total;
                acc[existingIndex].coverage += current.coverage;
            } else {
                acc.push({ ...current });
            }

            return acc;
        }, []);

        for (let i = 0; i < mergedPart.length; i++) {
            partName.push(mergedPart[i].original_part_name);
            var coverage_rate = parseInt(
                (Number(mergedPart[i].coverage) * 100) /
                    Number(mergedPart[i].total)
            );
            coveragePart.push(coverage_rate);
        }
        console.log(partName, coveragePart);
    }

    res.json({
        brandName: brandName,
        coverageRate: coverageRate,
        partName: partName,
        coveragePart: coveragePart,
        data: data,
    });
});

module.exports = router;
