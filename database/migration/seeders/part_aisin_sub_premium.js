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

        const parts = await queryInterface.sequelize.query(
            "SELECT part_id FROM part"
        );
        const partIds = parts[0].map((part) => part.part_id);

        const aisinPrems = await queryInterface.sequelize.query(
            "SELECT aisin_sub_premium_id FROM aisin_sub_premium"
        );
        const aisinSubPremIds = aisinPrems[0].map(
            (aisinPrem) => aisinPrem.aisin_sub_premium_id
        );

        const data = [];
        const numPart = 50;
        const uniqueAisinSubPrem = chanceObj.unique(
            chanceObj.pickone,
            numPart,
            aisinSubPremIds
        );
        for (let i = 0; i < numPart; i++) {
            data.push({
                part_id: chanceObj.pickone(partIds),
                aisin_sub_premium_id: uniqueAisinSubPrem[i],
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part_aisin_sub_premium", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_aisin_sub_premium", {});
    },
};
