const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");
const multer = require("multer");

//Get Single Setting
router.get("/Get_SingleSetting/:stg_id", (req, res, next) => {
    const { stg_id } = req.params;

    models.settings
        .findAll({
            where: {
                id: stg_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Setting Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Setting Get Successfully",
                });
            } else {
                console.log("No Setting Found");
                res.json({
                    successful: false,
                    message: "No Setting Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Setting: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Setting: " + err,
            });
        });
});

//Get All Settings
router.get("/Get_AllSettings", (req, res, next) => {
    models.settings
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Settings Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Settings Successfully",
                });
            } else {
                console.log("No Settings Found");
                res.json({
                    successful: false,
                    message: "No Settings Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Settings: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Settings: " + err,
            });
        });
});

//Create Setting
router.post("/Create_Setting", async (req, res, next) => {
    const { is_active } = req.body.data;

    values = [
        {
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.settings
        .findAll({
            where: {
                url: values[0].url,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Setting already exists");
                res.json({
                    successful: false,
                    message: "Setting already exists",
                });
            } else {
                models.settings
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Setting Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Setting",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Setting: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Setting: " + err,
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

//Update Setting Detail
router.post("/Update_SettingDetail", async (req, res, next) => {
    console.log("Update Setting Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            is_active: req.body.data.is_active,
        },
    ];
    await models.settings
        .update(
            {
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
                    message: "Setting Detail Updated Successfully",
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

//Update Setting Status
router.post("/Update_SettingStatus", async (req, res, next) => {
    console.log("Update Setting Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.settings
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
                    message: "Setting Status Updated Successfully",
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

//Update Setting Pic
router.post("/Update_SettingPic", async (req, res, next) => {
    console.log("Update Setting Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            image: req.body.data.image,
        },
    ];
    await models.settings
        .update(
            {
                image: values[0].image,
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
                    message: "Setting Pic Updated Successfully",
                    data: data[1].dataValues,
                },
                accessTokenSecret
            );
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

//Setup Storage Folder
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./SettingsImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload Setting Pic
var upload = multer({ storage: storage }).single("file");
router.post("/SettingPic", function (req, res) {
    console.log("Req:", req);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.json(err);
        } else if (err) {
            return res.json(err);
        }
        return res.send(req.file);
    });
});

//Delete Single Setting
router.get("/Delete_SingleSetting/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.settings
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Setting Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Setting Deleted Successfully.",
          });
        } else {
          console.log("No Setting Found");
          res.json({
            successful: false,
            message: "No Setting Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Setting: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Setting: " + err,
        });
      });
  });


module.exports = router;