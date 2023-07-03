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

        const partGroups = await queryInterface.sequelize.query(
            "SELECT part_group_id FROM part_group"
        );
        const partGroupIds = partGroups[0].map(
            (partGroup) => partGroup.part_group_id
        );

        const subPartGroupData = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            subPartGroupData.push({
                part_group_id: chanceObj.pickone(partGroupIds),
                part_sub_group_name: chanceObj.pickone([
                    "STANDARD TOOL",
                    "CLUTCH",
                    "HYDRAULICS",
                    "TRANSMISSION",
                ]),
                part_sub_group_code: `${chanceObj.pad(
                    chanceObj.integer({ min: 0, max: 9999 }),
                    4
                )}_${chanceObj.pad(
                    chanceObj.integer({ min: 0, max: 9999 }),
                    4
                )}`,
                part_sub_group_image: null,
                part_sub_group_remark: chanceObj.pickone([
                    null,
                    "Test",
                    "Checked",
                ]),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part_sub_group", subPartGroupData, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_sub_group", {});
    },
};
