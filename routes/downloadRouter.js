const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const excel = require("exceljs");


router.route("/partlist").post(async (req, res) => {
    //Variables
    var totaloutput = [],
        codes = []
    //Re-string Part Code 
    for (let i = 0; i < req.body.length; i++) {
        var pcode = req.body[i].OE;
        pcode = pcode.slice(0, pcode.length-8)
        codes.push(pcode)
    }
    //Querying
    for(let i = 0; i < codes.length; i++) {
        var data = {}
        var checkPrem, checkSubPrem
        //If Aisin Premium Code has value = true
        checkPrem = req.body[i].aisinPrem!==null && req.body[i].aisinPrem!=="" && req.body[i].aisinPrem!==undefined
        //If Aisin Sub-Premium Code has value = true
        checkSubPrem = req.body[i].aisinSubPrem!==null && req.body[i].aisinSubPrem!=="" && req.body[i].aisinSubPrem!==undefined
        if (!checkPrem && checkSubPrem) {
            const compinfo = await client.query(
            `SELECT  
                sub.od_inch AS sod_inch, 
                sub.od_mm AS sod_mm, 
                sub.id_mm AS sid_mm, 
                sub."major_dia_mm" AS smajor_dia_mm, 
                sub.spline AS sspline, 
                sub.pcd_mm AS spcd_mm,
                sub."width_od_mm" AS swidth_od_mm, 
                sub."width_id_mm" AS swidth_id_mm, 
                sub.length_inch AS slength_inch, 
                sub.length_mm AS slength_mm, 
                sub.height_mm AS sheight_mm
            FROM (((((((car_information car
                JOIN car_model model ON car.car_model_id = model.car_model_id)
                JOIN car_series series ON model.car_series_id = series.car_series_id)
                JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                JOIN part p ON com.part_id = p.part_id)
                JOIN part_aisin_sub_premium pas on pas.part_id = p.part_id)
                JOIN aisin_sub_premium sub on sub.aisin_sub_premium_id = pas.aisin_sub_premium_id
            WHERE p.part_code = $1 AND sub.aisin_sub_premium_code = $2`, 
                [codes[i], req.body[i].aisinSubPrem]
            )
            if (compinfo.rowCount > 0) {
                //Competitor Data
                const compe = await client.query(
                    `SELECT manu.manufacturer_name
                    FROM (((((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        JOIN part p ON com.part_id = p.part_id)
                        JOIN part_aisin_sub_premium pas on pas.part_id = p.part_id)
                        JOIN aisin_sub_premium sub on sub.aisin_sub_premium_id = pas.aisin_sub_premium_id
                        WHERE p.part_code = $1 AND sub.aisin_sub_premium_code = $2`,
                        [codes[i], req.body[i].aisinSubPrem]
                )
                if (compe.rowCount > 0) {
                    data.Competitor = compe.rows[0].manufacturer_name
                } else {
                    data.Competitor = ""
                }
                //Parts Premium Data
                data.PremiumData = null
                //Parts Sub-Premium Data
                var SubPremiumData= "OD (mm) = " + compinfo.rows[0].sod_mm +
                                    "\r\nOD (inch) = " + compinfo.rows[0].sod_inch + 
                                    "\r\nID (mm) = " + compinfo.rows[0].sid_mm + 
                                    "\r\nMajor D. (mm) = " + compinfo.rows[0].smajor_dia_mm + 
                                    "\r\nSpline = " + compinfo.rows[0].sspline + 
                                    "\r\nPCD (mm) = " + compinfo.rows[0].spcd_mm + 
                                    "\r\nWidth OD (mm) = " + compinfo.rows[0].swidth_od_mm + 
                                    "\r\nWidth ID (mm) = " + compinfo.rows[0].swidth_id_mm + 
                                    "\r\nLength (inch) = " + compinfo.rows[0].slength_inch + 
                                    "\r\nLength (mm) = " + compinfo.rows[0].slength_mm + 
                                    "\r\nHeight (mm) = " + compinfo.rows[0].sheight_mm
                data.SubPremiumData = SubPremiumData
                totaloutput.push(data)
            } else {
                data.Competitor = null
                data.PremiumData = null
                data.SubPremiumData = null
                totaloutput.push(data)
            }
        } else if (checkPrem && !checkSubPrem) {
            const compinfo = await client.query(
                `SELECT 
                    pre.od_inch AS pod_inch, 
                    pre.od_mm AS pod_mm, 
                    pre.id_mm AS pid_mm, 
                    pre."major_dia_mm" AS pmajor_dia_mm, 
                    pre.spline AS pspline, 
                    pre.pcd_mm AS ppcd_mm,
                    pre."width_od_mm" AS pwidth_od_mm, 
                    pre."width_id_mm" AS pwidth_id_mm, 
                    pre.length_inch AS plength_inch, 
                    pre.length_mm AS plength_mm, 
                    pre.height_mm AS pheight_mm
                FROM (((((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        JOIN part p ON com.part_id = p.part_id)
                        JOIN part_aisin_premium pap on pap.part_id = p.part_id)
                        JOIN aisin_premium pre on pre.aisin_premium_id = pap.aisin_premium_id
                WHERE p.part_code = $1 AND pre.aisin_premium_code = $2`, 
                    [codes[i], req.body[i].aisinPrem]
            )
            if (compinfo.rowCount > 0) {
                //Competitor Data
                const compe = await client.query(
                    `SELECT manu.manufacturer_name
                    FROM (((((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        JOIN part p ON com.part_id = p.part_id)
                        JOIN part_aisin_premium pap on pap.part_id = p.part_id)
                        JOIN aisin_premium pre on pre.aisin_premium_id = pap.aisin_premium_id
                        WHERE p.part_code = $1 AND pre.aisin_premium_code = $2`,
                        [codes[i], req.body[i].aisinPrem]
                )
                if (compe.rowCount > 0) {
                    data.Competitor = compe.rows[0].manufacturer_name
                } else {
                    data.Competitor = ""
                }
                //Parts Premium Data
                var PremiumData =   "OD (mm) = " + compinfo.rows[0].pod_mm +
                                    "\r\nOD (inch) = " + compinfo.rows[0].pod_inch + 
                                    "\r\nID (mm) = " + compinfo.rows[0].pid_mm + 
                                    "\r\nMajor D. (mm) = " + compinfo.rows[0].pmajor_dia_mm + 
                                    "\r\nSpline = " + compinfo.rows[0].pspline + 
                                    "\r\nPCD (mm) = " + compinfo.rows[0].ppcd_mm + 
                                    "\r\nWidth OD (mm) = " + compinfo.rows[0].pwidth_od_mm + 
                                    "\r\nWidth ID (mm) = " + compinfo.rows[0].pwidth_id_mm + 
                                    "\r\nLength (inch) = " + compinfo.rows[0].plength_inch + 
                                    "\r\nLength (mm) = " + compinfo.rows[0].plength_mm + 
                                    "\r\nHeight (mm) = " + compinfo.rows[0].pheight_mm
                data.PremiumData = PremiumData
                //Parts Sub-Premium Data
                var SubPremiumData= null
                data.SubPremiumData = SubPremiumData
                totaloutput.push(data)
            } else {
                data.Competitor = null
                data.PremiumData = null
                data.SubPremiumData = null
                totaloutput.push(data)
            }
        } else if (checkPrem && checkSubPrem) {
            const compinfo = await client.query(
                `SELECT 
                    pre.od_inch AS pod_inch, 
                    pre.od_mm AS pod_mm, 
                    pre.id_mm AS pid_mm, 
                    pre."major_dia_mm" AS pmajor_dia_mm, 
                    pre.spline AS pspline, 
                    pre.pcd_mm AS ppcd_mm,
                    pre."width_od_mm" AS pwidth_od_mm, 
                    pre."width_id_mm" AS pwidth_id_mm, 
                    pre.length_inch AS plength_inch, 
                    pre.length_mm AS plength_mm, 
                    pre.height_mm AS pheight_mm,
                    sub.od_inch AS sod_inch, 
                    sub.od_mm AS sod_mm, 
                    sub.id_mm AS sid_mm, 
                    sub."major_dia_mm" AS smajor_dia_mm, 
                    sub.spline AS sspline, 
                    sub.pcd_mm AS spcd_mm,
                    sub."width_od_mm" AS swidth_od_mm, 
                    sub."width_id_mm" AS swidth_id_mm, 
                    sub.length_inch AS slength_inch, 
                    sub.length_mm AS slength_mm, 
                    sub.height_mm AS sheight_mm
                FROM ((((part p 
					join part_aisin_premium pap on p.part_id = pap.part_id)
					join aisin_premium pre on pap.aisin_premium_id = pre.aisin_premium_id)
					join part_aisin_sub_premium pas on p.part_id = pas.part_id)
					join aisin_sub_premium sub on pas.aisin_sub_premium_id = sub.aisin_sub_premium_id)
                WHERE p.part_code = $1 AND pre.aisin_premium_code = $2 AND sub.aisin_sub_premium_code = $3`, 
                    [codes[i], req.body[i].aisinPrem, req.body[i].aisinSubPrem]
            )
            if (compinfo.rowCount > 0) {
                //Competitor Data
                const compe = await client.query(
                    `SELECT manu.manufacturer_name
                    FROM (((((((part p 
                        join part_aisin_premium pap on p.part_id = pap.part_id)
                        join aisin_premium pre on pap.aisin_premium_id = pre.aisin_premium_id)
                        join part_aisin_sub_premium pas on p.part_id = pas.part_id)
                        join aisin_sub_premium sub on pas.aisin_sub_premium_id = sub.aisin_sub_premium_id)
                        join part_competiter_info pci on p.part_id = pci.part_id)
                        join manufacturer manu on manu.manufacturer_id = pci.manufacturer_id))
                        WHERE p.part_code = $1 AND pre.aisin_premium_code = $2 AND sub.aisin_sub_premium_code = $3`,
                        [codes[i], req.body[i].aisinPrem, req.body[i].aisinSubPrem]
                )
                if (compe.rowCount > 0) {
                    data.Competitor = compe.rows[0].manufacturer_name
                } else {
                    data.Competitor = ""
                }
                //Parts Premium Data
                var PremiumData =   "OD (mm) = " + compinfo.rows[0].pod_mm +
                                    "\r\nOD (inch) = " + compinfo.rows[0].pod_inch + 
                                    "\r\nID (mm) = " + compinfo.rows[0].pid_mm + 
                                    "\r\nMajor D. (mm) = " + compinfo.rows[0].pmajor_dia_mm + 
                                    "\r\nSpline = " + compinfo.rows[0].pspline + 
                                    "\r\nPCD (mm) = " + compinfo.rows[0].ppcd_mm + 
                                    "\r\nWidth OD (mm) = " + compinfo.rows[0].pwidth_od_mm + 
                                    "\r\nWidth ID (mm) = " + compinfo.rows[0].pwidth_id_mm + 
                                    "\r\nLength (inch) = " + compinfo.rows[0].plength_inch + 
                                    "\r\nLength (mm) = " + compinfo.rows[0].plength_mm + 
                                    "\r\nHeight (mm) = " + compinfo.rows[0].pheight_mm
                data.PremiumData = PremiumData
                //Parts Sub-Premium Data
                var SubPremiumData= "OD (mm) = " + compinfo.rows[0].sod_mm +
                                    "\r\nOD (inch) = " + compinfo.rows[0].sod_inch + 
                                    "\r\nID (mm) = " + compinfo.rows[0].sid_mm + 
                                    "\r\nMajor D. (mm) = " + compinfo.rows[0].smajor_dia_mm + 
                                    "\r\nSpline = " + compinfo.rows[0].sspline + 
                                    "\r\nPCD (mm) = " + compinfo.rows[0].spcd_mm + 
                                    "\r\nWidth OD (mm) = " + compinfo.rows[0].swidth_od_mm + 
                                    "\r\nWidth ID (mm) = " + compinfo.rows[0].swidth_id_mm + 
                                    "\r\nLength (inch) = " + compinfo.rows[0].slength_inch + 
                                    "\r\nLength (mm) = " + compinfo.rows[0].slength_mm + 
                                    "\r\nHeight (mm) = " + compinfo.rows[0].sheight_mm
                data.SubPremiumData = SubPremiumData
                totaloutput.push(data)
            } else {
                data.Competitor = null
                data.PremiumData = null
                data.SubPremiumData = null
                totaloutput.push(data)
            }
        } else {
            const compinfo = await client.query(
                `SELECT 
                    manu.manufacturer_name
                FROM ((((((((((((((((car_information c  
                    join ms_model_code m on c.model_code_id = m.model_code_id)
                    join ms_transmission t on c.transmission_type_id = t.transmission_type_id)
                    join car_model car on c.car_model_id = car.car_model_id)
                    join ms_fuel_type f on c.fuel_type_id = f.fuel_type_id)
                    join ms_powered_type p on c.power_type_id = p.powered_type_id)
                    join ms_displacement d on c.displacement_id = d.displacement_id)
                    join car_series series on car.car_series_id = series.car_series_id)
                    join car_brand brand on series.car_brand_id = brand.car_brand_id)
                    join manufacturer manu on brand.manufacturer_id = manu.manufacturer_id)
                    join part_name_mapping map on manu.manufacturer_name = map.manufacturer_name)
                    join part on map.part_name_mappping_id = part.part_name_mappping_id)
                    join ms_drivetrain drive on c.drivetrain_id = drive.drivetrain_id)
                    join part_aisin_sub_premium psub on part.part_id = psub.part_id)
                    join aisin_sub_premium sub on psub.aisin_sub_premium_id = sub.aisin_sub_premium_id)
                    join part_aisin_premium ppre on part.part_id = ppre.part_id)
                    join aisin_premium pre on ppre.aisin_premium_id = pre.aisin_premium_id)
                WHERE part.part_code = $1`, 
                    [codes[i]]
            )
            if (compinfo.rowCount > 0) {
                //Competitor Data
                data.Competitor = compinfo.rows[0].manufacturer_name;
                //Parts Premium Data
                var PremiumData = null
                data.PremiumData = PremiumData
                //Parts Sub-Premium Data
                var SubPremiumData = null
                data.SubPremiumData = SubPremiumData
                totaloutput.push(data)
            } else {
                data.Competitor = null
                data.PremiumData = null
                data.SubPremiumData = null
                totaloutput.push(data)
            }
        }
    }
    for (let i = 0; i < totaloutput.length; i++) {
        for (let j = i+1; j < totaloutput.length; j++) {
            if (totaloutput[i]===totaloutput[j]) {
                totaloutput.splice(j, 1);
                j=i+1;
            }
        }
    }
    res.json({Export: totaloutput})
})

router.route("/downpart").post( (req, res) => {
    const CellName = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var data = req.body.fileData;
    var wb = new excel.Workbook()
    wb.xlsx.readFile("bin/constants/PartsTemplate.xlsx")
    .then(function() {
        var ws = wb.getWorksheet(1)
        let i = 0
        while(Object.values(data)[i]) {
            var row = ws.getRow(i+2)
            row.height = 168
            row.getCell(1).value = Object.values(data)[i].OE
            row.getCell(2).value = Object.values(data)[i].AisinPremium
            row.getCell(3).value = Object.values(data)[i].AisinSubpremium
            row.getCell(4).value = Object.values(data)[i].PartGroup
            row.getCell(5).value = Object.values(data)[i].PartName
            row.getCell(6).value = Object.values(data)[i].Competitor
            row.getCell(7).value = Object.values(data)[i].PremiumDimensionValue
            row.getCell(8).value = Object.values(data)[i].SubPremiumDimensionValue
            row.commit()
            for (let j = 0; j < CellName.length; j++) {
                let Cell = CellName[j]+(i+2)
                ws.getCell(Cell).border = {
                    top: {style:'thin', color: {argb:'00000000'}},
                    left: {style:'thin', color: {argb:'00000000'}},
                    bottom: {style:'thin', color: {argb:'00000000'}},
                    right: {style:'thin', color: {argb:'00000000'}}
                }
            }
            i=i+1
        }
            //Response
        const fileName = req.body.fileName+".xlsx"
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        )
        wb.xlsx.write(res).then(() => {
            res.end()
        })
    })
})

router.route("/vehicledown").post(async (req, res) => {
    var aisincode = []

    for (let i = 0; i < req.body.length; i++) {
        const aicode = await client.query(
            `SELECT aisin_vehicle_code FROM public.car_information
            WHERE car_info_id = $1
            ORDER BY car_info_id ASC`, [req.body[i].car_info_id]
        )
        aisincode.push(aicode.rows[0].aisin_vehicle_code)
    }
    res.json(aisincode)
})

router.route("/downvehicle").post( (req, res) => {
    const CellName = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var data = req.body.fileData;
    var wb = new excel.Workbook()
    wb.xlsx.readFile("bin/constants/VehicleTemplate.xlsx")
    .then(function() {
        var ws = wb.getWorksheet(1)
        let i = 0
        while(Object.values(data)[i]) {
            var row = ws.getRow(i+2)
            row.height = 70.5
            row.getCell(1).value = parseInt(i+1)
            row.getCell(2).value = Object.values(data)[i].CarMaker
            row.getCell(3).value = Object.values(data)[i].ModelName
            row.getCell(4).value = Object.values(data)[i].ModelCode
            row.getCell(5).value = parseInt(Object.values(data)[i].From)
            row.getCell(6).value = parseInt(Object.values(data)[i].To)
            row.getCell(7).value = Object.values(data)[i].DriversPosition
            row.getCell(8).value = Object.values(data)[i].EngineCode
            row.getCell(9).value = Object.values(data)[i].Displacement
            row.getCell(10).value = Object.values(data)[i].PoweredType
            row.getCell(11).value = Object.values(data)[i].FuelType
            row.getCell(12).value = Object.values(data)[i].TransmissionCode
            row.getCell(13).value = Object.values(data)[i].TransmissionType
            row.getCell(14).value = Object.values(data)[i].Speed
            row.getCell(15).value = Object.values(data)[i].DriveTrain
            row.getCell(16).value = Object.values(data)[i].VehicleCode
            row.commit()
            for (let j = 0; j < CellName.length; j++) {
                let Cell = CellName[j]+(i+2)
                ws.getCell(Cell).border = {
                    top: {style:'thin', color: {argb:'00000000'}},
                    left: {style:'thin', color: {argb:'00000000'}},
                    bottom: {style:'thin', color: {argb:'00000000'}},
                    right: {style:'thin', color: {argb:'00000000'}}
                }
            }
            i=i+1
        }
            //Response
        const fileName = req.body.fileName+".xlsx"
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        )
        wb.xlsx.write(res).then(() => {
            res.end()
        })
    })
})

router.route("/vehicledown").post(async (req, res) => {
    var aisincode = []
    for (let i = 0; i < req.body.length; i++) {
        const aicode = await client.query(
            `SELECT aisin_vehicle_code FROM public.car_information
            WHERE car_info_id = $1
            ORDER BY car_info_id ASC`, [req.body[i].car_info_id]
        )
        aisincode.push(aicode.rows[0].aisin_vehicle_code)
    }
    res.json(aisincode)
})

router.route("/downresultlist").post( (req, res) => {
    const CellName = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var data = req.body.fileData;
    var wb = new excel.Workbook()
    wb.xlsx.readFile("bin/constants/ResultListTemplate.xlsx")
    .then(function() {
        var ws = wb.getWorksheet(1)
        let i = 0
        while(Object.values(data)[i]) {
            var row = ws.getRow(i+3)
            row.height = 26.25
            row.getCell(1).value = parseInt(i+1)
            row.getCell(2).value = Object.values(data)[i].CarMaker
            row.getCell(3).value = Object.values(data)[i].ModelName
            row.getCell(4).value = Object.values(data)[i].ModelCode
            row.getCell(5).value = parseInt(Object.values(data)[i].From)
            row.getCell(6).value = parseInt(Object.values(data)[i].To)
            row.getCell(7).value = Object.values(data)[i].DriversPosition
            row.getCell(8).value = Object.values(data)[i].EngineCode
            row.getCell(9).value = Object.values(data)[i].Displacement
            row.getCell(10).value = Object.values(data)[i].PoweredType
            row.getCell(11).value = Object.values(data)[i].FuelType
            row.getCell(12).value = Object.values(data)[i].TransmissionCode
            row.getCell(13).value = Object.values(data)[i].TransmissionType
            row.getCell(14).value = Object.values(data)[i].Speed
            row.getCell(15).value = Object.values(data)[i].DriveTrain
            row.getCell(16).value = Object.values(data)[i].OEL
            row.getCell(17).value = Object.values(data)[i].AisinPremiumL
            row.getCell(18).value = Object.values(data)[i].AisinSubPremiumL
            row.getCell(19).value = Object.values(data)[i].OER
            row.getCell(20).value = Object.values(data)[i].AisinPremiumR
            row.getCell(21).value = Object.values(data)[i].AisinSubPremiumR
            row.getCell(22).value = Object.values(data)[i].VehicleCode
            row.commit()
            for (let j = 0; j < CellName.length; j++) {
                let Cell = CellName[j]+(i+3)
                ws.getCell(Cell).border = {
                    top: {style:'thin', color: {argb:'00000000'}},
                    left: {style:'thin', color: {argb:'00000000'}},
                    bottom: {style:'thin', color: {argb:'00000000'}},
                    right: {style:'thin', color: {argb:'00000000'}}
                }
            }
            i=i+1
        }
            //Response
        const fileName = req.body.fileName+".xlsx"
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        )
        wb.xlsx.write(res).then(() => {
            res.end()
        })
    })
})

router.route("/downresultpart").post( (req, res) => {
    const CellName = ["A", "B", "C", "D", "E", "F", "G"]
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    var data = req.body.fileData;
    var wb = new excel.Workbook()
    wb.xlsx.readFile("bin/constants/ResultPartsTemplate.xlsx")
    .then(function() {
        var ws = wb.getWorksheet(1) 
        let i = 0
        while(Object.values(data)[i]) {
            var row = ws.getRow(i+2)
            row.height = 168
            row.getCell(1).value = Object.values(data)[i].OE
            row.getCell(2).value = Object.values(data)[i].AisinPremium
            row.getCell(3).value = Object.values(data)[i].AisinSubpremium
            row.getCell(4).value = Object.values(data)[i].PartName
            row.getCell(5).value = Object.values(data)[i].Competitor
            row.getCell(6).value = Object.values(data)[i].PremiumDimensionValue
            row.getCell(7).value = Object.values(data)[i].SubPremiumDimensionValue
            row.commit()
            for (let j = 0; j < CellName.length; j++) {
                let Cell = CellName[j]+(i+2)
                ws.getCell(Cell).border = {
                    top: {style:'thin', color: {argb:'00000000'}},
                    left: {style:'thin', color: {argb:'00000000'}},
                    bottom: {style:'thin', color: {argb:'00000000'}},
                    right: {style:'thin', color: {argb:'00000000'}}
                }
            }
            i=i+1
        }
            //Response
        const fileName = req.body.fileName+".xlsx"
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${fileName}"`
        )
        wb.xlsx.write(res).then(() => {
            res.end()
        })
    })
})

module.exports = router