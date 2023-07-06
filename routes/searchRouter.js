const express = require("express");
const dbLogger = require("./loggers.js");
const router = express.Router();
const client = require("./connectdb");

router.route("/countries").post(async (req, res) => {
  let i;
  const existingCountry = await client.query(
    "SELECT DISTINCT country_name from ms_country WHERE country_name IS NOT NULL"
  );
  var country_name = [{}];
  if (existingCountry.rowCount > 0) {
    for (let i = 0; i < existingCountry.rowCount; i++) {
      country_name[i] = existingCountry.rows[i].country_name;
    }
    res.json({ country_name: { country_name } });
  }
});

router.route("/maker").post(async (req, res) => {
  let i;
  const existingManufacturer = await client.query(
    "SELECT DISTINCT manufacturer_name from manufacturer WHERE manufacturer_name IS NOT NULL "
  );
  var manufacturer_name = [{}];
  if (existingManufacturer.rowCount > 0) {
    for (let i = 0; i < existingManufacturer.rowCount; i++) {
      manufacturer_name[i] = existingManufacturer.rows[i].manufacturer_name;
    }
    res.json({ manufacturer_name: { manufacturer_name } });
  }
});

router.route("/modelcar").post(async (req, res) => {
  let i;
  const existingModelCar = await client.query(
    "SELECT DISTINCT car_model_name from car_model WHERE car_model_name IS NOT NULL"
  );
  var car_model_name = [{}];
  if (existingModelCar.rowCount > 0) {
    for (let i = 0; i < existingModelCar.rowCount; i++) {
      car_model_name[i] = existingModelCar.rows[i].car_model_name;
    }
    res.json({ car_model_name: { car_model_name } });
  }
});

router.route("/modelcode").post(async (req, res) => {
  let i;
  const existingModelCode = await client.query(
    "SELECT DISTINCT model_code from ms_model_code WHERE model_code IS NOT NULL"
  );
  var model_code = [{}];
  if (existingModelCode.rowCount > 0) {
    for (let i = 0; i < existingModelCode.rowCount; i++) {
      model_code[i] = existingModelCode.rows[i].model_code;
    }
    res.json({ model_code: { model_code } });
  }
});

router.route("/position").post(async (req, res) => {
  let i;
  const existingPosition = await client.query(
    "SELECT DISTINCT drivers_position from car_information WHERE drivers_position IS NOT NULL"
  );
  var drivers_position = [{}];
  if (existingPosition.rowCount > 0) {
    for (let i = 0; i < existingPosition.rowCount; i++) {
      drivers_position[i] = existingPosition.rows[i].drivers_position;
    }
    res.json({ drivers_position: { drivers_position } });
  }
});

router.route("/enginecode").post(async (req, res) => {
  let i;
  const existingEngineCode = await client.query(
    "SELECT DISTINCT engine_model from car_information WHERE engine_model IS NOT NULL"
  );
  var engine_model = [{}];
  if (existingEngineCode.rowCount > 0) {
    for (let i = 0; i < existingEngineCode.rowCount; i++) {
      engine_model[i] = existingEngineCode.rows[i].engine_model;
    }
    res.json({ engine_model: { engine_model } });
  }
});

router.route("/displacement").post(async (req, res) => {
  let i;
  const existingDisplacement = await client.query(
    "SELECT DISTINCT displacement_code from ms_displacement WHERE displacement_code IS NOT NULL"
  );
  var displacement_code = [{}];
  if (existingDisplacement.rowCount > 0) {
    for (let i = 0; i < existingDisplacement.rowCount; i++) {
      displacement_code[i] = existingDisplacement.rows[i].displacement_code;
    }
    res.json({ displacement_code: { displacement_code } });
  }
});

router.route("/fuel").post(async (req, res) => {
  let i;
  const existingFuel = await client.query(
    "SELECT DISTINCT fuel_type from ms_fuel_type WHERE fuel_type IS NOT NULL"
  );
  var fuel_type = [{}];
  if (existingFuel.rowCount > 0) {
    for (let i = 0; i < existingFuel.rowCount; i++) {
      fuel_type[i] = existingFuel.rows[i].fuel_type;
    }
    res.json({ fuel_type: { fuel_type } });
  }
});

router.route("/transmission").post(async (req, res) => {
  let i;
  const existingTransmission = await client.query(
    "SELECT DISTINCT transmission_type from ms_transmission WHERE transmission_type IS NOT NULL"
  );
  var transmission_type = [{}];
  if (existingTransmission.rowCount > 0) {
    for (let i = 0; i < existingTransmission.rowCount; i++) {
      transmission_type[i] = existingTransmission.rows[i].transmission_type;
    }
    res.json({ transmission_type: { transmission_type } });
  }
});

router.route("/drivetrain").post(async (req, res) => {
  let i;
  const existingDrivetrain = await client.query(
    "SELECT DISTINCT drivetrain from ms_drivetrain WHERE drivetrain IS NOT NULL"
  );
  var drivetrain = [{}];
  if (existingDrivetrain.rowCount > 0) {
    for (let i = 0; i < existingDrivetrain.rowCount; i++) {
      drivetrain[i] = existingDrivetrain.rows[i].drivetrain;
    }
    res.json({ drivetrain: { drivetrain } });
  }
});

router.route("/partname").post(async (req, res) => {
  let i;
  const existingPartname = await client.query(
    "SELECT DISTINCT aisin_part_name from part_name_mapping WHERE aisin_part_name IS NOT NULL"
  );
  var aisin_part_name = [{}];
  if (existingPartname.rowCount > 0) {
    for (let i = 0; i < existingPartname.rowCount; i++) {
      aisin_part_name[i] = existingPartname.rows[i].aisin_part_name;
    }
    res.json({ aisin_part_name: { aisin_part_name } });
  }
});

router.route("/oe").post(async (req, res) => {
  let i;
  const existingOE = await client.query(
    "SELECT DISTINCT part_code from part WHERE part_code IS NOT NULL"
  );
  var part_code = [{}];
  if (existingOE.rowCount > 0) {
    for (let i = 0; i < existingOE.rowCount; i++) {
      part_code[i] = existingOE.rows[i].part_code;
    }
    res.json({ part_code: { part_code } });
  }
});

router.route("/aisin").post(async (req, res) => {
  let i;
  const existingAISIN = await client.query(
    "SELECT DISTINCT aisin_premium_code from aisin_premium WHERE aisin_premium_code IS NOT NULL UNION SELECT DISTINCT aisin_sub_premium_code from aisin_sub_premium WHERE aisin_sub_premium_code IS NOT NULL"
  );
  var aisin_premium_code = [{}];
  if (existingAISIN.rowCount > 0) {
    for (let i = 0; i < existingAISIN.rowCount; i++) {
      aisin_premium_code[i] = existingAISIN.rows[i].aisin_premium_code;
    }
    res.json({ aisin_premium_code: { aisin_premium_code } });
  }
});

router.route("/competitor").post(async (req, res) => {
  let i;
  const existingCompetitor = await client.query(
    "SELECT DISTINCT competiter_part_code from part_competiter_info WHERE competiter_part_code IS NOT NULL"
  );
  var competiter_part_code = [{}];
  if (existingCompetitor.rowCount > 0) {
    for (let i = 0; i < existingCompetitor.rowCount; i++) {
      competiter_part_code[i] = existingCompetitor.rows[i].competiter_part_code;
    }
    res.json({ competiter_part_code: { competiter_part_code } });
  }
});

module.exports = router;
