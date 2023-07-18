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
    console.log(countMaker);
    //Results can be exported
    var totalCountMaker = [];
    for (let i = 0; i < countMaker.rowCount; i++) {
        var Maker = {};
        Maker.maker = countMaker.rows[i].car_brand_name;
        Maker.count = countMaker.rows[i].count;
        Maker.sum = countMaker.rows[i].sum;

        console.log("Here", Maker);
        totalCountMaker[i] = Maker;
    }

    //Export Result
    console.log(totalCountMaker);
    console.log("Hay", totalCountMaker[1]);
    res.json({ MakerName: totalCountMaker });
});

module.exports = router;
