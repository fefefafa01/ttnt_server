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

        const data = [];
        data.push({
            powered_type: "ICE",
            is_active: chanceObj.bool(),
            created_date: new Date(),
            created_by: chanceObj.pickone(userIds),
            updated_date: new Date(),
            updated_by: chanceObj.pickone(userIds),
        });

        await queryInterface.bulkInsert("ms_powered_type", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("ms_powered_type", {});
    },
};
