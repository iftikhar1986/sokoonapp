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

//Get Single Ad
router.get("/Get_SingleAd/:ad_id", (req, res, next) => {
    const { ad_id } = req.params;

    models.ads
        .findAll({
            where: {
                id: ad_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Ad Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Ad Get Successfully",
                });
            } else {
                console.log("No Ad Found");
                res.json({
                    successful: false,
                    message: "No Ad Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Ad: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Ad: " + err,
            });
        });
});

//Get All Ads
router.get("/Get_AllAds", (req, res, next) => {
    models.ads
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Ads Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Ads Successfully",
                });
            } else {
                console.log("No Ads Found");
                res.json({
                    successful: false,
                    message: "No Ads Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Ads: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Ads: " + err,
            });
        });
});

//Create Ad
router.post("/Create_Ad", async (req, res, next) => {
    const { url, image, time, is_active } = req.body.data;

    values = [
        {
            url: req.body.data.url,
            image:req.body.data.image,
            time: req.body.data.time,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.ads
        .findAll({
            where: {
                url: values[0].url,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Ad already exists");
                res.json({
                    successful: false,
                    message: "Ad already exists",
                });
            } else {
                models.ads
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Ad Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Ads",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Ad: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Ad: " + err,
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

//Update Ad Detail
router.post("/Update_AdDetail", async (req, res, next) => {
    console.log("Update Ad Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            url: req.body.data.url,
            time: req.body.data.time,
            is_active: req.body.data.is_active,
        },
    ];
    await models.ads
        .update(
            {
                url: values[0].url,
                time: values[0].time,
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
                    message: "Ad Detail Updated Successfully",
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

//Update Ad Status
router.post("/Update_AdStatus", async (req, res, next) => {
    console.log("Update Ad Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.ads
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
                    message: "Ad Status Updated Successfully",
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

//Update Ad Pic
router.post("/Update_AdPic", async (req, res, next) => {
    console.log("Update Ad Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            image: req.body.data.image,
        },
    ];
    await models.ads
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
                    message: "Ad Pic Updated Successfully",
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
        cb(null, "./AdsImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload Ad Pic
var upload = multer({ storage: storage }).single("file");
router.post("/AdPic", function (req, res) {
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

//Delete Single Ad
router.get("/Delete_SingleAd/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.ads
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Ad Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Ad Deleted Successfully.",
          });
        } else {
          console.log("No Ad Found");
          res.json({
            successful: false,
            message: "No Ad Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Ad: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Ad: " + err,
        });
      });
  });

module.exports = router;