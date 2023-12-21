const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single CatArAZ
router.get("/Get_SingleCatArAZ/:cat_id", (req, res, next) => {
    const { cat_id } = req.params;

    models.catArAZs
        .findAll({
            where: {
                id: cat_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("CatArAZ Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "CatArAZ Get Successfully",
                });
            } else {
                console.log("No CatArAZ Found");
                res.json({
                    successful: false,
                    message: "No CatArAZ Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get CatArAZ: ", err);
            res.json({
                successful: false,
                message: "Failed To Get CatArAZ: " + err,
            });
        });
});

//Get All CatArAZs
router.get("/Get_AllCatArAZs", (req, res, next) => {
    models.catArAZs
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All CatArAZs Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All CatArAZs Successfully",
                });
            } else {
                console.log("No CatArAZs Found");
                res.json({
                    successful: false,
                    message: "No CatArAZs Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All CatArAZs: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All CatArAZs: " + err,
            });
        });
});

//Create CatArAZ
router.post("/Create_CatArAZ", async (req, res, next) => {
    const {cat, is_active } = req.body.data;

    values = [
        {
            cat:req.body.cat,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.catArAZs
        .findAll({
            where: {
                cat: values[0].cat,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("CatArAZ already exists");
                res.json({
                    successful: false,
                    message: "CatArAZ already exists",
                });
            } else {
                models.catArAZs
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "CatArAZ Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New CatArAZ",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New CatArAZ: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New CatArAZ: " + err,
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

//Update CatArAZ Detail
router.post("/Update_CatArAZDetail", async (req, res, next) => {
    console.log("Update CatArAZ Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            cat:req.body.data.cat,
            is_active: req.body.data.is_active,
        },
    ];
    await models.catArAZs
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
                    message: "CatArAZ Detail Updated Successfully",
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

//Update CatArAZ Status
router.post("/Update_CatArAZStatus", async (req, res, next) => {
    console.log("Update CatArAZ Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.catArAZs
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
                    message: "CatArAZ Status Updated Successfully",
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

//Delete Single CatArAZ
router.get("/Delete_SingleCatArAZ/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.catArAZs
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("CatArAZ Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "CatArAZ Deleted Successfully.",
          });
        } else {
          console.log("No CatArAZ Found");
          res.json({
            successful: false,
            message: "No CatArAZ Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete CatArAZ: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete CatArAZ: " + err,
        });
      });
  });

module.exports = router;