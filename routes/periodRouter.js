const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/periodData").post(async (req, res) => {
    var brandName = [];
    var coverageRate = [];
    var partName = [];
    var coveragePart = [];
    var product = [];
    function compareObjects(a, b) {
        const ratioA = a.coverage / a.total;
        const ratioB = b.coverage / b.total;

        if (ratioA > ratioB) {
            return -1; // Sort in descending order
        }
        if (ratioA < ratioB) {
            return 1;
        }
        return 0;
    }
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
            `select car_brand_name, SUM(coverage) as coverage,  SUM(total) as total, ROUND(SUM(coverage::numeric) / SUM(total) * 100) as coverage_rate
            from part_summary_info
            where coverage < total
            group by car_brand_name
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2
            order by coverage_rate DESC;`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (fullData.rowCount > 0) {
            for (let i = 0; i < fullData.rowCount; i++) {
                brandName.push(fullData.rows[i].car_brand_name);
                coverageRate.push(
                    parseInt(
                        (Number(fullData.rows[i].coverage) * 100) /
                            Number(fullData.rows[i].total)
                    )
                );
            }
        } else {
            brandName.push("");
            coverageRate.push(0);
        }

        const fullPartData = await client.query(
            `select original_part_name, SUM(coverage) as coverage,  SUM(total) as total, ROUND(SUM(coverage::numeric) / SUM(total) * 100) as coverage_rate
            from part_summary_info
            where coverage < total
            group by original_part_name
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2
            order by coverage_rate DESC;`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (fullPartData.rowCount > 0) {
            for (let i = 0; i < fullPartData.rowCount; i++) {
                partName.push(fullPartData.rows[i].original_part_name);
                coveragePart.push(
                    parseInt(
                        (Number(fullPartData.rows[i].coverage) * 100) /
                            Number(fullPartData.rows[i].total)
                    )
                );
            }
        } else {
            partName.push("");
            coveragePart.push(0);
        }
        const fullSumData = await client.query(
            `SELECT SUM(total) AS total_sum, SUM(coverage) AS total_coverage,
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            FROM part_summary_info
            where coverage < total
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
        const totalData = await client.query(
            `select car_brand_name, part_group_name, original_part_name, SUM(total) AS total, SUM(coverage) AS coverage,
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS coverage_rate
            from part_summary_info 
            where coverage < total
            group by car_brand_name, part_group_name, original_part_name
            HAVING ROUND(SUM(coverage::numeric) / SUM(total) * 100) BETWEEN $1 AND $2
            order by car_brand_name, part_group_name, original_part_name`,
            [req.body.start_cover, req.body.end_cover]
        );
        if (totalData.rowCount > 0) {
            for (let i = 0; i < totalData.rowCount; i++) {
                product.push(totalData.rows[i]);
            }
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
        for (let i = 0; i < countrydata.length; i++) {
            for (let j = 0; j < countrydata[i].length; j++) {
                for (let k = 0; k < makerdata.length; k++) {
                    for (let l = 0; l < makerdata[k].length; l++) {
                        if (
                            countrydata[i][j].car_brand_name ===
                                makerdata[k][l].car_brand_name &&
                            countrydata[i][j].part_group_name ===
                                makerdata[k][l].part_group_name &&
                            countrydata[i][j].original_part_name ===
                                makerdata[k][l].original_part_name &&
                            countrydata[i][j].total === makerdata[k][l].total &&
                            countrydata[i][j].coverage ===
                                makerdata[k][l].coverage
                        ) {
                            temperal.push(countrydata[i][j]);
                        }
                    }
                }
            }
        }
        //C-M to Transmission
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < transdata.length; j++) {
                for (let k = 0; k < transdata[j].length; k++) {
                    if (
                        temperal[i].car_brand_name ===
                            transdata[j][k].car_brand_name &&
                        temperal[i].part_group_name ===
                            transdata[j][k].part_group_name &&
                        temperal[i].original_part_name ===
                            transdata[j][k].original_part_name &&
                        temperal[i].total === transdata[j][k].total &&
                        temperal[i].coverage === transdata[j][k].coverage
                    ) {
                        temp.push(temperal[i]);
                    }
                }
            }
        }
        //C-M-T to Part Group
        temperal = [];
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < pgroupdata.length; j++) {
                for (let k = 0; k < pgroupdata[j].length; k++) {
                    if (
                        temp[i].car_brand_name ===
                            pgroupdata[j][k].car_brand_name &&
                        temp[i].part_group_name ===
                            pgroupdata[j][k].part_group_name &&
                        temp[i].original_part_name ===
                            pgroupdata[j][k].original_part_name &&
                        temp[i].total === pgroupdata[j][k].total &&
                        temp[i].coverage === pgroupdata[j][k].coverage
                    ) {
                        temperal.push(temp[i]);
                    }
                }
            }
        }
        //C-M-T-PG to Part Name
        temp = [];
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < pnamedata.length; j++) {
                for (let k = 0; k < pnamedata[j].length; k++) {
                    if (
                        temperal[i].car_brand_name ===
                            pnamedata[j][k].car_brand_name &&
                        temperal[i].part_group_name ===
                            pnamedata[j][k].part_group_name &&
                        temperal[i].original_part_name ===
                            pnamedata[j][k].original_part_name &&
                        temperal[i].total === pnamedata[j][k].total &&
                        temperal[i].coverage === pnamedata[j][k].coverage
                    ) {
                        temp.push(temperal[i]);
                    }
                }
            }
        }
        //Brand
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
        mergedData.sort(compareObjects);
        for (let i = 0; i < mergedData.length; i++) {
            brandName.push(mergedData[i].car_brand_name);
            var coverage_rate = parseInt(
                (Number(mergedData[i].coverage) * 100) /
                    Number(mergedData[i].total)
            );
            coverageRate.push(coverage_rate);
        }
        console.log(brandName, coverageRate);
        //Part
        const mergePart = temp.reduce((acc, current) => {
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
        mergePart.sort(compareObjects);

        for (let i = 0; i < mergePart.length; i++) {
            partName.push(mergePart[i].original_part_name);
            var coverage_rate = parseInt(
                (Number(mergePart[i].coverage) * 100) /
                    Number(mergePart[i].total)
            );
            coveragePart.push(coverage_rate);
        }
        console.log(partName, coveragePart);
        //SUMMARY
        if (temp.length > 0) {
            for (let i = 0; i < temp.length; i++) {
                data.sum += Number(temp[i].total);
                data.coverage += Number(temp[i].coverage);
            }
            data.coverage_rate = parseInt((data.coverage * 100) / data.sum);
        }

        const mergedTotal = temp.reduce((acc, current) => {
            const existingIndex = acc.findIndex(
                (item) =>
                    item.car_brand_name === current.car_brand_name &&
                    item.part_group_name === current.part_group_name &&
                    item.original_part_name === current.original_part_name
            );

            if (existingIndex !== -1) {
                acc[existingIndex].total += current.total;
                acc[existingIndex].coverage += current.coverage;
            } else {
                acc.push({ ...current });
            }

            return acc;
        }, []);

        for (let i = 0; i < mergedTotal.length; i++) {
            mergedTotal[i].coverage_rate = parseInt(
                (Number(mergedTotal[i].coverage) * 100) /
                    Number(mergedTotal[i].total)
            );
            product.push(mergedTotal[i]);
        }
        console.log("product", product);
    }

    res.json({
        brandName: brandName,
        coverageRate: coverageRate,
        partName: partName,
        coveragePart: coveragePart,
        data: data,
        temp: product,
    });
});

router.route("/dashboard").post(async (req, res) => {
    var country = "";
    if (req.body.country_name.length === 0 || req.body.country_name === "") {
        country += "All Countries";
    } else {
        const fullCountry = await client.query(`
            select distinct country_name from part_summary_info
        `);
        if (req.body.country_name.length === fullCountry.rowCount) {
            country += "All Countries";
        } else {
            for (let i = 0; i < req.body.country_name.length; i++) {
                if (i === 0) {
                    country += req.body.country_name[i];
                } else {
                    country += ", " + req.body.country_name[i];
                }
            }
        }
    }

    var brand = "";
    if (
        req.body.manufacturer_name.length === 0 ||
        req.body.manufacturer_name === ""
    ) {
        brand += "All Brands";
    } else {
        const fullBrand = await client.query(`
            select distinct car_brand_name from part_summary_info
        `);
        if (req.body.manufacturer_name.length === fullBrand.rowCount) {
            brand += "All Brands";
        } else {
            for (let i = 0; i < req.body.manufacturer_name.length; i++) {
                if (i === 0) {
                    brand += req.body.manufacturer_name[i];
                } else {
                    brand += ", " + req.body.manufacturer_name[i];
                }
            }
        }
    }

    var Ttype = "";
    if (
        req.body.transmission_type.length === 0 ||
        req.body.transmission_type === ""
    ) {
        Ttype += "All Transmission Types";
    } else {
        const fullTtype = await client.query(`
            select distinct transmission_type from part_summary_info
        `);
        if (req.body.transmission_type.length === fullTtype.rowCount) {
            Ttype += "All Transmission Types";
        } else {
            for (let i = 0; i < req.body.transmission_type.length; i++) {
                if (i === 0) {
                    Ttype += req.body.transmission_type[i];
                } else {
                    Ttype += ", " + req.body.transmission_type[i];
                }
            }
        }
    }

    var PGroup = "";
    if (req.body.part_group.length === 0 || req.body.part_group === "") {
        PGroup += "All Part Group";
    } else {
        const fullPGroup = await client.query(`
            select distinct part_group_name from part_summary_info
        `);
        if (req.body.part_group.length === fullPGroup.rowCount) {
            PGroup += "All part Group";
        } else {
            for (let i = 0; i < req.body.part_group.length; i++) {
                if (i === 0) {
                    PGroup += req.body.part_group[i];
                } else {
                    PGroup += ", " + req.body.part_group[i];
                }
            }
        }
    }

    var PName = "";
    if (req.body.part_name.length === 0 || req.body.part_name === "") {
        PName += "All Part Name";
    } else {
        const fullPName = await client.query(`
            select distinct original_part_name from part_summary_info
        `);
        if (req.body.part_name.length === fullPName.rowCount) {
            PName += "All Part Name";
        } else {
            for (let i = 0; i < req.body.part_name.length; i++) {
                if (i === 0) {
                    PName += req.body.part_name[i];
                } else {
                    PName += ", " + req.body.part_name[i];
                }
            }
        }
    }
    res.json({
        country: country,
        brand: brand,
        Ttype: Ttype,
        PGroup: PGroup,
        PName: PName,
        StY: req.body.start_year,
        EnY: req.body.end_year,
        StC: req.body.start_cover,
        EnC: req.body.end_cover,
    });
});

module.exports = router;
