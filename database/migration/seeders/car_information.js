const Chance = require("chance");
const chanceObj = new Chance();
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            "SELECT user_id FROM ms_user"
        );
        const userIds = users[0].map((user) => user.user_id);

        const allData = await queryInterface.sequelize.query(
            "select m.manufacturer_id, manufacturer_name, b.car_brand_id, car_brand_name, s.car_series_id, car_series_name, o.car_model_id, car_model_name from manufacturer m inner join (car_brand b inner join (car_series s inner join car_model o on s.car_series_id = o.car_series_id) on b.car_brand_id = s.car_brand_id) on m.manufacturer_id = b.manufacturer_id",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const manufacturerIds = allData.map(
            (manufacturer) => manufacturer.manufacturer_id
        );

        const displacements = await queryInterface.sequelize.query(
            "SELECT displacement_id FROM ms_displacement"
        );
        const disPlacementIds = displacements[0].map(
            (displacement) => displacement.displacement_id
        );

        const powers = await queryInterface.sequelize.query(
            "SELECT powered_type_id FROM ms_powered_type"
        );
        const powerIds = powers[0].map((power) => power.powered_type_id);

        const fuels = await queryInterface.sequelize.query(
            "SELECT fuel_type_id FROM ms_fuel_type"
        );
        const fuelIds = fuels[0].map((fuel) => fuel.fuel_type_id);
        const trans = await queryInterface.sequelize.query(
            "SELECT transmission_type_id FROM ms_transmission"
        );
        const transmissionIds = trans[0].map(
            (tran) => tran.transmission_type_id
        );
        const drivetrains = await queryInterface.sequelize.query(
            "SELECT drivetrain_id FROM ms_drivetrain"
        );
        const drivertrainIds = drivetrains[0].map(
            (drivetrain) => drivetrain.drivetrain_id
        );
        const modelCodes = await queryInterface.sequelize.query(
            "SELECT model_code_id, model_code FROM ms_model_code",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const modelCodeIds = modelCodes.map(
            (modelCode) => modelCode.model_code_id
        );

        //start_time, end_time
        const { startTime, endTime } = (() => {
            const startYear = chanceObj.integer({ min: 2000, max: 2023 });
            const startMonth = chanceObj.integer({ min: 1, max: 12 });
            const endYear = chanceObj.integer({ min: startYear, max: 2023 });
            const endMonth = chanceObj.integer({
                min: startMonth,
                max: 12,
            });
            const formatTime = (year, month) =>
                `${String(year)}${String(month).padStart(2, "0")}`;
            return {
                startTime: formatTime(startYear, startMonth),
                endTime: formatTime(endYear, endMonth),
            };
        })();

        const countries = await queryInterface.sequelize.query(
            "SELECT country_name FROM ms_country"
        );
        const country = countries[0].map((country) => country.country_name);

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            //vehicle_code
            const randomManufacturerId = chanceObj.pickone(manufacturerIds);
            const randomManufacturer = allData.find(
                (manufacturer) =>
                    manufacturer.manufacturer_id === randomManufacturerId
            );
            const randomManufacturerName = randomManufacturer.manufacturer_name;
            const randomCarBrandCode = randomManufacturerName
                .substr(0, 3)
                .toUpperCase();
            const runningNumber = String(i + 1).padStart(5, "0");
            //carmodel
            const randomCarModel = randomManufacturer.car_model_id;
            // model_code
            const randomModelCodeId = chanceObj.pickone(modelCodeIds);
            const randomModelCode = modelCodes.find(
                (modelCode) => modelCode.model_code_id === randomModelCodeId
            );
            const randomModelCodeName = randomModelCode.model_code;

            data.push({
                aisin_vehicle_code: `${randomCarBrandCode}${runningNumber}`,
                car_model_id: randomCarModel,
                displacement_id: chanceObj.pickone(disPlacementIds),
                power_type_id: chanceObj.pickone(powerIds),
                fuel_type_id: chanceObj.pickone(fuelIds),
                transmission_type_id: chanceObj.pickone(transmissionIds),
                drivetrain_id: chanceObj.pickone(drivertrainIds),
                model_code_id: chanceObj.pickone(modelCodeIds),
                argos_vehicle_code: `${randomCarBrandCode}_${chanceObj.integer({
                    min: 1000,
                    max: 9999,
                })}`,
                chassis_code: `${randomModelCodeName}R-${chanceObj.string({
                    length: 5,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                })}`,
                engine_model: `${chanceObj.integer({
                    min: 1,
                    max: 9,
                })}${chanceObj.string({
                    length: 5,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                })}`,
                vehicle_type: chanceObj.pickone(["Pickup"]),
                drivers_position: chanceObj.pickone(["RHD"]),
                start_of_production: startTime,
                end_of_production: endTime,
                sales_country: chanceObj.pickone(country),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("car_information", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("car_information", {});
    },
};
