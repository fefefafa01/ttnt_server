const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/maker").post(async (req, res) => {
    //Querying Car IDs
    const countMaker = await client.query(
        `select b.car_brand_name, count(car_brand_name), sum(count(car_brand_name)) over (order by car_brand_name)
        from ((((((((car_information i left outer join car_model o on i.car_model_id = o.car_model_id) 
                left outer join car_series s on o.car_series_id = s.car_series_id) 
                left outer join car_brand b on s.car_brand_id = b.car_brand_id ) 
                left outer join ms_model_code c on i.model_code_id = c.model_code_id) 
                left outer join ms_powered_type p on i.power_type_id = p.powered_type_id) 
                left outer join ms_fuel_type f on i.fuel_type_id = f.fuel_type_id) 
                left outer join ms_transmission t on i.transmission_type_id = t.transmission_type_id) 
                left outer join ms_drivetrain d on i.drivetrain_id = d.drivetrain_id) 
                left outer join ms_displacement l on i.displacement_id = l.displacement_id 
                group by car_brand_name`
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

    const makerMT = await client.query(
        `select distinct car_brand_name
        from part_summary_info
        where transmission_type = 'MT'
        order by car_brand_name`
    );
    var totalMakerMT = [];
    for (let i = 0; i < makerMT.rowCount; i++) {
        totalMakerMT[i] = makerMT.rows[i].car_brand_name;
    }

    var overallValMT = [];
    for (let i = 0; i < makerMT.rowCount; i++) {
        var overallCheck = [];
        for (let j = 0; j < partMT.rowCount; j++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, sum(total) as total_sum, sum(coverage) as total_coverage
            from part_summary_info
            where transmission_type = 'MT' and car_brand_name = $1 and original_part_name = $2
            group by car_brand_name, original_part_name, transmission_type
            order by car_brand_name, original_part_name, transmission_type;`,
                [totalMakerMT[i], totalPartMT[j]]
            );
            var overall = {};
            if (value.rowCount === 0) {
                overall.carName = totalMakerMT[i];
                overall.partName = totalPartMT[j];
                overall.sum = 0;
                overall.coverage = 0;
            } else if (value.rowCount === 1) {
                overall.carName = totalMakerMT[i];
                overall.partName = totalPartMT[j];
                overall.sum = value.rows[0].total_sum;
                overall.coverage = value.rows[0].total_coverage;
            }
            overallCheck[j] = overall;
        }
        overallValMT[i] = overallCheck;
    }
    console.log(overallValMT);

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

    var overallValMTAT = [];
    for (let i = 0; i < makerMTAT.rowCount; i++) {
        var overallCheck = [];
        for (let j = 0; j < partMTAT.rowCount; j++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, sum(total) as total_sum, sum(coverage) as total_coverage
            from part_summary_info
            where (transmission_type = 'MT' or transmission_type = 'AT' or transmission_type = 'MT&AT') 
            and car_brand_name = $1 and original_part_name = $2
            group by car_brand_name, original_part_name, transmission_type
            order by car_brand_name, original_part_name, transmission_type;`,
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

router.route("/result").post(async (req, res) => {
    //Querying Car IDs

    const exportData = await client.query(
        `select country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production, 
        ROUND(SUM(coverage::numeric) / SUM(total) * 100, 2) AS "coverage_rate"
        from part_summary_info 
        where country_name = $1 AND car_brand_name = $2 AND part_group_name = $3 AND original_part_name = $4
        group by country_name, car_brand_name, part_group_name, original_part_name, start_of_production, end_of_production
        order by country_name, car_brand_name, part_group_name, original_part_name`,
        [
            req.body.country_name[0],
            req.body.manufacturer_name[0],
            req.body.part_name[0],
            req.body.part_group[0],
        ]
    );
    //Results can be exported
    var totalData = [];
    for (let i = 0; i < exportData.rowCount; i++) {
        var data = {};
        data.country_name = exportData.rows[i].country_name;
        data.manufacturer_name = exportData.rows[i].manufacturer_name;
        data.part_name = exportData.rows[i].part_name;
        data.part_group = exportData.rows[i].part_group;
        data.coverage_rate = exportData.rows[i].coverage_rate;

        totalData[i] = data;
    }
    console.log("totalData", totalData);

    //Export Result
    //res.json({ MakerName: totalCountMaker });
});

module.exports = router;
