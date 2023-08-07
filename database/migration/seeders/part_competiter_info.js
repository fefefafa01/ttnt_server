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

        const parts = await queryInterface.sequelize.query(
            "SELECT part_id FROM part"
        );
        const partIds = parts[0].map((part) => part.part_id);

        const data = [];
        const numPart = 6;
        const uniqueManu = chanceObj.unique(
            chanceObj.pickone,
            numPart,
            manufacturerIds
        );
        const uniquePart = chanceObj.unique(
            chanceObj.pickone,
            numPart,
            partIds
        );
        for (let i = 0; i < numPart; i++) {
            data.push({
                manufacturer_id: uniqueManu[i],
                part_id: uniquePart[i],
                competiter_part_code: `${chanceObj.string({
                    length: 3,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                })}-${chanceObj.string({
                    length: 4,
                    pool: "0123456789",
                })}`,
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("part_competiter_info", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_competiter_info", {});
    },
};
