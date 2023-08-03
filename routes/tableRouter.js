const express = require("express");
const router = express.Router();
const client = require("./connectdb");

router.route("/result").post(async (req, res) => {
    try {
        var resultTable = [];
        if (req.body === "All") {
            var result = [];
            const table = await client.query(
                `SELECT car.car_info_id, car.start_of_production, car.end_of_production, car.engine_model, car.drivers_position, manu.manufacturer_name, model.car_model_name, power.powered_type, fuel.fuel_type, dis.displacement_code, trans.transmission_code, trans.transmission_type, trans.speed, drive.drivetrain, code.model_code, p.part_code, pmap.aisin_part_name, p.part_start_time, p.part_end_time, pre.aisin_premium_code, spre.aisin_sub_premium_code from (((((((((((((((((car_information car
                    JOIN car_model model ON car.car_model_id = model.car_model_id)
                    JOIN car_series series ON model.car_series_id = series.car_series_id)
                    JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                    JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                    JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                    JOIN part p ON com.part_id = p.part_id)
                    JOIN part_name_mapping pmap ON p.part_name_mappping_id = pmap.part_name_mappping_id)
                    FULL OUTER JOIN part_aisin_premium ppre ON p.part_id = ppre.part_id)
                    FULL OUTER JOIN aisin_premium pre ON ppre.aisin_premium_id = pre.aisin_premium_id)
                    FULL OUTER JOIN part_aisin_sub_premium pspre ON p.part_id = pspre.part_id)
                    FULL OUTER JOIN aisin_sub_premium spre ON pspre.aisin_sub_premium_id = spre.aisin_sub_premium_id)
                    JOIN ms_powered_type power ON car.power_type_id = power.powered_type_id)
                    JOIN ms_fuel_type fuel ON car.fuel_type_id = fuel.fuel_type_id)
                    JOIN ms_displacement dis ON car.displacement_id = dis.displacement_id)
                    JOIN ms_transmission trans ON car.transmission_type_id = trans.transmission_type_id)
                    JOIN ms_drivetrain drive ON car.drivetrain_id = drive.drivetrain_id)
                    JOIN ms_model_code code ON car.model_code_id = code.model_code_id)`
            );
            tableData = table.rows;
            for (let i = 0; i < tableData.length; i++) {
                result.push(tableData[i]);
            }
            for (let i = 0; i < result.length; i++) {
                resultTable.push({
                    car_info_id: result[i].car_info_id, //
                    car_maker: result[i].manufacturer_name, //
                    car_model_name: result[i].car_model_name, //
                    model_code: result[i].model_code,
                    start_of_production: result[
                        i
                    ].start_of_production.substring(0, 4), //
                    end_of_production: result[i].end_of_production.substring(
                        0,
                        4
                    ), //
                    drivers_position: result[i].drivers_position, //
                    engine_code: result[i].engine_model, //
                    displacement_code: result[i].displacement_code,
                    powered_type: result[i].powered_type,
                    fuel_type: result[i].fuel_type,
                    transmission_code: result[i].transmission_code,
                    transmission_type: result[i].transmission_type,
                    speed: result[i].speed,
                    drivetrain: result[i].drivetrain,
                    oe: result[i].part_code,
                    part_end_time: result[i].part_end_time.substring(2, 4),
                    part_start_time: result[i].part_start_time.substring(2, 4),
                    aisin_premium_code: result[i].aisin_premium_code,
                    aisin_sub_premium_code: result[i].aisin_sub_premium_code,
                    aisin_part_name: result[i].aisin_part_name,
                });
            }
            res.json({
                table: resultTable,
            });
        } else {
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
                    `SELECT car.car_info_id, pmap.aisin_part_name from (((((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        JOIN part p ON com.part_id = p.part_id)
                        JOIN part_name_mapping pmap ON p.part_name_mappping_id = pmap.part_name_mappping_id)
                        WHERE pmap.aisin_part_name =  $1`,
                    [req.body.aisin_part_name[i]]
                );
                partData = aisin_part_name.rows;
                for (let i = 0; i < partData.length; i++) {
                    mergeData.push(partData[i].car_info_id);
                }
            }

            for (let i = 0; i < req.body.part_code.length; i++) {
                const part_code = await client.query(
                    `SELECT car.car_info_id, p.part_code from ((((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        JOIN part p ON com.part_id = p.part_id)
                        WHERE p.part_code =  $1`,
                    [req.body.part_code[i]]
                );
                oeData = part_code.rows;
                for (let i = 0; i < oeData.length; i++) {
                    mergeData.push(oeData[i].car_info_id);
                }
            }

            for (let i = 0; i < req.body.aisin_premium_code.length; i++) {
                const aisin_premium_code = await client.query(
                    `SELECT car.car_info_id, pre.aisin_premium_code from (((((((((car_information car
                            JOIN car_model model ON car.car_model_id = model.car_model_id)
                            JOIN car_series series ON model.car_series_id = series.car_series_id)
                            JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                            JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                            JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                            JOIN part p ON com.part_id = p.part_id)
                            JOIN part_name_mapping pmap ON p.part_name_mappping_id = pmap.part_name_mappping_id)
                            FULL OUTER JOIN part_aisin_premium ppre ON p.part_id = ppre.part_id)
                            FULL OUTER JOIN aisin_premium pre ON ppre.aisin_premium_id = pre.aisin_premium_id)
                            WHERE pre.aisin_premium_code =  $1`,
                    [req.body.aisin_premium_code[i]]
                );
                aisinData = aisin_premium_code.rows;
                for (let i = 0; i < aisinData.length; i++) {
                    mergeData.push(aisinData[i].car_info_id);
                }
            }

            for (let i = 0; i < req.body.competiter_part_code.length; i++) {
                const competiter_part_code = await client.query(
                    `SELECT car.car_info_id, com.competiter_part_code (((((car_information car
                        JOIN car_model model ON car.car_model_id = model.car_model_id)
                        JOIN car_series series ON model.car_series_id = series.car_series_id)
                        JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                        JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                        JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                        WHERE com.competiter_part_code =  $1`,
                    [req.body.competiter_part_code[i]]
                );
                competitorData = competiter_part_code.rows;
                for (let i = 0; i < competitorData.length; i++) {
                    mergeData.push(competitorData[i].car_info_id);
                }
            }

            if (req.body.country_name.length != 0) count++;
            if (req.body.manufacturer_name.length != 0) count++;
            if (req.body.car_model_name.length != 0) count++;
            if (req.body.model_code.length != 0) count++;
            if (req.body.drivers_position.length != 0) count++;
            if (req.body.year.length != 0) count++;
            if (req.body.engine_model.length != 0) count++;
            if (req.body.displacement_code.length != 0) count++;
            if (req.body.fuel_type.length != 0) count++;
            if (req.body.transmission_type.length != 0) count++;
            if (req.body.speed.length != 0) count++;
            if (req.body.drivetrain.length != 0) count++;
            if (req.body.aisin_part_name.length != 0) count++;
            if (req.body.part_code.length != 0) count++;
            if (req.body.aisin_premium_code.length != 0) count++;
            if (req.body.competiter_part_code.length != 0) count++;

            if (mergeData === 0) {
                mergeData.push("There is no car matched your search");
                res.json({ status: "There is no car matched your search" });
            } else {
                // console.log(mergeData);

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
                // console.log(data);

                var tableData = [];

                var result = [];
                for (let i = 0; i < data.length; i++) {
                    const table = await client.query(
                        `SELECT car.car_info_id, car.start_of_production, car.end_of_production, car.engine_model, car.drivers_position, manu.manufacturer_name, model.car_model_name, power.powered_type, fuel.fuel_type, dis.displacement_code, trans.transmission_code, trans.transmission_type, trans.speed, drive.drivetrain, code.model_code, p.part_code, pmap.aisin_part_name, p.part_start_time, p.part_end_time, pre.aisin_premium_code, spre.aisin_sub_premium_code from (((((((((((((((((car_information car
                            JOIN car_model model ON car.car_model_id = model.car_model_id)
                            JOIN car_series series ON model.car_series_id = series.car_series_id)
                            JOIN car_brand brand ON series.car_brand_id = brand.car_brand_id)
                            JOIN manufacturer manu ON brand.manufacturer_id = manu.manufacturer_id)
                            JOIN part_competiter_info com ON manu.manufacturer_id = com.manufacturer_id)
                            JOIN part p ON com.part_id = p.part_id)
                            JOIN part_name_mapping pmap ON p.part_name_mappping_id = pmap.part_name_mappping_id)
                            FULL OUTER JOIN part_aisin_premium ppre ON p.part_id = ppre.part_id)
                            FULL OUTER JOIN aisin_premium pre ON ppre.aisin_premium_id = pre.aisin_premium_id)
                            FULL OUTER JOIN part_aisin_sub_premium pspre ON p.part_id = pspre.part_id)
                            FULL OUTER JOIN aisin_sub_premium spre ON pspre.aisin_sub_premium_id = spre.aisin_sub_premium_id)
                            JOIN ms_powered_type power ON car.power_type_id = power.powered_type_id)
                            JOIN ms_fuel_type fuel ON car.fuel_type_id = fuel.fuel_type_id)
                            JOIN ms_displacement dis ON car.displacement_id = dis.displacement_id)
                            JOIN ms_transmission trans ON car.transmission_type_id = trans.transmission_type_id)
                            JOIN ms_drivetrain drive ON car.drivetrain_id = drive.drivetrain_id)
                            JOIN ms_model_code code ON car.model_code_id = code.model_code_id)
                            WHERE car.car_info_id = $1`,
                        [data[i]]
                    );
                    tableData = table.rows;
                    for (let i = 0; i < tableData.length; i++) {
                        result.push(tableData[i]);
                    }
                }

                if (result == "") {
                    console.log("There is no car matched your search");
                    res.json({ status: "There is no car matched your search" });
                } else {
                    console.log("There's result. Sample result of car_info_id:", result[0].car_info_id);
                    for (let i = 0; i < result.length; i++) {
                        resultTable.push({
                            car_info_id: result[i].car_info_id, //
                            car_maker: result[i].manufacturer_name, //
                            car_model_name: result[i].car_model_name, //
                            model_code: result[i].model_code,
                            start_of_production: result[
                                i
                            ].start_of_production.substring(0, 4), //
                            end_of_production: result[
                                i
                            ].end_of_production.substring(0, 4), //
                            drivers_position: result[i].drivers_position, //
                            engine_code: result[i].engine_model, //
                            displacement_code: result[i].displacement_code,
                            powered_type: result[i].powered_type,
                            fuel_type: result[i].fuel_type,
                            transmission_code: result[i].transmission_code,
                            transmission_type: result[i].transmission_type,
                            speed: result[i].speed,
                            drivetrain: result[i].drivetrain,
                            oe: result[i].part_code,
                            part_end_time: result[i].part_end_time.substring(
                                2,
                                4
                            ),
                            part_start_time: result[
                                i
                            ].part_start_time.substring(2, 4),
                            aisin_premium_code: result[i].aisin_premium_code,
                            aisin_sub_premium_code:
                                result[i].aisin_sub_premium_code,
                            aisin_part_name: result[i].aisin_part_name,
                        });
                    }
                    res.json({
                        table: resultTable,
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
