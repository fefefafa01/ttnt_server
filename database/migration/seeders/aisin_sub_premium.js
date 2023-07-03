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

        const data = [];
        const numPart = 50;
        for (let i = 0; i < numPart; i++) {
            data.push({
                aisin_sub_premium_code: `${chanceObj.string({
                    length: 3,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                })}-${chanceObj.string({
                    length: 4,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                })}`,
                od_inch: chanceObj.integer({ min: 20, max: 500 }),
                od_mm: chanceObj.integer({ min: 20, max: 500 }),
                id_mm: chanceObj.integer({ min: 20, max: 500 }),
                major_dia_mm: chanceObj.integer({ min: 20, max: 500 }),
                spline: chanceObj.integer({ min: 20, max: 500 }),
                pcd_mm: chanceObj.integer({ min: 20, max: 500 }),
                width_od_mm: chanceObj.integer({ min: 20, max: 500 }),
                width_id_mm: chanceObj.integer({ min: 20, max: 500 }),
                length_inch: chanceObj.integer({ min: 20, max: 500 }),
                length_mm: chanceObj.integer({ min: 20, max: 500 }),
                height_mm: chanceObj.integer({ min: 20, max: 500 }),
                bore_size: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                thread: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                lhd_rhd: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                l_r: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                fr_rr: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                abs: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                type: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                remark: chanceObj.string({
                    length: 10,
                    pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                }),
                is_active: chanceObj.bool(),
                created_date: new Date(),
                created_by: chanceObj.pickone(userIds),
                updated_date: new Date(),
                updated_by: chanceObj.pickone(userIds),
            });
        }

        await queryInterface.bulkInsert("aisin_sub_premium", data, {});
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("aisin_sub_premium", {});
    },
};
