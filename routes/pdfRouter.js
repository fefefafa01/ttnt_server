const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/model").post(async (req, res) => {
    //Variables
    var vehiclecode,
        startprod,
        endprod,
        dpos,
        engmod,
        maker,
        model,
        displace,
        power,
        fuel,
        transcode,
        speed,
        trans,
        drivetrain;

    //Querying Car IDs
    const carinfo = await client.query(
        "select i.car_info_id, i.aisin_vehicle_code, i.engine_model, i.drivers_position, i.start_of_production, i.end_of_production, o.car_model_name, b.car_brand_name, c.model_code, p.powered_type, f.fuel_type, t.speed, t.transmission_code, t.transmission_type, d.drivetrain, l.displacement_code from ((((((((car_information i left outer join car_model o on i.car_model_id = o.car_model_id) left outer join car_series s on o.car_series_id = s.car_series_id) left outer join car_brand b on s.car_brand_id = b.car_brand_id ) left outer join ms_model_code c on i.model_code_id = c.model_code_id) left outer join ms_powered_type p on i.power_type_id = p.powered_type_id) left outer join ms_fuel_type f on i.fuel_type_id = f.fuel_type_id) left outer join ms_transmission t on i.transmission_type_id = t.transmission_type_id) left outer join ms_drivetrain d on i.drivetrain_id = d.drivetrain_id) left outer join ms_displacement l on i.displacement_id = l.displacement_id where car_info_id = $1",
        [req.body]
    );
    //Results can be exported
    vehiclecode = carinfo.rows[0].aisin_vehicle_code; //KUN25
    startprod = carinfo.rows[0].start_of_production; //2008
    endprod = carinfo.rows[0].end_of_production; //2011
    dpos = carinfo.rows[0].drivers_position; //RHD
    engmod = carinfo.rows[0].engine_model; //2SDFTV
    model = carinfo.rows[0].car_model_name; //Influx
    maker = carinfo.rows[0].car_brand_name; //Toyota
    displace = carinfo.rows[0].displacement_code;
    power = carinfo.rows[0].powered_type;
    fuel = carinfo.rows[0].fuel_type;
    transcode = carinfo.rows[0].transmission_code;
    trans = carinfo.rows[0].transmission_type;
    speed = carinfo.rows[0].speed;
    if (speed === null || speed === undefined) speed = "";
    drivetrain = carinfo.rows[0].drivetrain;

    //Export Result
    res.json({
        maker: maker,
        model: model,
        vcode: vehiclecode,
        start: startprod,
        end: endprod,
        dripos: dpos,
        engcode: engmod,
        disp: displace,
        powered: power,
        fuel: fuel,
        transc: transcode,
        spd: speed,
        trans: trans,
        dtrain: drivetrain,
    });
});

router.route("/premium").post(async (req, res) => {
    //Variables
    var partid,
        premiumid = [];

    //Querying Corresponding Part IDs
    const part = await client.query(
        "SELECT * FROM part_car_info WHERE car_info_id = $1",
        [req.body]
    );
    partid = part.rows[0].part_id;

    //Querying Lists of Premium IDs
    const pre = await client.query(
        "SELECT * FROM part_aisin_premium WHERE part_id = $1",
        [partid]
    );
    for (let i = 0; i < pre.rowCount; i++) {
        premiumid[i] = pre.rows[i].aisin_premium_id;
    }

    //Querying Into Premium
    var TotalPre = [];
    for (let i = 0; i < premiumid.length; i++) {
        var PreQue = await client.query(
            "SELECT * FROM aisin_premium WHERE aisin_premium_id = $1",
            [premiumid[i]]
        );
        //Concate into Array
        var PremiumArr = {};
        PremiumArr.PremiumCode = PreQue.rows[0].aisin_premium_code;
        PremiumArr.ODmm = PreQue.rows[0].od_mm;
        PremiumArr.ODinch = PreQue.rows[0].od_inch;
        PremiumArr.IDmm = PreQue.rows[0].id_mm;
        PremiumArr.Major = PreQue.rows[0].major_dia_mm;
        PremiumArr.Spline = PreQue.rows[0].spline;
        PremiumArr.PCDmm = PreQue.rows[0].pcd_mm;
        PremiumArr.WidthOD = PreQue.rows[0].width_od_mm;
        PremiumArr.Lengthinch = PreQue.rows[0].length_inch;
        PremiumArr.Lengthmm = PreQue.rows[0].length_mm;
        PremiumArr.Heightmm = PreQue.rows[0].height_mm;
        TotalPre.push(PremiumArr);
    }

    res.json({ Premium: { TotalPre } });
});

router.route("/subpremium").post(async (req, res) => {
    //Variables
    var partid,
        spremiumid = [];

    //Querying Corresponding Part IDs
    const part = await client.query(
        "SELECT * FROM part_car_info WHERE car_info_id = $1",
        [req.body]
    );
    partid = part.rows[0].car_info_id;

    //Querying Lists of Premium IDs
    const pre = await client.query(
        "SELECT * FROM part_aisin_sub_premium WHERE part_id = $1",
        [partid]
    );
    for (let i = 0; i < pre.rowCount; i++) {
        spremiumid[i] = pre.rows[i].aisin_sub_premium_id;
    }

    //Querying Into Premium
    var TotalSPre = [];
    for (let i = 0; i < spremiumid.length; i++) {
        var PreQue = await client.query(
            "SELECT * FROM aisin_sub_premium WHERE aisin_sub_premium_id = $1",
            [spremiumid[i]]
        );
        //Concate into Array
        var SPremiumArr = {};
        SPremiumArr.SPremiumCode = PreQue.rows[0].aisin_sub_premium_code;
        SPremiumArr.ODmm = PreQue.rows[0].od_mm;
        SPremiumArr.ODinch = PreQue.rows[0].od_inch;
        SPremiumArr.IDmm = PreQue.rows[0].id_mm;
        SPremiumArr.Major = PreQue.rows[0].major_dia_mm;
        SPremiumArr.Spline = PreQue.rows[0].spline;
        SPremiumArr.PCDmm = PreQue.rows[0].pcd_mm;
        SPremiumArr.WidthOD = PreQue.rows[0].width_od_mm;
        SPremiumArr.Lengthinch = PreQue.rows[0].length_inch;
        SPremiumArr.Lengthmm = PreQue.rows[0].length_mm;
        SPremiumArr.Heightmm = PreQue.rows[0].height_mm;
        TotalSPre.push(SPremiumArr);
    }
    res.json({ SPremium: { TotalSPre } });
});

router.route("/comp").post(async (req, res) => {
    //Variables
    var partid,
        manuid = [];
    var competitor = [];
    //Querying Corresponding Part IDs
    const part = await client.query(
        "SELECT * FROM part_car_info WHERE car_info_id = $1",
        [req.body]
    );
    partid = part.rows[0].car_info_id;

    const pre = await client.query(
        "SELECT * FROM part_competiter_info WHERE part_id = $1",
        [partid]
    );
    for (let i = 0; i < pre.rowCount; i++) {
        manuid[i] = pre.rows[i].manufacturer_id;
    }

    //Getting Part Code and Manufacturer Name
    for (let i = 0; i < manuid.length; i++) {
        var comppart = await client.query(
            "SELECT * FROM part_competiter_info WHERE manufacturer_id = $1",
            [manuid[i]]
        );
        var manuname = await client.query(
            "SELECT * FROM manufacturer WHERE manufacturer_id = $1",
            [manuid[i]]
        );
        var compo = {};
        compo.Name = manuname.rows[0].manufacturer_name;
        compo.Number =
            manuname.rows[0].manufacturer_name +
            "-" +
            comppart.rows[0].competiter_part_code;
        competitor.push(compo);
    }
    res.json({ Comp: competitor });
});

router.route("/partList").post(async (req, res) => {
    //Querying Car IDs
    var partGroupId = [];
    const partinfo = await client.query(
        "select inf.car_info_id, inf.part_id,pg.part_group_id, pg.part_group_name, p.pnc_id, pnc.part_name, p.part_code, ps.aisin_sub_premium_id, s.aisin_sub_premium_code, pa.aisin_premium_id, a.aisin_premium_code from ((((((( part_group pg join part_sub_group sg on pg.part_group_id = sg.part_group_id ) join part p on sg.part_sub_group_id = p.part_sub_group_id) join (car_information i join part_car_info inf on i.car_info_id = inf.car_info_id) on p.part_id = inf.part_id) join part_aisin_sub_premium ps on p.part_id = ps.part_id) join aisin_sub_premium s on ps.aisin_sub_premium_id = s.aisin_sub_premium_id) join part_aisin_premium pa on p.part_id = pa.part_id) join aisin_premium a on pa.aisin_premium_id = a.aisin_premium_id) join pnc on p.pnc_id = pnc.pnc_id where inf.car_info_id = $1 order by part_group_name",
        [req.body]
    );
    console.log(partinfo);
    //Results can be exported
    var totalPart = [];
    for (let i = 0; i < partinfo.rowCount; i++) {
        var partArr = {};
        partArr.partGroup = partinfo.rows[i].part_group_name;
        partArr.partName = partinfo.rows[i].part_name;
        partArr.OE = partinfo.rows[i].part_code;
        partArr.aisinPrem = partinfo.rows[i].aisin_premium_code;
        partArr.aisinSubPrem = partinfo.rows[i].aisin_sub_premium_code;
        console.log("Here", partArr);
        totalPart[i] = partArr;
    }

    //Export Result
    console.log(totalPart);
    console.log("Hay", totalPart[1]);
    res.json({ partList: totalPart });
});

module.exports = router;