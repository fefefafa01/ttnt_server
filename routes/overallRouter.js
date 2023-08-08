const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");
const excel = require("exceljs");

router.route("/partname").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT original_part_name from part_summary_info";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.original_part_name);
        res.json({ aisin_part_name: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/maker").post(async (req, res) => {
    //Querying Car IDs
    const countMaker = await client.query(
        // `select b.car_brand_name, count(car_brand_name), sum(count(car_brand_name)) over (order by car_brand_name)
        // from ((((((((car_information i left outer join car_model o on i.car_model_id = o.car_model_id)
        //         left outer join car_series s on o.car_series_id = s.car_series_id)
        //         left outer join car_brand b on s.car_brand_id = b.car_brand_id )
        //         left outer join ms_model_code c on i.model_code_id = c.model_code_id)
        //         left outer join ms_powered_type p on i.power_type_id = p.powered_type_id)
        //         left outer join ms_fuel_type f on i.fuel_type_id = f.fuel_type_id)
        //         left outer join ms_transmission t on i.transmission_type_id = t.transmission_type_id)
        //         left outer join ms_drivetrain d on i.drivetrain_id = d.drivetrain_id)
        //         left outer join ms_displacement l on i.displacement_id = l.displacement_id
        //         group by car_brand_name`
        `select car_brand_name, count(car_brand_name), sum(count(car_brand_name)) over (order by car_brand_name)
        from part_summary_info
                group by car_brand_name;`
    );
    //Results can be exported
    var totalCountMaker = [];
    for (let i = 0; i < countMaker.rowCount; i++) {
        var Maker = {};
        Maker.maker = countMaker.rows[i].car_brand_name;
        Maker.count = countMaker.rows[i].count;
        Maker.sum = countMaker.rows[i].sum;

        totalCountMaker[i] = Maker;
    }

    //Export Result
    res.json({ MakerName: totalCountMaker });
});

router.route("/overallTable").post(async (req, res) => {
    //Querying Car IDs
    //for MT
    const partMT = await client.query(
        `select distinct original_part_name 
        from part_summary_info 
        where transmission_type = 'MT'
        order by original_part_name`
    );
    var totalPartMT = [];
    for (let i = 0; i < partMT.rowCount; i++) {
        totalPartMT[i] = partMT.rows[i].original_part_name;
    }

    //for MTAT
    const partMTAT = await client.query(
        `select distinct original_part_name 
        from part_summary_info 
        where transmission_type = 'MT' or transmission_type = 'AT' or transmission_type = 'MT&AT' 
        order by original_part_name`
    );
    var totalPartMTAT = [];
    for (let i = 0; i < partMTAT.rowCount; i++) {
        totalPartMTAT[i] = partMTAT.rows[i].original_part_name;
    }

    const makerMTAT = await client.query(
        `select distinct car_brand_name 
        from part_summary_info 
        where transmission_type = 'MT' or transmission_type = 'AT' or transmission_type = 'MT&AT'
        order by car_brand_name`
    );
    var totalMakerMTAT = [];
    for (let i = 0; i < makerMTAT.rowCount; i++) {
        totalMakerMTAT[i] = makerMTAT.rows[i].car_brand_name;
    }

    var overallValMT = [];
    for (let i = 0; i < makerMTAT.rowCount; i++) {
        var overallCheck = [];
        for (let j = 0; j < partMT.rowCount; j++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, sum(total) as total_sum, sum(coverage) as total_coverage
            from part_summary_info
            where transmission_type = 'MT' and car_brand_name = $1 and original_part_name = $2
            group by car_brand_name, original_part_name, transmission_type
            order by car_brand_name, original_part_name, transmission_type;`,
                [totalMakerMTAT[i], totalPartMT[j]]
            );
            var overall = {};
            if (value.rowCount === 0) {
                overall.carName = totalMakerMTAT[i];
                overall.partName = totalPartMT[j];
                overall.sum = 0;
                overall.coverage = 0;
            } else if (value.rowCount === 1) {
                overall.carName = totalMakerMTAT[i];
                overall.partName = totalPartMT[j];
                overall.sum = value.rows[0].total_sum;
                overall.coverage = value.rows[0].total_coverage;
            }
            overallCheck[j] = overall;
        }
        overallValMT[i] = overallCheck;
    }

    var overallValMTAT = [];
    for (let i = 0; i < makerMTAT.rowCount; i++) {
        var overallCheck = [];
        for (let j = 0; j < partMTAT.rowCount; j++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, sum(total) as total_sum, sum(coverage) as total_coverage
            from part_summary_info
            where (transmission_type = 'MT' or transmission_type = 'AT' or transmission_type = 'MT&AT') 
            and car_brand_name = $1 and original_part_name = $2
            group by car_brand_name, original_part_name
            order by car_brand_name, original_part_name;`,
                [totalMakerMTAT[i], totalPartMTAT[j]]
            );
            var overall = {};
            if (value.rowCount === 0) {
                overall.carName = totalMakerMTAT[i];
                overall.partName = totalPartMTAT[j];
                overall.sum = 0;
                overall.coverage = 0;
            } else if (value.rowCount === 1) {
                overall.carName = totalMakerMTAT[i];
                overall.partName = totalPartMTAT[j];
                overall.sum = value.rows[0].total_sum;
                overall.coverage = value.rows[0].total_coverage;
            }
            overallCheck[j] = overall;
        }
        overallValMTAT[i] = overallCheck;
    }

    res.json({
        carName: totalMakerMTAT,
        partMT: totalPartMT,
        overallValMT: overallValMT,
        overallValMTAT: overallValMTAT,
        partMTAT: totalPartMTAT,
    });
});

router.route("/downoverall").post(async (req, res) => {
    var data = [];
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
            `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
        ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by country_name, car_brand_name, part_group_name, original_part_name`
        );
        for (let i = 0; i < fullData.rowCount; i++) {
            var concatedata = {};
            var endyear = fullData.rows[i].end_of_production.slice(0, 4);
            concatedata.car_maker = fullData.rows[i].car_brand_name;
            concatedata.part_group = fullData.rows[i].part_group_name;
            concatedata.part_name = fullData.rows[i].original_part_name;
            concatedata.year = fullData.rows[i].start_of_production.slice(0, 4);
            concatedata.month = fullData.rows[i].start_of_production.slice(
                4,
                6
            );
            concatedata.coverage = fullData.rows[i].coverage_rate;

            if (
                parseInt(concatedata.coverage) >= req.body.start_cover &&
                parseInt(concatedata.coverage) <= req.body.end_cover
            ) {
                if (
                    (parseInt(concatedata.year) >=
                        parseInt(req.body.start_year) &&
                        parseInt(endyear) <= parseInt(req.body.end_year)) ||
                    (req.body.start_year === "" && req.body.end_year === "") ||
                    (parseInt(concatedata.year) >=
                        parseInt(req.body.start_year) &&
                        req.body.end_year === "") ||
                    (parseInt(endyear) <= parseInt(req.body.end_year) &&
                        req.body.start_year === "")
                ) {
                    data.push(concatedata);
                } else {
                    continue;
                }
            } else {
                continue;
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
                    `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                    from part_summary_info 
                    where country_name = $1
                    group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                    order by country_name, car_brand_name, part_group_name, original_part_name`,
                    [req.body.country_name[i]]
                );
                for (let j = 0; j < fullCountryData.rowCount; j++) {
                    var concatedata = {};
                    var endyear = fullCountryData.rows[
                        j
                    ].end_of_production.slice(0, 4);
                    concatedata.car_maker =
                        fullCountryData.rows[j].car_brand_name;
                    concatedata.part_group =
                        fullCountryData.rows[j].part_group_name;
                    concatedata.part_name =
                        fullCountryData.rows[j].original_part_name;
                    concatedata.year = fullCountryData.rows[
                        j
                    ].start_of_production.slice(0, 4);
                    concatedata.month = fullCountryData.rows[
                        j
                    ].start_of_production.slice(4, 6);
                    concatedata.coverage =
                        fullCountryData.rows[j].coverage_rate;

                    if (
                        parseInt(concatedata.coverage) >=
                            req.body.start_cover &&
                        parseInt(concatedata.coverage) <= req.body.end_cover
                    ) {
                        if (
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                parseInt(endyear) <=
                                    parseInt(req.body.end_year)) ||
                            (req.body.start_year === "" &&
                                req.body.end_year === "") ||
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                req.body.end_year === "") ||
                            (parseInt(endyear) <= parseInt(req.body.end_year) &&
                                req.body.start_year === "")
                        ) {
                            countrydata.push(concatedata);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        } else if (
            req.body.country_name.length === 0 ||
            req.body.country_name === ""
        ) {
            const fullCountryData = await client.query(
                `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                from part_summary_info 
                group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                order by country_name, car_brand_name, part_group_name, original_part_name`
            );
            for (let i = 0; i < fullCountryData.rowCount; i++) {
                var concatedata = {};
                var endyear = fullCountryData.rows[i].end_of_production.slice(
                    0,
                    4
                );
                concatedata.car_maker = fullCountryData.rows[i].car_brand_name;
                concatedata.part_group =
                    fullCountryData.rows[i].part_group_name;
                concatedata.part_name =
                    fullCountryData.rows[i].original_part_name;
                concatedata.year = fullCountryData.rows[
                    i
                ].start_of_production.slice(0, 4);
                concatedata.month = fullCountryData.rows[
                    i
                ].start_of_production.slice(4, 6);
                concatedata.coverage = fullCountryData.rows[i].coverage_rate;

                if (
                    parseInt(concatedata.coverage) >= req.body.start_cover &&
                    parseInt(concatedata.coverage) <= req.body.end_cover
                ) {
                    if (
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            parseInt(endyear) <= parseInt(req.body.end_year)) ||
                        (req.body.start_year === "" &&
                            req.body.end_year === "") ||
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            req.body.end_year === "") ||
                        (parseInt(endyear) <= parseInt(req.body.end_year) &&
                            req.body.start_year === "")
                    ) {
                        countrydata.push(concatedata);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
        //Manufacturer Querying
        if (
            req.body.manufacturer_name.length > 0 &&
            req.body.manufacturer_name !== ""
        ) {
            for (let i = 0; i < req.body.manufacturer_name.length; i++) {
                const fullManuData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                    from part_summary_info 
                    where car_brand_name = $1
                    group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                    order by country_name, car_brand_name, part_group_name, original_part_name`,
                    [req.body.manufacturer_name[i]]
                );
                for (let j = 0; j < fullManuData.rowCount; j++) {
                    var concatedata = {};
                    var endyear = fullManuData.rows[j].end_of_production.slice(
                        0,
                        4
                    );
                    concatedata.car_maker = fullManuData.rows[j].car_brand_name;
                    concatedata.part_group =
                        fullManuData.rows[j].part_group_name;
                    concatedata.part_name =
                        fullManuData.rows[j].original_part_name;
                    concatedata.year = fullManuData.rows[
                        j
                    ].start_of_production.slice(0, 4);
                    concatedata.month = fullManuData.rows[
                        j
                    ].start_of_production.slice(4, 6);
                    concatedata.coverage = fullManuData.rows[j].coverage_rate;

                    if (
                        parseInt(concatedata.coverage) >=
                            req.body.start_cover &&
                        parseInt(concatedata.coverage) <= req.body.end_cover
                    ) {
                        if (
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                parseInt(endyear) <=
                                    parseInt(req.body.end_year)) ||
                            (req.body.start_year === "" &&
                                req.body.end_year === "") ||
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                req.body.end_year === "") ||
                            (parseInt(endyear) <= parseInt(req.body.end_year) &&
                                req.body.start_year === "")
                        ) {
                            makerdata.push(concatedata);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        } else if (
            req.body.manufacturer_name.length === 0 ||
            req.body.manufacturer_name === ""
        ) {
            const fullManuData = await client.query(
                `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                from part_summary_info 
                group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                order by country_name, car_brand_name, part_group_name, original_part_name`
            );
            for (let i = 0; i < fullManuData.rowCount; i++) {
                var concatedata = {};
                var endyear = fullManuData.rows[i].end_of_production.slice(
                    0,
                    4
                );
                concatedata.car_maker = fullManuData.rows[i].car_brand_name;
                concatedata.part_group = fullManuData.rows[i].part_group_name;
                concatedata.part_name = fullManuData.rows[i].original_part_name;
                concatedata.year = fullManuData.rows[
                    i
                ].start_of_production.slice(0, 4);
                concatedata.month = fullManuData.rows[
                    i
                ].start_of_production.slice(4, 6);
                concatedata.coverage = fullManuData.rows[i].coverage_rate;

                if (
                    parseInt(concatedata.coverage) >= req.body.start_cover &&
                    parseInt(concatedata.coverage) <= req.body.end_cover
                ) {
                    if (
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            parseInt(endyear) <= parseInt(req.body.end_year)) ||
                        (req.body.start_year === "" &&
                            req.body.end_year === "") ||
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            req.body.end_year === "") ||
                        (parseInt(endyear) <= parseInt(req.body.end_year) &&
                            req.body.start_year === "")
                    ) {
                        makerdata.push(concatedata);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
        //Transmission Querying
        if (
            req.body.transmission_type.length > 0 &&
            req.body.transmission_type !== ""
        ) {
            for (let i = 0; i < req.body.transmission_type.length; i++) {
                const fullTransData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type, 
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                    from part_summary_info 
                    where transmission_type = $1
                    group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type
                    order by country_name, car_brand_name, part_group_name, original_part_name`,
                    [req.body.transmission_type[i]]
                );
                for (let j = 0; j < fullTransData.rowCount; j++) {
                    var concatedata = {};
                    var endyear = fullTransData.rows[j].end_of_production.slice(
                        0,
                        4
                    );
                    concatedata.car_maker =
                        fullTransData.rows[j].car_brand_name;
                    concatedata.part_group =
                        fullTransData.rows[j].part_group_name;
                    concatedata.part_name =
                        fullTransData.rows[j].original_part_name;
                    concatedata.year = fullTransData.rows[
                        j
                    ].start_of_production.slice(0, 4);
                    concatedata.month = fullTransData.rows[
                        j
                    ].start_of_production.slice(4, 6);
                    concatedata.coverage = fullTransData.rows[j].coverage_rate;

                    if (
                        parseInt(concatedata.coverage) >=
                            req.body.start_cover &&
                        parseInt(concatedata.coverage) <= req.body.end_cover
                    ) {
                        if (
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                parseInt(endyear) <=
                                    parseInt(req.body.end_year)) ||
                            (req.body.start_year === "" &&
                                req.body.end_year === "") ||
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                req.body.end_year === "") ||
                            (parseInt(endyear) <= parseInt(req.body.end_year) &&
                                req.body.start_year === "")
                        ) {
                            transdata.push(concatedata);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        } else if (
            req.body.transmission_type.length === 0 ||
            req.body.transmission_type === ""
        ) {
            const fullTransData = await client.query(
                `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                from part_summary_info 
                group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                order by country_name, car_brand_name, part_group_name, original_part_name`
            );
            for (let i = 0; i < fullTransData.rowCount; i++) {
                var concatedata = {};
                var endyear = fullTransData.rows[i].end_of_production.slice(
                    0,
                    4
                );
                concatedata.car_maker = fullTransData.rows[i].car_brand_name;
                concatedata.part_group = fullTransData.rows[i].part_group_name;
                concatedata.part_name =
                    fullTransData.rows[i].original_part_name;
                concatedata.year = fullTransData.rows[
                    i
                ].start_of_production.slice(0, 4);
                concatedata.month = fullTransData.rows[
                    i
                ].start_of_production.slice(4, 6);
                concatedata.coverage = fullTransData.rows[i].coverage_rate;

                if (
                    parseInt(concatedata.coverage) >= req.body.start_cover &&
                    parseInt(concatedata.coverage) <= req.body.end_cover
                ) {
                    if (
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            parseInt(endyear) <= parseInt(req.body.end_year)) ||
                        (req.body.start_year === "" &&
                            req.body.end_year === "") ||
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            req.body.end_year === "") ||
                        (parseInt(endyear) <= parseInt(req.body.end_year) &&
                            req.body.start_year === "")
                    ) {
                        transdata.push(concatedata);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
        //Part Group Querying
        if (req.body.part_group.length > 0 && req.body.part_group !== "") {
            for (let i = 0; i < req.body.part_group.length; i++) {
                const fullPGData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type, 
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                    from part_summary_info 
                    where part_group_name = $1
                    group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type
                    order by country_name, car_brand_name, part_group_name, original_part_name`,
                    [req.body.part_group[i]]
                );
                for (let j = 0; j < fullPGData.rowCount; j++) {
                    var concatedata = {};
                    var endyear = fullPGData.rows[j].end_of_production.slice(
                        0,
                        4
                    );
                    concatedata.car_maker = fullPGData.rows[j].car_brand_name;
                    concatedata.part_group = fullPGData.rows[j].part_group_name;
                    concatedata.part_name =
                        fullPGData.rows[j].original_part_name;
                    concatedata.year = fullPGData.rows[
                        j
                    ].start_of_production.slice(0, 4);
                    concatedata.month = fullPGData.rows[
                        j
                    ].start_of_production.slice(4, 6);
                    concatedata.coverage = fullPGData.rows[j].coverage_rate;

                    if (
                        parseInt(concatedata.coverage) >=
                            req.body.start_cover &&
                        parseInt(concatedata.coverage) <= req.body.end_cover
                    ) {
                        if (
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                parseInt(endyear) <=
                                    parseInt(req.body.end_year)) ||
                            (req.body.start_year === "" &&
                                req.body.end_year === "") ||
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                req.body.end_year === "") ||
                            (parseInt(endyear) <= parseInt(req.body.end_year) &&
                                req.body.start_year === "")
                        ) {
                            pgroupdata.push(concatedata);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        } else if (
            req.body.part_group.length === 0 ||
            req.body.part_group === ""
        ) {
            const fullPGData = await client.query(
                `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                from part_summary_info 
                group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                order by country_name, car_brand_name, part_group_name, original_part_name`
            );
            for (let i = 0; i < fullPGData.rowCount; i++) {
                var concatedata = {};
                var endyear = fullPGData.rows[i].end_of_production.slice(0, 4);
                concatedata.car_maker = fullPGData.rows[i].car_brand_name;
                concatedata.part_group = fullPGData.rows[i].part_group_name;
                concatedata.part_name = fullPGData.rows[i].original_part_name;
                concatedata.year = fullPGData.rows[i].start_of_production.slice(
                    0,
                    4
                );
                concatedata.month = fullPGData.rows[
                    i
                ].start_of_production.slice(4, 6);
                concatedata.coverage = fullPGData.rows[i].coverage_rate;

                if (
                    parseInt(concatedata.coverage) >= req.body.start_cover &&
                    parseInt(concatedata.coverage) <= req.body.end_cover
                ) {
                    if (
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            parseInt(endyear) <= parseInt(req.body.end_year)) ||
                        (req.body.start_year === "" &&
                            req.body.end_year === "") ||
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            req.body.end_year === "") ||
                        (parseInt(endyear) <= parseInt(req.body.end_year) &&
                            req.body.start_year === "")
                    ) {
                        pgroupdata.push(concatedata);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
        //Part Name Querying
        if (req.body.part_name.length > 0 && req.body.part_name !== "") {
            for (let i = 0; i < req.body.part_name.length; i++) {
                const fullPNData = await client.query(
                    `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type, 
                    ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                    from part_summary_info 
                    where original_part_name = $1
                    group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type
                    order by country_name, car_brand_name, part_group_name, original_part_name`,
                    [req.body.part_name[i]]
                );
                for (let j = 0; j < fullPNData.rowCount; j++) {
                    var concatedata = {};
                    var endyear = fullPNData.rows[j].end_of_production.slice(
                        0,
                        4
                    );
                    concatedata.car_maker = fullPNData.rows[j].car_brand_name;
                    concatedata.part_group = fullPNData.rows[j].part_group_name;
                    concatedata.part_name =
                        fullPNData.rows[j].original_part_name;
                    concatedata.year = fullPNData.rows[
                        j
                    ].start_of_production.slice(0, 4);
                    concatedata.month = fullPNData.rows[
                        j
                    ].start_of_production.slice(4, 6);
                    concatedata.coverage = fullPNData.rows[j].coverage_rate;

                    if (
                        parseInt(concatedata.coverage) >=
                            req.body.start_cover &&
                        parseInt(concatedata.coverage) <= req.body.end_cover
                    ) {
                        if (
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                parseInt(endyear) <=
                                    parseInt(req.body.end_year)) ||
                            (req.body.start_year === "" &&
                                req.body.end_year === "") ||
                            (parseInt(concatedata.year) >=
                                parseInt(req.body.start_year) &&
                                req.body.end_year === "") ||
                            (parseInt(endyear) <= parseInt(req.body.end_year) &&
                                req.body.start_year === "")
                        ) {
                            pnamedata.push(concatedata);
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            }
        } else if (
            req.body.part_name.length === 0 ||
            req.body.part_name === ""
        ) {
            const fullPNData = await client.query(
                `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
                ROUND(SUM(coverage::numeric) / SUM(total) * 100) AS "coverage_rate"
                from part_summary_info 
                group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
                order by country_name, car_brand_name, part_group_name, original_part_name`
            );
            for (let i = 0; i < fullPNData.rowCount; i++) {
                var concatedata = {};
                var endyear = fullPNData.rows[i].end_of_production.slice(0, 4);
                concatedata.car_maker = fullPNData.rows[i].car_brand_name;
                concatedata.part_group = fullPNData.rows[i].part_group_name;
                concatedata.part_name = fullPNData.rows[i].original_part_name;
                concatedata.year = fullPNData.rows[i].start_of_production.slice(
                    0,
                    4
                );
                concatedata.month = fullPNData.rows[
                    i
                ].start_of_production.slice(4, 6);
                concatedata.coverage = fullPNData.rows[i].coverage_rate;

                if (
                    parseInt(concatedata.coverage) >= req.body.start_cover &&
                    parseInt(concatedata.coverage) <= req.body.end_cover
                ) {
                    if (
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            parseInt(endyear) <= parseInt(req.body.end_year)) ||
                        (req.body.start_year === "" &&
                            req.body.end_year === "") ||
                        (parseInt(concatedata.year) >=
                            parseInt(req.body.start_year) &&
                            req.body.end_year === "") ||
                        (parseInt(endyear) <= parseInt(req.body.end_year) &&
                            req.body.start_year === "")
                    ) {
                        pnamedata.push(concatedata);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }
        console.log(
            "Searched Values (overallRouter.js):",
            countrydata.length,
            makerdata.length,
            transdata.length,
            pgroupdata.length,
            pnamedata.length
        );
        //Check Data
        var temperal = [],
            temp = [];
        //Country to Car-Maker
        for (let i = 0; i < countrydata.length; i++) {
            for (let j = 0; j < makerdata.length; j++) {
                if (
                    countrydata[i].car_maker === makerdata[j].car_maker &&
                    countrydata[i].part_group === makerdata[j].part_group &&
                    countrydata[i].part_name === makerdata[j].part_name &&
                    countrydata[i].year === makerdata[j].year &&
                    countrydata[i].month === makerdata[j].month &&
                    countrydata[i].coverage === makerdata[j].coverage
                ) {
                    temperal.push(countrydata[i]);
                }
            }
        }
        //C-M to Transmission
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < transdata.length; j++) {
                if (
                    temperal[i].car_maker === transdata[j].car_maker &&
                    temperal[i].part_group === transdata[j].part_group &&
                    temperal[i].part_name === transdata[j].part_name &&
                    temperal[i].year === transdata[j].year &&
                    temperal[i].month === transdata[j].month &&
                    temperal[i].coverage === transdata[j].coverage
                ) {
                    temp.push(temperal[i]);
                }
            }
        }
        //C-M-T to Part Group
        temperal = [];
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < pgroupdata.length; j++) {
                if (
                    temp[i].car_maker === pgroupdata[j].car_maker &&
                    temp[i].part_group === pgroupdata[j].part_group &&
                    temp[i].part_name === pgroupdata[j].part_name &&
                    temp[i].year === pgroupdata[j].year &&
                    temp[i].month === pgroupdata[j].month &&
                    temp[i].coverage === pgroupdata[j].coverage
                ) {
                    temperal.push(temp[i]);
                }
            }
        }
        //C-M-T-PG to Part Name
        temp = [];
        for (let i = 0; i < temperal.length; i++) {
            for (let j = 0; j < pnamedata.length; j++) {
                if (
                    temperal[i].car_maker === pnamedata[j].car_maker &&
                    temperal[i].part_group === pnamedata[j].part_group &&
                    temperal[i].part_name === pnamedata[j].part_name &&
                    temperal[i].year === pnamedata[j].year &&
                    temperal[i].month === pnamedata[j].month &&
                    temperal[i].coverage === pnamedata[j].coverage
                ) {
                    temp.push(temperal[i]);
                }
            }
        }
        console.log(
            "Fitting Criteria Values (overallRouter.js):",
            temperal.length,
            temp.length
        );
        //Purging if same value
        if (temp.length > 1) {
            for (let i = 0; i < temp.length - 1; i++) {
                if (
                    temp[i].car_maker === temp[i + 1].car_maker &&
                    temp[i].part_group === temp[i + 1].part_group &&
                    temp[i].part_name === temp[i + 1].part_name &&
                    temp[i].year === temp[i + 1].year &&
                    temp[i].month === temp[i + 1].month &&
                    temp[i].coverage === temp[i + 1].coverage
                ) {
                    temp.splice(i, 1);
                    i = i - 1;
                }
            }
        }
        data = temp;
    }
    //Export Criteria Check If Select All:
    const allCountry = await client.query(
        `select distinct country_name
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by country_name`
    );
    const allMaker = await client.query(
        `select distinct car_brand_name
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by car_brand_name`
    );
    const allTrans = await client.query(
        `select distinct transmission_type
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, transmission_type
        order by transmission_type`
    );
    const allPG = await client.query(
        `select distinct part_group_name
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by part_group_name`
    );
    const allPN = await client.query(
        `select distinct original_part_name
        from part_summary_info 
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by original_part_name`
    );
    console.log(
        "Distinct Criteria Values (overallRouter.js):",
        allCountry.rowCount,
        allMaker.rowCount,
        allTrans.rowCount,
        allPG.rowCount,
        allPN.rowCount
    );

    var ecCountry = "",
        ecMaker = "",
        ecTrans = "",
        ecPG = "",
        ecPN = "";
    //Country Criteria
    if (
        allCountry.rowCount === req.body.country_name.length ||
        req.body.country_name.length === 0 ||
        req.body.country_name === ""
    ) {
        ecCountry = "All Country";
    } else if (allCountry.rowCount > req.body.country_name.length) {
        for (let i = 0; i < req.body.country_name.length; i++) {
            if (i === 0) {
                ecCountry = req.body.country_name[i];
            } else {
                ecCountry = ecCountry + ", " + req.body.country_name[i];
            }
        }
    }
    //Maker Criteria
    if (
        allMaker.rowCount === req.body.manufacturer_name.length ||
        req.body.manufacturer_name.length === 0 ||
        req.body.manufacturer_name === ""
    ) {
        ecMaker = "All Brand";
    } else if (allMaker.rowCount > req.body.manufacturer_name.length) {
        for (let i = 0; i < req.body.manufacturer_name.length; i++) {
            if (i === 0) {
                ecMaker = req.body.manufacturer_name[i];
            } else {
                ecMaker = ecMaker + ", " + req.body.manufacturer_name[i];
            }
        }
    }
    //Transmission Criteria
    if (
        allTrans.rowCount === req.body.transmission_type.length ||
        req.body.transmission_type.length === 0 ||
        req.body.tranmission_type === ""
    ) {
        ecTrans = "All Transmission Type";
    } else if (allTrans.rowCount > req.body.transmission_type.length) {
        for (let i = 0; i < req.body.transmission_type.length; i++) {
            if (i === 0) {
                ecTrans = req.body.transmission_type[i];
            } else {
                ecTrans = ecTrans + ", " + req.body.transmission_type[i];
            }
        }
    }
    //Part Group Criteria
    if (
        allPG.rowCount === req.body.part_group.length ||
        req.body.part_group.length === 0 ||
        req.body.part_group === ""
    ) {
        ecPG = "All Part Group";
    } else if (allPG.rowCount > req.body.part_group.length) {
        for (let i = 0; i < req.body.part_group.length; i++) {
            if (i === 0) {
                ecPG = req.body.part_group[i];
            } else {
                ecPG = ecPG + ", " + req.body.part_group[i];
            }
        }
    }
    //Part Name Criteria
    if (
        allPN.rowCount === req.body.part_name.length ||
        req.body.part_name.length === 0 ||
        req.body.part_name === ""
    ) {
        ecPN = "All Part Name";
    } else if (allPN.rowCount > req.body.part_name.length) {
        for (let i = 0; i < req.body.part_name.length; i++) {
            if (i === 0) {
                ecPN = req.body.part_name[i];
            } else {
                ecPN = ecPN + ", " + req.body.part_name[i];
            }
        }
    }
    //Downloading
    const curr = new Date();
    var month, day;
    if (curr.getMonth() + 1 < 10) {
        month = "0" + (curr.getMonth() + 1);
    } else {
        month = curr.getMonth() + 1;
    }
    if (curr.getDate() < 10) {
        day = "0" + curr.getDate();
    } else {
        day = curr.getDate();
    }
    var fileName = `GMP Data_${curr.getFullYear()}-${month}-${day}`;
    const CellName = ["A", "B", "C", "D", "E", "F"];
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    var wb = new excel.Workbook();
    wb.xlsx.readFile("bin/constants/ReportTemplate.xlsx").then(function () {
        var ws = wb.getWorksheet(1);
        if (req.body.start_year !== "" && req.body.end_year !== "") {
            var appendA1 =
                "Export Criteria" +
                "\r\n- Country = " +
                ecCountry +
                "\r\n- Car Maker = " +
                ecMaker +
                "\r\n- Transmission Type = " +
                ecTrans +
                "\r\n- Part Group = " +
                ecPG +
                "\r\n- Part Name = " +
                ecPN +
                "\r\n- From " +
                req.body.start_year +
                " To " +
                req.body.end_year;
        } else if (req.body.start_year === "" && req.body.end_year !== "") {
            var appendA1 =
                "Export Criteria" +
                "\r\n- Country = " +
                ecCountry +
                "\r\n- Car Maker = " +
                ecMaker +
                "\r\n- Transmission Type = " +
                ecTrans +
                "\r\n- Part Group = " +
                ecPG +
                "\r\n- Part Name = " +
                ecPN +
                "\r\n- To " +
                req.body.end_year;
        } else if (req.body.start_year !== "" && req.body.end_year === "") {
            var appendA1 =
                "Export Criteria" +
                "\r\n- Country = " +
                ecCountry +
                "\r\n- Car Maker = " +
                ecMaker +
                "\r\n- Transmission Type = " +
                ecTrans +
                "\r\n- Part Group = " +
                ecPG +
                "\r\n- Part Name = " +
                ecPN +
                "\r\n- From " +
                req.body.start_year;
        } else if (req.body.start_year === "" && req.body.end_year === "") {
            var appendA1 =
                "Export Criteria" +
                "\r\n- Country = " +
                ecCountry +
                "\r\n- Car Maker = " +
                ecMaker +
                "\r\n- Transmission Type = " +
                ecTrans +
                "\r\n- Part Group = " +
                ecPG +
                "\r\n- Part Name = " +
                ecPN;
        }

        if (req.body.start_cover !== req.body.end_cover) {
            appendA1 =
                appendA1 +
                "\r\n- Coverage Range " +
                req.body.start_cover +
                " To " +
                req.body.end_cover;
        } else if (req.body.start_cover === req.body.end_cover) {
            appendA1 =
                appendA1 + "\r\n- Coverage Range " + req.body.start_cover;
        }

        ws.mergeCells("A1:F1");
        var row = ws.getRow(1);
        row.height = 120;
        const A1cell = ws.getCell("A1");
        A1cell.value = appendA1;
        const bold = appendA1.indexOf("Export Criteria");
        if (bold >= 0) {
            const textRuns = [
                { text: appendA1.substring(0, bold), font: { bold: false } },
                { text: "Export Criteria", font: { bold: true } },
                {
                    text: appendA1.substring(bold + "Export Criteria".length),
                    font: { bold: false },
                },
            ];
            A1cell.value = { richText: textRuns };
        }
        ws.getCell("A1").border = {
            top: { style: "thin", color: { argb: "00000000" } },
            left: { style: "thin", color: { argb: "00000000" } },
            bottom: { style: "thin", color: { argb: "00000000" } },
            right: { style: "thin", color: { argb: "00000000" } },
        };
        for (let i = 0; i < data.length; i++) {
            row = ws.getRow(i + 3);
            row.height = 20;
            row.getCell(1).value = data[i].car_maker;
            row.getCell(2).value = data[i].part_group;
            row.getCell(3).value = data[i].part_name;
            row.getCell(4).value = parseInt(data[i].year);
            row.getCell(5).value = data[i].month;
            row.getCell(6).value = parseInt(data[i].coverage);
            row.commit();
            for (let j = 0; j < CellName.length; j++) {
                let Cell = CellName[j] + (i + 3);
                ws.getCell(Cell).border = {
                    top: { style: "thin", color: { argb: "00000000" } },
                    left: { style: "thin", color: { argb: "00000000" } },
                    bottom: { style: "thin", color: { argb: "00000000" } },
                    right: { style: "thin", color: { argb: "00000000" } },
                };
            }
        }
        //Response
        fileName = fileName + ".xlsx";
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        wb.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

module.exports = router;
