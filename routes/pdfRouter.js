const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const logger = require("./logger.js");

router
    .route("/model")
    .post(async (req, res) => {
            //Variables
        var modelid, seriesid, brandid, vehiclecode, startprod, endprod, dpos, engmod, disid, 
            powerid, fuelid, transid, driveid
        var maker, model, displace, power, fuel, transcode, speed, trans, drivetrain

            //Querying Car IDs
        const carinfo = await client.query(
            "SELECT * FROM car_information WHERE car_info_id = $1", [req.body]
        )
            //Results can be exported
        vehiclecode = carinfo.rows[0].aisin_vehicle_code //KUN25
        startprod = carinfo.rows[0].start_of_production //2008
        endprod = carinfo.rows[0].end_of_production //2011
        dpos = carinfo.rows[0].drivers_position //RHD
        engmod = carinfo.rows[0].engine_model //2SDFTV
            // IDs for further querying
        modelid = carinfo.rows[0].car_info_id //ID for Modelname and Maker Brand Querying
        disid = carinfo.rows[0].displacement_id //ID for Displacement Querying
        powerid = carinfo.rows[0].power_type_id //ID for Powertype Querying
        fuelid = carinfo.rows[0].fuel_type_id //ID for Fuel Type Querying
        transid = carinfo.rows[0].transmission_type_id //ID for Transmission Type, Speed, Transmission Querying
        driveid = carinfo.rows[0].drivetrain_id //ID for Drivetrain Querying
        
            //Querying Model and Maker
        const carmodel = await client.query(
            "SELECT * FROM car_model WHERE car_model_id = $1", [modelid]
        )
            //Car Model Name Extracted
        model = carmodel.rows[0].car_model_name //Influx
            //Car Series ID for Manufacturer Querying
        seriesid = carmodel.rows[0].car_series_id
        const carbrand = await client.query(
            "SELECT * FROM car_series WHERE car_series_id = $1", [seriesid]
        )
        brandid = carbrand.rows[0].car_brand_id
        const brandname = await client.query(
            "SELECT * FROM car_brand WHERE car_brand_id = $1", [brandid]
        )
            //Car Maker Name Extracted
        maker = brandname.rows[0].car_brand_name //Toyota

            //Querying Displacement
        const disp = await client.query(
            "SELECT * FROM ms_displacement WHERE displacement_id = $1", [disid]
        )
        displace = disp.rows[0].displacement_code
        
            //Querying Powertype
        const ptype = await client.query(
            "SELECT * FROM ms_powered_type WHERE powered_type_id = $1", [powerid]
        )
        power = ptype.rows[0].powered_type

            //Querying Fueltype
        const ftype = await client.query(
            "SELECT * FROM ms_fuel_type WHERE fuel_type_id = $1", [fuelid]
        )
        fuel = ftype.rows[0].fuel_type

            //Querying Transmission Code, Transmission Type, Speed
        const trancts = await client.query(
            "SELECT * FROM ms_transmission WHERE transmission_type_id = $1", [transid]
        )
        transcode = trancts.rows[0].transmission_code
        trans = trancts.rows[0].transmission_type
        speed = trancts.rows[0].speed
            if (speed === null || speed === undefined) speed=""
            //Querying Drivertrain
        const dt = await client.query(
            "SELECT * FROM ms_drivetrain WHERE drivetrain_id = $1", [driveid]
        )
        drivetrain = dt.rows[0].drivetrain;

            //Logging Results After Querying
        // console.log(maker, model, vehiclecode, startprod, endprod, dpos, engmod, displace, 
        //     power, fuel, transcode, speed, trans, drivetrain)
            
            //Export Result
        res.json({ maker: maker, model: model, vcode: vehiclecode, start: startprod, end: endprod, 
                dripos: dpos, engcode: engmod, disp: displace, powered: power, fuel: fuel,
                transc: transcode, spd: speed, trans: trans, dtrain: drivetrain})
    })

router
    .route("/premium")
    .post(async (req, res) => {
            //Variables
        var partid, premiumid = []
            
            //Querying Corresponding Part IDs
        const part = await client.query(
            "SELECT * FROM part_car_info WHERE car_info_id = $1", [req.body]
        )
        partid = part.rows[0].car_info_id;
        
            //Querying Lists of Premium IDs
        const pre = await client.query(
            "SELECT * FROM part_aisin_premium WHERE part_id = $1", [partid]
        )
        for (let i=0; i<pre.rowCount; i++) {
            premiumid[i]=pre.rows[i].aisin_premium_id
            
        }

            //Querying Into Premium
        var TotalPre = []
        for (let i=0; i<premiumid.length;i++) {
            var PreQue = await client.query(
                "SELECT * FROM aisin_premium WHERE aisin_premium_id = $1", [premiumid[i]]
            )
            //Concate into Array
            var PremiumArr = {}
            PremiumArr.PremiumCode = PreQue.rows[0].aisin_premium_code
            PremiumArr.ODmm=PreQue.rows[0].od_mm
            PremiumArr.ODinch=PreQue.rows[0].od_inch
            PremiumArr.IDmm=PreQue.rows[0].id_mm
            PremiumArr.Major=PreQue.rows[0].major_dia_mm
            PremiumArr.Spline=PreQue.rows[0].spline
            PremiumArr.PCDmm=PreQue.rows[0].pcd_mm
            PremiumArr.WidthOD=PreQue.rows[0].width_od_mm
            PremiumArr.Lengthinch=PreQue.rows[0].length_inch
            PremiumArr.Lengthmm=PreQue.rows[0].length_mm
            PremiumArr.Heightmm=PreQue.rows[0].height_mm
            TotalPre.push(PremiumArr)
        }
        res.json({Premium: {TotalPre}})
    })

router
    .route("/subpremium")
    .post(async (req, res) => {
            //Variables
        var partid, spremiumid = []
            
            //Querying Corresponding Part IDs
        const part = await client.query(
            "SELECT * FROM part_car_info WHERE car_info_id = $1", [req.body]
        )
        partid = part.rows[0].car_info_id;
        
            //Querying Lists of Premium IDs
        const pre = await client.query(
            "SELECT * FROM part_aisin_sub_premium WHERE part_id = $1", [partid]
        )
        for (let i=0; i<pre.rowCount; i++) {
            spremiumid[i]=pre.rows[i].aisin_sub_premium_id
            
        }

            //Querying Into Premium
        var TotalSPre = []
        for (let i=0; i<spremiumid.length;i++) {
            var PreQue = await client.query(
                "SELECT * FROM aisin_sub_premium WHERE aisin_sub_premium_id = $1", [spremiumid[i]]
            )
            //Concate into Array
            var SPremiumArr = {}
            SPremiumArr.SPremiumCode = PreQue.rows[0].aisin_sub_premium_code
            SPremiumArr.ODmm=PreQue.rows[0].od_mm
            SPremiumArr.ODinch=PreQue.rows[0].od_inch
            SPremiumArr.IDmm=PreQue.rows[0].id_mm
            SPremiumArr.Major=PreQue.rows[0].major_dia_mm
            SPremiumArr.Spline=PreQue.rows[0].spline
            SPremiumArr.PCDmm=PreQue.rows[0].pcd_mm
            SPremiumArr.WidthOD=PreQue.rows[0].width_od_mm
            SPremiumArr.Lengthinch=PreQue.rows[0].length_inch
            SPremiumArr.Lengthmm=PreQue.rows[0].length_mm
            SPremiumArr.Heightmm=PreQue.rows[0].height_mm
            TotalSPre.push(SPremiumArr)
        }
        res.json({SPremium: {TotalSPre}})
    })

router
    .route("/comp")
    .post(async (req, res) => {
            //Variables
        var partid, manuid = []
        var competitor=[]
            //Querying Corresponding Part IDs
        const part = await client.query(
            "SELECT * FROM part_car_info WHERE car_info_id = $1", [req.body]
        )
        partid = part.rows[0].car_info_id;
        
        const pre = await client.query(
            "SELECT * FROM part_competiter_info WHERE part_id = $1", [partid]
        )
        for (let i=0; i<pre.rowCount; i++) {
            manuid[i]=pre.rows[i].manufacturer_id
        }

            //Getting Part Code and Manufacturer Name
        for (let i=0; i<manuid.length; i++) {
            var comppart = await client.query(
                "SELECT * FROM part_competiter_info WHERE manufacturer_id = $1", [manuid[i]]
            )
            var manuname = await client.query(
                "SELECT * FROM manufacturer WHERE manufacturer_id = $1", [manuid[i]]
            )
            var compo = {}
            compo.Name = manuname.rows[0].manufacturer_name
            compo.Number = manuname.rows[0].manufacturer_name+"-"+comppart.rows[0].competiter_part_code
            competitor.push(compo)
        }
        console.log(competitor)
        res.json({Comp: competitor})
    })

module.exports = router;