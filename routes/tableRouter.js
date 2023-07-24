const express = require("express");
const router = express.Router();
const client = require("./connectdb");

router.route("/result").post(async (req, res) => {
    try {
        var countryData = [];
        var manuData = [];
        var modelData = [];
        var codeData = [];
        var driverData = [];
        var yearData = [];
        var engineData = [];
        var displacementData = [];
        var fuelData = [];
        var transmissionData = [];
        var speedData = [];
        var drivetrainData = [];
        var partData = [];
        var oeData = [];
        var aisinData = [];
        var competitorData = [];

        var mergeData = [];

        let count = 0;

        for (let i = 0; i < req.body.country_name.length; i++) {
            const country = await client.query(
                `SELECT info.car_info_id, country.country_name from ((ms_country country 
                    join car_model model on country.country_id = model.country_id)
                    join car_information info on model.car_model_id = info.car_model_id)
                    WHERE country.country_name = $1`,
                [req.body.country_name[i]]
            );
            countryData = country.rows;
            for (let i = 0; i < countryData.length; i++) {
                mergeData.push(countryData[i].car_info_id);
            }
        }
        for (let i = 0; i < req.body.manufacturer_name.length; i++) {
            const manufacturer = await client.query(
                `SELECT info.car_info_id, manu.manufacturer_name from ((((manufacturer manu 
                    join car_brand brand on manu.manufacturer_id = brand.manufacturer_id)
                    join car_series series on brand.car_brand_id = series.car_brand_id)
                    join car_model model on series.car_series_id = model.car_series_id)
                    join car_information info on model.car_model_id = info.car_model_id)
                    WHERE manu.manufacturer_name =  $1`,
                [req.body.manufacturer_name[i]]
            );
            manuData = manufacturer.rows;
            for (let i = 0; i < manuData.length; i++) {
                mergeData.push(manuData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.car_model_name.length; i++) {
            const car_model_name = await client.query(
                `SELECT info.car_info_id, model.car_model_name from (car_model model 
                    join car_information info on model.car_model_id = info.car_model_id)
                    WHERE model.car_model_name =  $1`,
                [req.body.car_model_name[i]]
            );
            modelData = car_model_name.rows;
            for (let i = 0; i < modelData.length; i++) {
                mergeData.push(modelData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.model_code.length; i++) {
            const model_code = await client.query(
                `SELECT info.car_info_id, code.model_code from (ms_model_code code 
                    join car_information info on code.model_code_id = info.model_code_id)
                    WHERE code.model_code =  $1`,
                [req.body.model_code[i]]
            );
            codeData = model_code.rows;
            for (let i = 0; i < codeData.length; i++) {
                mergeData.push(codeData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.drivers_position.length; i++) {
            const drivers_position = await client.query(
                `SELECT info.car_info_id, info.drivers_position from car_information info 
                    WHERE info.drivers_position =  $1`,
                [req.body.drivers_position[i]]
            );
            driverData = drivers_position.rows;
            for (let i = 0; i < driverData.length; i++) {
                mergeData.push(driverData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.year.length; i++) {
            const year = await client.query(
                `SELECT info.car_info_id, info.start_of_production from car_information info 
                WHERE SUBSTRING(info.start_of_production,1, 4) = $1`,
                [req.body.year[i]]
            );
            yearData = year.rows;
            for (let i = 0; i < yearData.length; i++) {
                mergeData.push(yearData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.engine_model.length; i++) {
            const engine_model = await client.query(
                `SELECT info.car_info_id, info.engine_model from car_information info 
                    WHERE info.engine_model =  $1`,
                [req.body.engine_model[i]]
            );
            engineData = engine_model.rows;
            for (let i = 0; i < engineData.length; i++) {
                mergeData.push(engineData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.displacement_code.length; i++) {
            const displacement = await client.query(
                `SELECT info.car_info_id, dis.displacement_code from (ms_displacement dis 
                    join car_information info on dis.displacement_id = info.displacement_id)
                    WHERE dis.displacement_code =  $1`,
                [req.body.displacement_code[i]]
            );
            displacementData = displacement.rows;
            for (let i = 0; i < displacementData.length; i++) {
                mergeData.push(displacementData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.fuel_type.length; i++) {
            const fuel = await client.query(
                `SELECT info.car_info_id, fuel.fuel_type from (ms_fuel_type fuel 
                    join car_information info on fuel.fuel_type_id = info.fuel_type_id)
                    WHERE fuel.fuel_type =  $1`,
                [req.body.fuel_type[i]]
            );
            fuelData = fuel.rows;
            for (let i = 0; i < fuelData.length; i++) {
                mergeData.push(fuelData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.transmission_type.length; i++) {
            const transmission = await client.query(
                `SELECT info.car_info_id, trans.transmission_type from (ms_transmission trans 
                    join car_information info on trans.transmission_type_id = info.transmission_type_id)
                    WHERE trans.transmission_type =  $1`,
                [req.body.transmission_type[i]]
            );
            transmissionData = transmission.rows;
            for (let i = 0; i < transmissionData.length; i++) {
                mergeData.push(transmissionData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.speed.length; i++) {
            const speed = await client.query(
                `SELECT info.car_info_id, trans.speed from (ms_transmission trans 
                    join car_information info on trans.transmission_type_id = info.transmission_type_id)
                    WHERE trans.speed =  $1`,
                [req.body.speed[i]]
            );
            speedData = speed.rows;
            for (let i = 0; i < speedData.length; i++) {
                mergeData.push(speedData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.drivetrain.length; i++) {
            const drivetrain = await client.query(
                `SELECT info.car_info_id, drive.drivetrain from (ms_drivetrain drive
                    join car_information info on drive.drivetrain_id = info.drivetrain_id)
                    WHERE drive.drivetrain =  $1`,
                [req.body.drivetrain[i]]
            );
            drivetrainData = drivetrain.rows;
            for (let i = 0; i < drivetrainData.length; i++) {
                mergeData.push(drivetrainData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.aisin_part_name.length; i++) {
            const aisin_part_name = await client.query(
                `SELECT info.car_info_id, map.aisin_part_name from (((((manufacturer manu 
                    join car_brand brand on manu.manufacturer_id = brand.manufacturer_id)
                    join car_series series on brand.car_brand_id = series.car_brand_id)
                    join car_model model on series.car_series_id = model.car_series_id)
                    join car_information info on model.car_model_id = info.car_model_id)
					join part_name_mapping map on manu.manufacturer_id = map.manufacturer_id)
                    WHERE map.aisin_part_name =  $1`,
                [req.body.aisin_part_name[i]]
            );
            partData = aisin_part_name.rows;
            for (let i = 0; i < partData.length; i++) {
                mergeData.push(partData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.part_code.length; i++) {
            const part_code = await client.query(
                `SELECT info.car_info_id, part.part_code from ((((((manufacturer manu 
                    join car_brand brand on manu.manufacturer_id = brand.manufacturer_id)
                    join car_series series on brand.car_brand_id = series.car_brand_id)
                    join car_model model on series.car_series_id = model.car_series_id)
                    join car_information info on model.car_model_id = info.car_model_id)
					join part_name_mapping map on manu.manufacturer_id = map.manufacturer_id)
					join part on map.part_sub_group_id = part.part_sub_group_id)
                    WHERE part.part_code =  $1`,
                [req.body.part_code[i]]
            );
            oeData = part_code.rows;
            for (let i = 0; i < oeData.length; i++) {
                mergeData.push(oeData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.aisin_premium_code.length; i++) {
            const aisin_premium_code = await client.query(
                `SELECT info.car_info_id, a.aisin_premium_code from ((((((((manufacturer manu 
                    join car_brand brand on manu.manufacturer_id = brand.manufacturer_id)
                    join car_series series on brand.car_brand_id = series.car_brand_id)
                    join car_model model on series.car_series_id = model.car_series_id)
                    join car_information info on model.car_model_id = info.car_model_id)
					join part_name_mapping map on manu.manufacturer_id = map.manufacturer_id)
					join part on map.part_sub_group_id = part.part_sub_group_id)
					join part_aisin_premium ppre on part.part_id = ppre.part_id)
					join aisin_premium a on ppre.aisin_premium_id = a.aisin_premium_id)
                    WHERE a.aisin_premium_code =  $1`,
                [req.body.aisin_premium_code[i]]
            );
            aisinData = aisin_premium_code.rows;
            for (let i = 0; i < aisinData.length; i++) {
                mergeData.push(aisinData[i].car_info_id);
            }
        }

        for (let i = 0; i < req.body.competiter_part_code.length; i++) {
            const competiter_part_code = await client.query(
                `SELECT info.car_info_id, com.competiter_part_code from (((((manufacturer manu 
                    join car_brand brand on manu.manufacturer_id = brand.manufacturer_id)
                    join car_series series on brand.car_brand_id = series.car_brand_id)
                    join car_model model on series.car_series_id = model.car_series_id)
                    join car_information info on model.car_model_id = info.car_model_id)
					join part_competiter_info com on manu.manufacturer_id = com.manufacturer_id)
                    WHERE com.competiter_part_code =  $1`,
                [req.body.competiter_part_code[i]]
            );
            competitorData = competiter_part_code.rows;
            for (let i = 0; i < competitorData.length; i++) {
                mergeData.push(competitorData[i].car_info_id);
            }
        }

        if (countryData.length != 0) count++;
        if (manuData.length != 0) count++;
        if (modelData.length != 0) count++;
        if (codeData.length != 0) count++;
        if (driverData.length != 0) count++;
        if (yearData.length != 0) count++;
        if (engineData.length != 0) count++;
        if (displacementData.length != 0) count++;
        if (fuelData.length != 0) count++;
        if (transmissionData.length != 0) count++;
        if (speedData.length != 0) count++;
        if (drivetrainData.length != 0) count++;
        if (partData.length != 0) count++;
        if (oeData.length != 0) count++;
        if (aisinData.length != 0) count++;
        if (competitorData.length != 0) count++;

        if (mergeData === 0) {
            mergeData.push("There is no car matched your search");
            res.json({ status: "There is no car matched your search" });
        } else {
            console.log(mergeData);

            var data = [];
            var freq = [];
            for (var num of mergeData) {
                freq[num] = (freq[num] || 0) + 1;
            }
            for (var key in freq) {
                if (freq[key] === count) {
                    data.push(key);
                }
            }
            console.log(data);

            var tableData = [];

            var result = [];
            for (let i = 0; i < data.length; i++) {
                const table = await client.query(
                    `SELECT c.car_info_id, m.model_code, c.start_of_production, c.end_of_production, c.drivers_position, c.engine_model, t.transmission_code, t.transmission_type, car.car_model_name, f.fuel_type, p.powered_type, d.displacement_code, manu.manufacturer_name, part.part_start_time, drive.drivetrain, pre.aisin_premium_code, sub.aisin_sub_premium_code, t.speed, part.part_code from ((((((((((((((((car_information c
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
                        WHERE c.car_info_id = $1`,
                    [data[i]]
                );

                tableData[i] = table.rows;
            }
            console.log(tableData.length);

            if (tableData == "") {
                console.log("There is no car matched your search");
                res.json({ status: "There is no car matched your search" });
            } else {
                for (let i = 0; i < tableData.length; i++) {
                    result.push({
                        car_info_id: tableData[i][i].car_info_id,
                        car_maker: tableData[i][i].manufacturer_name,
                        car_model_name: tableData[i][i].car_model_name,
                        model_code: tableData[i][i].model_code,
                        start_of_production: tableData[i][
                            i
                        ].start_of_production.substring(0, 4),
                        end_of_production: tableData[i][
                            i
                        ].end_of_production.substring(0, 4),
                        drivers_position: tableData[i][i].drivers_position,
                        engine_code: tableData[i][i].engine_model,
                        displacement_code: tableData[i][i].displacement_code,
                        powered_type: tableData[i][i].powered_type,
                        fuel_type: tableData[i][i].fuel_type,
                        transmission_code: tableData[i][i].transmission_code,
                        transmission_type: tableData[i][i].transmission_type,
                        speed: tableData[i][i].speed,
                        drivetrain: tableData[i][i].drivetrain,
                        oe: tableData[i][i].part_code,
                        part_start_time: tableData[i][i].part_start_time,
                        aisin_premium_code: tableData[i][i].aisin_premium_code,
                        aisin_sub_premium_code:
                            tableData[i][i].aisin_sub_premium_code,
                    });
                }
                res.json({
                    table: result,
                });
            }
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
