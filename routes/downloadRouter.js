const express = require("express");
const router = express.Router();
const client = require("./connectdb");
const excel = require("exceljs");
let os = require("os");
let FileSaver = require("file-saver")


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
        if (req.body[i].aisinPrem===null && req.body[i].aisinSubPrem) {
            const compinfo = await client.query(
            `SELECT 
                manu.manufacturer_name, 
                sub.od_inch AS sod_inch, 
                sub.od_mm AS sod_mm, 
                sub.id_mm AS sid_mm, 
                sub."major dia_mm" AS smajor_dia_mm, 
                sub.spline AS sspline, 
                sub.pcd_mm AS spcd_mm,
                sub."width od_mm" AS swidth_od_mm, 
                sub."width id_mm" AS swidth_id_mm, 
                sub.length_inch AS slength_inch, 
                sub.length_mm AS slength_mm, 
                sub.height_mm AS sheight_mm
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
            WHERE part.part_code = $1 AND aisin_sub_premium_code = $2`, 
                [codes[i], req.body[i].aisinSubPrem]
            )
            //Competitor Data
            data.Competitor = compinfo.rows[0].manufacturer_name;
            //Parts Premium Data
            data.PremiumData = null
            //Parts Sub-Premium Data
            var SubPremiumData= "OD (mm) = " + compinfo.rows[0].sod_mm +
                                "\r\nOD (inch) = " + compinfo.rows[0].sod_inch + 
                                "\r\nID (mm) = " + compinfo.rows[0].sid_mm + 
                                "\r\nMajor dia (mm) = " + compinfo.rows[0].smajor_dia_mm + 
                                "\r\nSpline = " + compinfo.rows[0].sspline + 
                                "\r\nPCD (mm) = " + compinfo.rows[0].spcd_mm + 
                                "\r\nWidth OD (mm) = " + compinfo.rows[0].swidth_od_mm + 
                                "\r\nWidth ID (mm) = " + compinfo.rows[0].swidth_id_mm + 
                                "\r\nLength (inch) = " + compinfo.rows[0].slength_inch + 
                                "\r\nLength (mm) = " + compinfo.rows[0].slength_mm + 
                                "\r\nHeight (mm) = " + compinfo.rows[0].sheight_mm
            data.SubPremiumData = SubPremiumData
            totaloutput.push(data)
        } else if (req.body[i].aisinSubPrem===null && req.body[i].aisinPrem) {
            const compinfo = await client.query(
                `SELECT 
                    manu.manufacturer_name, 
                    pre.od_inch AS pod_inch, 
                    pre.od_mm AS pod_mm, 
                    pre.id_mm AS pid_mm, 
                    pre."major dia_mm" AS pmajor_dia_mm, 
                    pre.spline AS pspline, 
                    pre.pcd_mm AS ppcd_mm,
                    pre."width od_mm" AS pwidth_od_mm, 
                    pre."width id_mm" AS pwidth_id_mm, 
                    pre.length_inch AS plength_inch, 
                    pre.length_mm AS plength_mm, 
                    pre.height_mm AS pheight_mm
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
                WHERE part.part_code = $1 AND aisin_premium_code = $2`, 
                    [codes[i], req.body[i].aisinPrem]
            )
            //Competitor Data
            data.Competitor = compinfo.rows[0].manufacturer_name;
            //Parts Premium Data
            var PremiumData =   "OD (mm) = " + compinfo.rows[0].pod_mm +
                                "\r\nOD (inch) = " + compinfo.rows[0].pod_inch + 
                                "\r\nID (mm) = " + compinfo.rows[0].pid_mm + 
                                "\r\nMajor dia (mm) = " + compinfo.rows[0].pmajor_dia_mm + 
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
        } else if (req.body[i].aisinPrem && req.body[i].aisinSubPrem) {
            const compinfo = await client.query(
                `SELECT 
                    manu.manufacturer_name, 
                    pre.od_inch AS pod_inch, 
                    pre.od_mm AS pod_mm, 
                    pre.id_mm AS pid_mm, 
                    pre."major dia_mm" AS pmajor_dia_mm, 
                    pre.spline AS pspline, 
                    pre.pcd_mm AS ppcd_mm,
                    pre."width od_mm" AS pwidth_od_mm, 
                    pre."width id_mm" AS pwidth_id_mm, 
                    pre.length_inch AS plength_inch, 
                    pre.length_mm AS plength_mm, 
                    pre.height_mm AS pheight_mm,
                    sub.od_inch AS sod_inch, 
                    sub.od_mm AS sod_mm, 
                    sub.id_mm AS sid_mm, 
                    sub."major dia_mm" AS smajor_dia_mm, 
                    sub.spline AS sspline, 
                    sub.pcd_mm AS spcd_mm,
                    sub."width od_mm" AS swidth_od_mm, 
                    sub."width id_mm" AS swidth_id_mm, 
                    sub.length_inch AS slength_inch, 
                    sub.length_mm AS slength_mm, 
                    sub.height_mm AS sheight_mm
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
                WHERE part.part_code = $1 AND aisin_premium_code = $2 AND aisin_sub_premium_code = $3`, 
                    [codes[i], req.body[i].aisinPrem, req.body[i].aisinSubPrem]
            )
            //Competitor Data
            data.Competitor = compinfo.rows[0].manufacturer_name;
            //Parts Premium Data
            var PremiumData =   "OD (mm) = " + compinfo.rows[0].pod_mm +
                                "\r\nOD (inch) = " + compinfo.rows[0].pod_inch + 
                                "\r\nID (mm) = " + compinfo.rows[0].pid_mm + 
                                "\r\nMajor dia (mm) = " + compinfo.rows[0].pmajor_dia_mm + 
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
                                "\r\nMajor dia (mm) = " + compinfo.rows[0].smajor_dia_mm + 
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
            //Competitor Data
            data.Competitor = compinfo.rows[0].manufacturer_name;
            //Parts Premium Data
            var PremiumData = null
            data.PremiumData = PremiumData
            //Parts Sub-Premium Data
            var SubPremiumData = null
            data.SubPremiumData = SubPremiumData
            totaloutput.push(data)
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
        // Object.keys(data).forEach(count+1)
        // console.log(count)
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
        const fileName = req.body.fileName+".xls"
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