const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

//Get all countries
router.get("/countries", (req, res, next) => {
  console.log("Countries API calling");

  models.countries
    .findAll({})

    .then((c_data) => {
      console.log("Countries Get Successfully", JSON.stringify(c_data));
      res
        .status(200)

        .json({
          data: c_data,
          successful: true,
          message: "Countries Get Successfully",
        });
    })

    .catch(function (err) {
      console.log("Failed to Get Countries: ", err);
      res.status(404).json({
        Successful: false,
        Message: "Countries not Found: " + err,
      });
    });
});

//Get all states for country
router.get("/states/:country_id", (req, res, next) => {
  console.log("States API calling: ", req.params.country_id);

  const { country_id } = req.params;

  values = [
    {
      country_id: country_id,
    },
  ];

  models.states
    .findAll({
      where: {
        country_id: values[0].country_id,
      },
    })
    .then((c_data) => {
      if (c_data?.length != 0 || c_data != null) {
        console.log("tet", c_data);
        res.status(200).json({
          states: c_data,
          successful: true,
          message: "States Data Get Successfully",
        });
      } else {
        console.log("Failed to Get State Data");
        res.status(201)

          .json({
            successful: false,
            message: "States Data Not Found",
          });
      }
    })

    .catch(function (err) {
      console.log("Failed to Get States: ", err);
      res.status(404)

        .json({
          successful: false,
          message: "States Data not Found: " + err,
        });
    });
});

//Get all cities for state
router.get("/cities/:state_id", (req, res, next) => {
  console.log("Cities API calling: ", req.params.state_id);

  const { state_id } = req.params;

  values = [
    {
      state_id: state_id,
    },
  ];

  console.log(values[0].state_id);

  models.cities
    .findAll({
      where: {
        state_id: values[0].state_id,
      },
    })
    .then((c_data) => {
      if (c_data?.length !== 0 || c_data != null) {

        res.status(200).json({
          cities_data: c_data,
          successful: true,
          message: "Cities Data Get Successfully",
        });
      } else {
        res
          .status(404)

          .json({
            Successful: false,
            Message: "Failed to Get States for Cities",
          });
      }
    })

    .catch(function (err) {
      console.log("Failed to Get Cities: ", err);
      res.status(404)

        .json({
          Successful: false,
          Message: "Cities Data not Found: " + err,
        });
    });
});

//Get Country Name
router.get("/Get_Country/:id", (req, res, next) => {
    console.log("Get Country Name API calling: ", req.params.id);
  const { id } = req.params;

  models.countries
    .findAll({
      where: {
        id: id,
      },
    })
    .then((data) => {
      if (data?.length != 0 || data != null) {
        console.log("Country Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "Country Name Get Successfully",
        });
      } else {
        console.log("No Country Found");
        res.json({
          successful: false,
          message: "No Country Found",
        });
      }
    })
    .catch(function (err) {
      console.log("Failed To Get Country Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get Country Name: " + err,
      });
    });
});

//Get State Name
router.get("/Get_State/:id", (req, res, next) => {
    console.log("Get State Name API calling: ", req.params.id);
  const { id } = req.params;

  models.states
    .findAll({
      where: {
        id: id,
      },
    })

    .then((data) => {
      if (data?.length != 0 || data != null) {
        console.log("State Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "State Name Get Successfully",
        });
      } else {
        console.log("No State Found");
        res.json({
          successful: false,
          message: "No State Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get State Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get State Name: " + err,
      });
    });
});

//Get City Name
router.get("/Get_City/:id", (req, res, next) => {
    console.log("Get City Name API calling: ", req.params.id);
  const { id } = req.params;

  models.cities
    .findAll({
      where: {
        id: id,
      },
    })

    .then((data) => {
      if (data?.length != 0 || data != null) {
        console.log("City Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "City Name Get Successfully",
        });
      } else {
        console.log("No City Found");
        res.json({
          successful: false,
          message: "No City Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get City Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get City Name: " + err,
      });
    });
});

module.exports = router;
