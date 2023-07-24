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

        const partSubGroups = await queryInterface.sequelize.query(
            "SELECT part_sub_group_id FROM part_sub_group"
        );
        const partSubGroupIds = partSubGroups[0].map(
            (partSubGroup) => partSubGroup.part_sub_group_id
        );

        const partMappings = await queryInterface.sequelize.query(
            "SELECT part_name_mappping_id, part_code FROM part_name_mapping",
            { type: Sequelize.QueryTypes.SELECT }
        );
        const partMappingIds = partMappings.map(
            (partMapping) => partMapping.part_name_mappping_id
        );

        const pncs = await queryInterface.sequelize.query(
            "SELECT pnc_id FROM pnc"
        );
        const pncIds = pncs[0].map((pnc) => pnc.pnc_id);

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            const { startTime, endTime } = (() => {
                const startYear = chanceObj.integer({ min: 2000, max: 2010 });
                const startMonth = chanceObj.integer({ min: 1, max: 12 });
                const endYear = chanceObj.integer({
                    min: startYear,
                    max: 2023,
                });
                const endMonth = chanceObj.integer({ min: 1, max: 12 });
                const formatTime = (year, month) =>
                    `${String(year)}${String(month).padStart(2, "0")}`;
                return {
                    startTime: formatTime(startYear, startMonth),
                    endTime: formatTime(endYear, endMonth),
                };
            })();
            const partNameMappingId = chanceObj.pickone(partMappingIds);
            const partNameMapping = partMappings.find(
                (partMapping) =>
                    partMapping.part_name_mappping_id === partNameMappingId
            );
            const randomPartCode = partNameMapping.part_code;
            data.push({
                part_sub_group_id: chanceObj.pickone(partSubGroupIds),
                part_name_mappping_id: partNameMappingId,
                pnc_id: chanceObj.pickone(pncIds),
                part_code: randomPartCode,
                part_remark: chanceObj.pickone([
                    null,
                    "Test",
                    "Checked",
                    "*130",
                ]),
                part_substitution_code: chanceObj.integer({
                    min: 1000000000,
                    max: 9999999999,
                }),
                part_start_time: startTime,
                part_end_time: endTime,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part", {});
    },
};
