const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router.route("/model").post(async (req, res) => {
    //Variables
    if (typeof(req.body)!=="object") {
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
            `select i.car_info_id, i.aisin_vehicle_code, i.engine_model, i.drivers_position, i.start_of_production, 
            i.end_of_production, o.car_model_name, b.car_brand_name, c.model_code, p.powered_type, f.fuel_type, 
            t.speed, t.transmission_code, t.transmission_type, d.drivetrain, l.displacement_code 
            from ((((((((car_information i left outer join car_model o on i.car_model_id = o.car_model_id) 
            left outer join car_series s on o.car_series_id = s.car_series_id) 
            left outer join car_brand b on s.car_brand_id = b.car_brand_id ) 
            left outer join ms_model_code c on i.model_code_id = c.model_code_id) 
            left outer join ms_powered_type p on i.power_type_id = p.powered_type_id) 
            left outer join ms_fuel_type f on i.fuel_type_id = f.fuel_type_id) 
            left outer join ms_transmission t on i.transmission_type_id = t.transmission_type_id) 
            left outer join ms_drivetrain d on i.drivetrain_id = d.drivetrain_id) 
            left outer join ms_displacement l on i.displacement_id = l.displacement_id 
            where car_info_id = $1`,
            [req.body]
        );
        //Results can be exported
        if (carinfo.rowCount!==0) {
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
        } else {
            console.log("No Car Model Found (pdfRouter.js)")
            res.json({
                maker: "",
                model: "",
                vcode: "",
                start: "",
                end: "",
                dripos: "",
                engcode: "",
                disp: "",
                powered: "",
                fuel: "",
                transc: "",
                spd: "",
                trans: "",
                dtrain: "",
            });
        }
    } else {
        logger.dlogger.log("error", "Null Car_ID Request")
    }
});

router.route("/partdetails").post(async (req, res) => {
    //Variables
    var TotalPre = [], TotalSPre = [], Competitor = []

    //Querying Premium Part Details
    const PreDetails = await client.query(
        `SELECT DISTINCT aisin_premium_code, od_mm, od_inch, id_mm,
                "major_dia_mm" AS major_dia_mm, spline, pcd_mm,
                "width_od_mm" AS width_od_mm, 
                "width_id_mm" AS width_id_mm, 
                length_inch, length_mm, height_mm
        FROM 	((part p JOIN
                part_aisin_premium pap on p.part_id = pap.part_id)
                JOIN aisin_premium pre on pap.aisin_premium_id = pre.aisin_premium_id)
        WHERE p.part_code = $1
        ORDER BY aisin_premium_code ASC`,
        [req.body]
    )

    //Parsing into an array
    if (PreDetails.rowCount > 0) {
        for (let i = 0; i < PreDetails.rowCount; i++) {
            var PremiumArr = {}

            PremiumArr.PremiumCode = PreDetails.rows[i].aisin_premium_code
            PremiumArr.ODmm = PreDetails.rows[i].od_mm
            PremiumArr.ODinch = PreDetails.rows[i].od_inch
            PremiumArr.IDmm = PreDetails.rows[i].id_mm
            PremiumArr.Major = PreDetails.rows[i].major_dia_mm
            PremiumArr.Spline = PreDetails.rows[i].spline
            PremiumArr.PCDmm = PreDetails.rows[i].pcd_mm
            PremiumArr.WidthOD = PreDetails.rows[i].width_od_mm
            PremiumArr.WidthID = PreDetails.rows[i].width_id_mm
            PremiumArr.Lengthinch = PreDetails.rows[i].length_inch
            PremiumArr.Lengthmm = PreDetails.rows[i].length_mm
            PremiumArr.Heightmm = PreDetails.rows[i].height_mm

            TotalPre.push(PremiumArr)
        }
    } else {
        TotalPre = []
    }

    // Querying Sub-Premium Part Details
    const SubDetails = await client.query(
        `SELECT DISTINCT aisin_sub_premium_code, od_mm, od_inch, id_mm,
                "major_dia_mm" AS major_dia_mm, spline, pcd_mm,
                "width_od_mm" AS width_od_mm, 
                "width_id_mm" AS width_id_mm, 
                length_inch, length_mm, height_mm
        FROM 	((part p JOIN
                part_aisin_sub_premium pas on p.part_id = pas.part_id)
                JOIN aisin_sub_premium sub on pas.aisin_sub_premium_id = sub.aisin_sub_premium_id)
        WHERE p.part_code = $1
        ORDER BY aisin_sub_premium_code ASC`,
        [req.body]
    )

    if (SubDetails.rowCount > 0) {
        for (let i = 0; i < SubDetails.rowCount; i++) {
            var SPremiumArr = {}

            SPremiumArr.SPremiumCode = SubDetails.rows[i].aisin_sub_premium_code
            SPremiumArr.ODmm = SubDetails.rows[i].od_mm
            SPremiumArr.ODinch = SubDetails.rows[i].od_inch
            SPremiumArr.IDmm = SubDetails.rows[i].id_mm
            SPremiumArr.Major = SubDetails.rows[i].major_dia_mm
            SPremiumArr.Spline = SubDetails.rows[i].spline
            SPremiumArr.PCDmm = SubDetails.rows[i].pcd_mm
            SPremiumArr.WidthOD = SubDetails.rows[i].width_od_mm
            SPremiumArr.WidthID = SubDetails.rows[i].width_id_mm
            SPremiumArr.Lengthinch = SubDetails.rows[i].length_inch
            SPremiumArr.Lengthmm = SubDetails.rows[i].length_mm
            SPremiumArr.Heightmm = SubDetails.rows[i].height_mm

            TotalSPre.push(SPremiumArr)
        }
    } else {
        TotalSPre = []
    }

    //Querying Competitor Details
    const CompDetails = await client.query(
        `SELECT DISTINCT manu.manufacturer_name, pci.competiter_part_code
        FROM 	((part p JOIN
                part_competiter_info pci on p.part_id = pci.part_id)
                JOIN manufacturer manu on pci.manufacturer_id = manu.manufacturer_id)
        WHERE p.part_code = $1
        ORDER BY manu.manufacturer_name ASC`,
        [req.body]
    )

    if (CompDetails.rowCount > 0) {
        for (let i = 0; i < CompDetails.rowCount; i++) {
            var CompArr = {}

            CompArr.Name = CompDetails.rows[i].manufacturer_name
            CompArr.Number = CompDetails.rows[i].manufacturer_name + "-" + CompDetails.rows[i].competiter_part_code

            Competitor.push(CompArr)
        }
    } else {
        Competitor = []
    }

    res.json({ Premium: TotalPre, SPremium: TotalSPre , Competitor: Competitor})
})

router.route("/comp").post(async (req, res) => {
    //Variables
    var partid = [];
    manuid = [];
    var competitor = [];

    //Querying Corresponding Part IDs
    const part = await client.query("SELECT * FROM part WHERE part_code = $1", [
        req.body,
    ]);
    for (let i = 0; i < part.rowCount; i++) {
        partid[i] = part.rows[i].part_id;
    }

    for (let i = 0; i < partid.length; i++) {
        const pre = await client.query(
            "SELECT * FROM part_competiter_info WHERE part_id = $1",
            [partid[i]]
        );
        for (let a = 0; a < pre.rowCount; a++) {
            manuid[a] = pre.rows[a].manufacturer_id;
        }

        //Getting Part Code and Manufacturer Name
        for (let a = 0; a < manuid.length; a++) {
            var comppart = await client.query(
                "SELECT * FROM part_competiter_info WHERE manufacturer_id = $1",
                [manuid[a]]
            );
            var manuname = await client.query(
                "SELECT * FROM manufacturer WHERE manufacturer_id = $1",
                [manuid[a]]
            );
            var compo = {};
            compo.Name = manuname.rows[0].manufacturer_name;
            compo.Number =
                manuname.rows[0].manufacturer_name +
                "-" +
                comppart.rows[0].competiter_part_code;
            competitor.push(compo);
        }
    }
    for (let i = 0; i < competitor.length; i++) {
        for (let j=i+1; j < competitor.length; j++) {
            if (
                competitor[i].Name === competitor[j].Name &&
                competitor[i].Number === competitor[j].Number
            ) {
                competitor.splice(i, 1);
                i--;
                break;
            }
        }
    }
    res.json({ Comp: competitor });
});

router.route("/partList").post(async (req, res) => {
    //Querying Car IDs
    var partGroupId = [];
    const partinfo = await client.query(
        `select inf.car_info_id, inf.part_id,pg.part_group_id, pg.part_group_name, p.pnc_id, pnc.part_name, 
        p.part_code, ps.aisin_sub_premium_id, s.aisin_sub_premium_code, pa.aisin_premium_id, a.aisin_premium_code,
         p.part_start_time, p.part_end_time 
        from ((((((( part_group pg join part_sub_group sg on pg.part_group_id = sg.part_group_id ) 
        join part p on sg.part_sub_group_id = p.part_sub_group_id) 
        join (car_information i join part_car_info inf on i.car_info_id = inf.car_info_id) on p.part_id = inf.part_id) 
        join part_aisin_sub_premium ps on p.part_id = ps.part_id) 
        join aisin_sub_premium s on ps.aisin_sub_premium_id = s.aisin_sub_premium_id) 
        join part_aisin_premium pa on p.part_id = pa.part_id) 
        join aisin_premium a on pa.aisin_premium_id = a.aisin_premium_id) 
        join pnc on p.pnc_id = pnc.pnc_id 
        where inf.car_info_id = $1 and sg.part_sub_group_name = $2 order by part_group_name`,
        [req.body.id, req.body.partSubGroup]
    );
    if (partinfo.rowCount > 0) {
        console.log("First Part Info, export Car_ID (pdfRouter.js):", partinfo.rows[0].car_info_id)
    } else {
        console.log("Part Info doesn't have any value (pdfRouter.js)")
    }
    //Results can be exported
    var totalPart = [];
    for (let i = 0; i < partinfo.rowCount; i++) {
        var partArr = {};
        partArr.partGroup = partinfo.rows[i].part_group_name;
        partArr.partName = partinfo.rows[i].part_name;
        partArr.OE = partinfo.rows[i].part_code+" ("+partinfo.rows[i].part_start_time.slice(2,4)+"-"+partinfo.rows[i].part_end_time.slice(2,4)+")";
        partArr.aisinPrem = partinfo.rows[i].aisin_premium_code;
        partArr.aisinSubPrem = partinfo.rows[i].aisin_sub_premium_code;
        // console.log("Here", partArr);
        totalPart[i] = partArr;
    }

    //Export Result
    // console.log("Hay", totalPart[1]);
    res.json({ partList: totalPart });
});

router.route("/subGroup").post(async (req, res) => {
    //Querying Car IDs
    const partSubGroup = await client.query(
        `select distinct part_sub_group_name from part_car_info inf 
        join (part p 
        join part_sub_group sg on p.part_sub_group_id = sg.part_sub_group_id) p on inf.part_id = p.part_id 
        where inf.car_info_id = $1`,
        [req.body]
    );
    console.log("First Sub-group (pdfRouter.js):", partSubGroup.rows[0]);
    //Results can be exported
    var totalPartSubGroup = [];
    for (let i = 0; i < partSubGroup.rowCount; i++) {
        var subGroupArr = {};
        subGroupArr.subGroup = partSubGroup.rows[i].part_sub_group_name;
        // console.log("Here", subGroupArr);
        totalPartSubGroup[i] = subGroupArr;
    }

    //Export Result
    // console.log("Hay", totalPartSubGroup[1]);
    res.json({ subGroupList: totalPartSubGroup });
});

module.exports = router;
