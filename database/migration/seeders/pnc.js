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
        const numPart = 50;
        userIds.forEach((userId) => {
            for (let i = 0; i < numPart; i++) {
                partGroupData.push({
                    pnc: chanceObj.integer({ min: 10000, max: 99999 }),
                    part_name: chanceObj.pickone([
                        "PUMP ASSY",
                        "Clutch Disc",
                        "Clutch Cover",
                        "Clutch Master Cylinder",
                        "Cutch Realease Cylinder",
                        "Oil Pump",
                        "Water Pump",
                        "Fan Clutch",
                        "Fan Blade",
                        "Oil Filter",
                        "Air Filter",
                        "Fuel Filter",
                        "Cabin Air Filter",
                        "Water Pump (Inverter)",
                    ]),
                    pnc_image_path: null,
                    pnc_image: null,
                    is_active: chanceObj.bool(),
                    created_date: new Date(),
                    created_by: userId,
                    updated_date: new Date(),
                    updated_by: userId,
                });
            }
        });

        await queryInterface.bulkInsert("pnc", partGroupData, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("part_group", {});
    },
};
