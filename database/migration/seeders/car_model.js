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

        const car_series = await queryInterface.sequelize.query(
            "SELECT car_series_id, car_series_name FROM car_series",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const carSeriesIds = car_series.map(
            (car_seri) => car_seri.car_series_id
        );

        const countries = await queryInterface.sequelize.query(
            "SELECT country_id FROM ms_country"
        );
        const countryIds = countries[0].map((country) => country.country_id);

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const randomSeriesId = chanceObj.pickone(carSeriesIds);
            const randomCarSeries = car_series.find(
                (car_seri) => car_seri.car_series_id === randomSeriesId
            );
            let randomSeriesName = null;
            if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Corolla"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Corolla",
                    "Corolla Cross",
                    "Corolla Cross Hybrid",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Grand Highlander"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Grand Highlander",
                    "Grand Highlander Hybrid",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "RAV4"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "RAV4",
                    "RAV4 Hybrid",
                    "RAV4 Prime",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Accord"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Accord",
                    "Accord Hybrid",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Civic"
            ) {
                randomSeriesName = chanceObj.pickone(["Civic", "Civic Type R"]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "CR-V"
            ) {
                randomSeriesName = chanceObj.pickone(["CR-V", "CR-V Hybrid"]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Bronco"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Bronco",
                    "Bronco Sport",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Mustang"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Mustang",
                    "Mustang MACH-E",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "F350"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "F350 Super Duty Crew Cab",
                    "F350 Super Duty Regular Cab",
                    "F350 Super Duty Super Cab",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Savana"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Savana 2500 Cargo",
                    "Savana 2500 Passenger",
                    "Savana 3500 Cargo",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Sierra"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Sierra 1500 Crew Cab",
                    "Sierra 1500 Double Cab",
                    "Sierra 1500 Limited Crew Cab",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Canyon"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Canyon Crew Cab",
                    "Canyon Extended Cab",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Elantra"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Elantra",
                    "Elantra Hybrid",
                    "Elantra N",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "IONIQ"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "IONIQ 5",
                    "IONIQ 6",
                    "IONIQ 7",
                ]);
            } else if (
                randomCarSeries &&
                randomCarSeries.car_series_name === "Kona"
            ) {
                randomSeriesName = chanceObj.pickone([
                    "Kona",
                    "Kona Electric",
                    "Kona N",
                ]);
            }

            data.push({
                car_series_id: randomSeriesId,
                country_id: chanceObj.pickone(countryIds),
                car_model_name: randomSeriesName,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("car_model", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("car_model", {});
    },
};
