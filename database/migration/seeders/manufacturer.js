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

        const manufacturerData = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            manufacturerData.push({
                manufacturer_name: chanceObj.pickone([
                    "Toyota",
                    "Honda",
                    "Ford",
                    "Mistubishi",
                    "Hyundai",
                ]),
                type: chanceObj.pickone(["Car, Part", "Truck, Part"]),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("manufacturer", manufacturerData, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("manufacturer", {});
    },
};
