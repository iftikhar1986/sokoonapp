const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single CatAZ
router.get("/Get_SingleCatAZ/:cat_id", (req, res, next) => {
    const { cat_id } = req.params;

    models.catAZs
        .findAll({
            where: {
                id: cat_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("CatAZ Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "CatAZ Get Successfully",
                });
            } else {
                console.log("No CatAZ Found");
                res.json({
                    successful: false,
                    message: "No CatAZ Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get CatAZ: ", err);
            res.json({
                successful: false,
                message: "Failed To Get CatAZ: " + err,
            });
        });
});

//Get All CatAZs
router.get("/Get_AllCatAZs", (req, res, next) => {
    models.catAZs
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All CatAZs Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All CatAZs Successfully",
                });
            } else {
                console.log("No CatAZs Found");
                res.json({
                    successful: false,
                    message: "No CatAZs Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All CatAZs: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All CatAZs: " + err,
            });
        });
});

//Create CatAZ
router.post("/Create_CatAZ", async (req, res, next) => {
    const {cat, is_active } = req.body.data;

    values = [
        {
            cat:req.body.cat,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.catAZs
        .findAll({
            where: {
                cat: values[0].cat,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("CatAZ already exists");
                res.json({
                    successful: false,
                    message: "CatAZ already exists",
                });
            } else {
                models.catAZs
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "CatAZ Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New CatAZ",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New CatAZ: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New CatAZ: " + err,
                        });
                    });
            }
        })
        .catch(function (err) {
            console.log("Request Data is Empty: ", err);
            res.json({
                successful: false,
                message: "Request Data is Empty: " + err,
            });
        });
});

//Update CatAZ Detail
router.post("/Update_CatAZDetail", async (req, res, next) => {
    console.log("Update CatAZ Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            cat:req.body.data.cat,
            is_active: req.body.data.is_active,
        },
    ];
    await models.catAZs
        .update(
            {
                cat: values[0].cat,
                is_active: values[0].is_active,
                updated_at: new Date().toISOString(),
            },
            {
                where: {
                    id: values[0].id,
                },
                returning: true,
                plain: true,
                exclude: ["created_at", "updated_at"],
            }
        )
        .then((data) => {
            const accessToken = jwt.sign(
                {
                    successful: true,
                    message: "CatAZ Detail Updated Successfully",
                    data: data[1].dataValues,
                },
                accessTokenSecret
            );
            console.log("Response Data: ", data[1].dataValues);
            res.json({
                successful: true,
                message: "Successful",
                data: data[1].dataValues,
                accessToken,
            });
        })
        .catch(function (err) {
            console.log(err);
            res.json({
                message: "Failed" + err,
                successful: false,
            });
        });
});

//Update CatAZ Status
router.post("/Update_CatAZStatus", async (req, res, next) => {
    console.log("Update CatAZ Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.catAZs
        .update(
            {
                is_active: values[0].status,
                updated_at: new Date().toISOString(),
            },
            {
                where: {
                    id: values[0].id,
                },
                returning: true,
                exclude: ["created_at", "updated_at"],
            }
        )
        .then((data) => {
            const val = {
                id: values[0].id,
                is_active: values[0].status,
            };
            const accessToken = jwt.sign(
                {
                    successful: true,
                    message: "CatAZ Status Updated Successfully",
                    data: val,
                },
                accessTokenSecret
            );
            console.log("val", val);
            res.json({
                successful: true,
                message: "Successful",
                data: val,
                accessToken,
            });
        })
        .catch(function (err) {
            console.log(err);
            res.json({
                message: "Failed" + err,
                successful: false,
            });
        });
});

//Delete Single CatAZ
router.get("/Delete_SingleCatAZ/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.catAZs
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("CatAZ Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "CatAZ Deleted Successfully.",
          });
        } else {
          console.log("No CatAZ Found");
          res.json({
            successful: false,
            message: "No CatAZ Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete CatAZ: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete CatAZ: " + err,
        });
      });
  });

module.exports = router;