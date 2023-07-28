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
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            data.push({
                transmission_code: `${chanceObj.string({
                    length: 2,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                })}-${chanceObj.string({
                    length: 4,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                })}`,
                transmission_type: chanceObj.pickone(["MT", "AT", "CVT"]),
                transmission_detail: chanceObj.pickone(["Belt", "Chain"]),
                speed: chanceObj.pickone([4, 5, 6]),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }
        await queryInterface.bulkInsert("ms_transmission", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("ms_transmission", {});
    },
};
