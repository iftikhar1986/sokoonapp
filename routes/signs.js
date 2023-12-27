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


//Get Single Sign
router.get("/Get_SingleSign/:sgn_id", (req, res, next) => {
    const { sgn_id } = req.params;

    models.signs
        .findAll({
            where: {
                id: sgn_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Sign Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Sign Get Successfully",
                });
            } else {
                console.log("No Sign Found");
                res.json({
                    successful: false,
                    message: "No Sign Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Sign: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Sign: " + err,
            });
        });
});

//Get All Signs
router.get("/Get_AllSigns", (req, res, next) => {
    models.signs
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Signs Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Signs Successfully",
                });
            } else {
                console.log("No Signs Found");
                res.json({
                    successful: false,
                    message: "No Signs Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Signs: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Signs: " + err,
            });
        });
});

//Create Sign
router.post("/Create_Sign", async (req, res, next) => {
    const {video, url, category, title, is_active } = req.body.data;

    values = [
        {
            url: req.body.data.url,
            video: req.body.video,
            category: req.body.category,
            title: req.body.title,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.signs
        .findAll({
            where: {
                title: values[0].title,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Sign already exists");
                res.json({
                    successful: false,
                    message: "Sign already exists",
                });
            } else {
                models.signs
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Sign Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Sign",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Sign: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Sign: " + err,
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

//Update Sign Detail
router.post("/Update_SignDetail", async (req, res, next) => {
    console.log("Update Sign Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            url: req.body.data.url,
            video: req.body.video,
            category: req.body.category,
            title: req.body.title,
            is_active: req.body.is_active,
        },
    ];
    await models.signs
        .update(
            {
                url: values[0].url,
                video: values[0].video,
                category: values[0].category,
                title: values[0].title,
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
                    message: "Sign Detail Updated Successfully",
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

//Update Sign Status
router.post("/Update_SignStatus", async (req, res, next) => {
    console.log("Update Sign Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.signs
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
                    message: "Sign Status Updated Successfully",
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

//Delete Single Sign
router.get("/Delete_SingleSign/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.signs
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Sign Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Sign Deleted Successfully.",
          });
        } else {
          console.log("No Sign Found");
          res.json({
            successful: false,
            message: "No Sign Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Sign: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Sign: " + err,
        });
      });
  });

//Update Sign Video
router.post("/Update_SignVid", async (req, res, next) => {
    console.log("Update Sign Vid API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            video: req.body.data.video,
        },
    ];
    await models.ads
        .update(
            {
                video: values[0].video,
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
                    message: "Sign Video Updated Successfully",
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
        cb(null, "./SignsVideos");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload Sign Video
var upload = multer({ storage: storage }).single("file");
router.post("/SignVideo", function (req, res) {
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

module.exports = router;
