const express = require("express");
const dbLogger = require("./loggers.js");
const router = express.Router();
const client = require("./connectdb");

router.route("/countries").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT country_name FROM ms_country WHERE country_name IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.country_name);

        res.json({ country_name: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/maker").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT manufacturer_name from manufacturer WHERE manufacturer_name IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.manufacturer_name);
        res.json({ manufacturer_name: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/modelcar").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT car_model_name from car_model WHERE car_model_name IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.car_model_name);
        res.json({ car_model_name: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/modelcode").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT model_code from ms_model_code WHERE model_code IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.model_code);
        res.json({ model_code: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/position").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT drivers_position from car_information WHERE drivers_position IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.drivers_position);
        res.json({ drivers_position: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/enginecode").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT engine_model from car_information WHERE engine_model IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.engine_model);
        res.json({ engine_model: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/displacement").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT displacement_code from ms_displacement WHERE displacement_code IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.displacement_code);
        res.json({ displacement_code: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/fuel").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT fuel_type from ms_fuel_type WHERE fuel_type IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.fuel_type);
        res.json({ fuel_type: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/transmission").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT transmission_type from ms_transmission WHERE transmission_type IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.transmission_type);
        res.json({ transmission_type: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/drivetrain").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT drivetrain from ms_drivetrain WHERE drivetrain IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.drivetrain);
        res.json({ drivetrain: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/partname").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT aisin_part_name from part_name_mapping WHERE aisin_part_name IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.aisin_part_name);
        res.json({ aisin_part_name: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/oe").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT part_code from part WHERE part_code IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.part_code);
        res.json({ part_code: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/aisin").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT aisin_premium_code from aisin_premium WHERE aisin_premium_code IS NOT NULL UNION SELECT DISTINCT aisin_sub_premium_code from aisin_sub_premium WHERE aisin_sub_premium_code IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.aisin_premium_code);
        res.json({ aisin_premium_code: value });
    } catch (error) {
        console.error(error);
    }
});

router.route("/competitor").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT competiter_part_code from part_competiter_info WHERE competiter_part_code IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.competiter_part_code);
        res.json({ competiter_part_code: value });
    } catch (error) {
        console.error(error);
    }
});
//AAT-15
router.route("/partgroup").post(async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT part_group_name from part_group WHERE part_group_name IS NOT NULL";
        const result = await client.query(query);

        const value = result.rows.map((row) => row.part_group_name);
        res.json({ part_group_name: value });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
