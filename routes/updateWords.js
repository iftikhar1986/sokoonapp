const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single Update Word
router.get("/Get_SingleUpdateWord/:uw_id", (req, res, next) => {
    const { uw_id } = req.params;

    models.updateWords
        .findAll({
            where: {
                id: uw_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Update Word Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Update Word Get Successfully",
                });
            } else {
                console.log("No Update Word Found");
                res.json({
                    successful: false,
                    message: "No Update Word Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get updateWord: ", err);
            res.json({
                successful: false,
                message: "Failed To Get updateWord: " + err,
            });
        });
});

//Get All Update Words
router.get("/Get_AllUpdateWords", (req, res, next) => {
    models.updateWords
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All updateWords Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All updateWords Successfully",
                });
            } else {
                console.log("No updateWords Found");
                res.json({
                    successful: false,
                    message: "No updateWords Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All updateWords: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All updateWords: " + err,
            });
        });
});

//Create Update Word
router.post("/Create_UpdateWord", async (req, res, next) => {
    const { lastid, value, is_active } = req.body.data;

    values = [
        {
            lastid: req.body.lastid,
            value: req.body.value,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.updateWords
        .findAll({
            where: {
                value: values[0].value,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("updateWord already exists");
                res.json({
                    successful: false,
                    message: "updateWord already exists",
                });
            } else {
                models.updateWords
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "updateWord Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New updateWord",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New updateWord: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New updateWord: " + err,
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

//Update Update Word Detail
router.post("/Update_UpdateWordDetail", async (req, res, next) => {
    console.log("Update updateWord Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            lastid: req.body.data.lastid,
            value: req.body.data.value,
            is_active: req.body.data.is_active,
        },
    ];
    await models.updateWords
        .update(
            {
                lastid: values[0].lastid,
                value: values[0].value,
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
                    message: "updateWord Detail Updated Successfully",
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

//Update Update Word Status
router.post("/Update_UpdateWordstatus", async (req, res, next) => {
    console.log("Update updateWord Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.updateWords
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
                    message: "updateWord Status Updated Successfully",
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

//Delete Single updateWord
router.get("/Delete_SingleUpdateWord/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.updateWords
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("updateWord Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "updateWord Deleted Successfully.",
          });
        } else {
          console.log("No updateWord Found");
          res.json({
            successful: false,
            message: "No updateWord Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete updateWord: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete updateWord: " + err,
        });
      });
  });


module.exports = router;