const Chance = require("chance");
const chanceObj = new Chance();

("use strict");

// https://chancejs.com/index.html
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            "SELECT user_id FROM ms_user"
        );
        const userIds = users[0].map((user) => user.user_id);

        const partGroupData = [];
        const partGroup = [
            "Powertrain/Chassis",
            "Engine/Fuel",
            "Electrical",
            "Engine/Exhaust",
        ];
        const numPart = 4;
        userIds.forEach((userId) => {
            for (let i = 0; i < numPart; i++) {
                partGroupData.push({
                    part_group_name: partGroup[i],
                    is_active: chanceObj.bool(),
                    created_date: new Date(),
                    created_by: userId,
                    updated_date: new Date(),
                    updated_by: userId,
                });
            }
        });

        await queryInterface.bulkInsert("part_group", partGroupData, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_group", {});
    },
};
