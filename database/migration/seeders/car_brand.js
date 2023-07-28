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

        const manufacturers = await queryInterface.sequelize.query(
            "SELECT manufacturer_id, manufacturer_name FROM manufacturer",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const manufacturerIds = manufacturers.map(
            (manufacturer) => manufacturer.manufacturer_id
        );

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const randomManuId = chanceObj.pickone(manufacturerIds);
            const randomManu = manufacturers.find(
                (manufacturer) => manufacturer.manufacturer_id === randomManuId
            );
            const manufacturer_name = randomManu.manufacturer_name;
            data.push({
                manufacturer_id: randomManuId,
                car_brand_name: manufacturer_name,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("car_brand", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("car_brand", {});
    },
};
