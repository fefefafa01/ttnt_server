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
        for (let k = 0; k < partMT.rowCount; k++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, total, coverage
            from part_summary_info
            where transmission_type = 'MT' and car_brand_name = $1 and original_part_name = $2
            order by car_brand_name, original_part_name;`,
                // [totalMakerMT[i].car_brand_name, totalMakerMT[i].original_part_name]
                [totalMakerMT[i], totalPartMT[k]]
            );
            //Results can be exported

            var overall = {};
            var sum = 0;
            var coverage = 0;
            for (let j = 0; j < value.rowCount; j++) {
                sum = sum + Number(value.rows[j].total);
                coverage += Number(value.rows[j].coverage);
            }
            overall.carName = totalMakerMT[k];
            overall.partName = totalPartMT[i];
            overall.sum = sum;
            overall.coverage = coverage;

            overallCheck[k] = overall;
        }
        overallValMT[i] = overallCheck;
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

    var overallValMTAT = [];
    for (let i = 0; i < makerMTAT.rowCount; i++) {
        var overallCheck = [];
        for (let k = 0; k < partMTAT.rowCount; k++) {
            const value = await client.query(
                `select car_brand_name, original_part_name, total, coverage
            from part_summary_info
            where (transmission_type = 'MT' or transmission_type = 'AT' or transmission_type = 'MT&AT')
            and car_brand_name = $1 and original_part_name = $2
            order by car_brand_name, original_part_name;`,
                // [totalMakerMT[i].car_brand_name, totalMakerMT[i].original_part_name]
                [totalMakerMTAT[i], totalPartMTAT[k]]
            );
            //Results can be exported

            var overallMTAT = {};
            var sumMTAT = 0;
            var coverage = 0;
            for (let j = 0; j < value.rowCount; j++) {
                sumMTAT = sumMTAT + Number(value.rows[j].total);
                coverage += Number(value.rows[j].coverage);
            }
            overallMTAT.carName = totalMakerMTAT[i];

            overallMTAT.partNameMTAT = totalPartMTAT[k];
            overallMTAT.sumMTAT = sumMTAT;
            overallMTAT.coverageMTAT = coverage;

            overallCheck[k] = overallMTAT;
        }
        overallValMTAT[i] = overallCheck;
    }

    res.json({
        overallValMT: overallValMT,
        overallValMTAT: overallValMTAT,
    });
});

module.exports = router;
