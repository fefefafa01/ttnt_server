const Chance = require("chance");
const car_brand = require("./car_brand");
const chanceObj = new Chance();
("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            "SELECT user_id FROM ms_user"
        );
        const userIds = users[0].map((user) => user.user_id);

        const car_brands = await queryInterface.sequelize.query(
            "SELECT car_brand_id, car_brand_name FROM car_brand",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const carBrandIds = car_brands.map(
            (car_brand) => car_brand.car_brand_id
        );

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const randomCarBrandId = chanceObj.pickone(carBrandIds);
            const randomCarBrand = car_brands.find(
                (car_brand) => car_brand.car_brand_id === randomCarBrandId
            );
            let randomCarBrandName = null;
            if (randomCarBrand && randomCarBrand.car_brand_name === "Toyota") {
                randomCarBrandName = chanceObj.pickone([
                    "Corolla",
                    "Grand Highlander",
                    "RAV4",
                ]);
            } else if (
                randomCarBrand &&
                randomCarBrand.car_brand_name === "Honda"
            ) {
                randomCarBrandName = chanceObj.pickone([
                    "Accord",
                    "Civic",
                    "CR-V",
                ]);
            } else if (
                randomCarBrand &&
                randomCarBrand.car_brand_name === "Ford"
            ) {
                randomCarBrandName = chanceObj.pickone([
                    "Bronco",
                    "Mustang",
                    "F350",
                ]);
            } else if (
                randomCarBrand &&
                randomCarBrand.car_brand_name === "Mistubishi"
            ) {
                randomCarBrandName = chanceObj.pickone([
                    "Savana",
                    "Sierra",
                    "Canyon",
                ]);
            } else if (
                randomCarBrand &&
                randomCarBrand.car_brand_name === "Hyundai"
            ) {
                randomCarBrandName = chanceObj.pickone([
                    "Elantra",
                    "IONIQ",
                    "Kona",
                ]);
            }
            data.push({
                car_brand_id: randomCarBrandId,
                car_series_name: randomCarBrandName,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("car_series", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("car_series", {});
    },
};
