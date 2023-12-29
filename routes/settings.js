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
    const { titleEn, titleAr, titleFr, descriptionAr, descriptionEn, descriptionFr, image1, image2, image3, image4, url1, url2, url3, url4 } = req.body.data;

    values = [
        {
            titleFr: req.body.data.titleFr,
            titleAr: req.body.data.titleAr,
            titleEn: req.body.data.titleEn,
            descriptionFr: req.body.data.descriptionFr,
            descriptionEn: req.body.data.descriptionEn,
            descriptionAr: req.body.data.descriptionAr,
            image1: req.body.data.image1,
            image2: req.body.data.image2,
            image3: req.body.data.image3,
            image4: req.body.data.image4,
            url1: req.body.data.url1,
            url2: req.body.data.url2,
            url3: req.body.data.url3,
            url4: req.body.data.url4,
        },
    ];
    await models.settings
        .findAll({
            where: {
                titleAr: values[0].titleAr,
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
                                message: "Setting Created Successfully",
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
            titleFr: req.body.data.titleFr,
            titleAr: req.body.data.titleAr,
            titleEn: req.body.data.titleEn,
            descriptionFr: req.body.data.descriptionFr,
            descriptionEn: req.body.data.descriptionEn,
            descriptionAr: req.body.data.descriptionAr,
            image1: req.body.data.image1,
            image2: req.body.data.image2,
            image3: req.body.data.image3,
            image4: req.body.data.image4,
            url1: req.body.data.url1,
            url2: req.body.data.url2,
            url3: req.body.data.url3,
            url4: req.body.data.url4,
        },
    ];
    await models.settings
        .update(
            {
                titleFr: values[0].titleFr,
                titleAr: values[0].titleAr,
                titleEn: values[0].titleEn,
                descriptionFr: values[0].descriptionFr,
                descriptionEn: values[0].descriptionEn,
                descriptionAr: values[0].descriptionAr,
                updated_at: new Date().toISOString(),
                image1: values[0].image1,
                image2: values[0].image2,
                image3: values[0].image3,
                image4: rvalues[0].image4,
                url1: values[0].url1,
                url2: values[0].url2,
                url3: values[0].url3,
                url4: values[0].url4,
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


//Update Setting Pic1
router.post("/Update_SettingPic1", async (req, res, next) => {
    console.log("Update Setting Pic API Calling", req.body.data);

    values = [
        {
            id: req.body.data.id,
            image1: req.body.data.image1,
        },
    ];
    await models.settings
        .update(
            {
                image1: values[0].image1,
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

//Update Setting Pic2
router.post("/Update_SettingPic2", async (req, res, next) => {
    console.log("Update Setting Pic API Calling", req.body.data);

    values = [
        {
            id: req.body.data.id,
            image2: req.body.data.image2,
        },
    ];
    await models.settings
        .update(
            {
                image2: values[0].image2,
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

//Update Setting Pic3
router.post("/Update_SettingPic3", async (req, res, next) => {
    console.log("Update Setting Pic API Calling", req.body.data);

    values = [
        {
            id: req.body.data.id,
            image3: req.body.data.image3,
        },
    ];
    await models.settings
        .update(
            {
                image3: values[0].image3,
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

//Update Setting Pic4
router.post("/Update_SettingPic4", async (req, res, next) => {
    console.log("Update Setting Pic API Calling", req.body.data);

    values = [
        {
            id: req.body.data.id,
            image4: req.body.data.image4,
        },
    ];
    await models.settings
        .update(
            {
                image4: values[0].image4,
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

//Upload Setting Pic1
var upload = multer({ storage: storage }).single("file");
router.post("/SettingPic1", function (req, res) {
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

    //Upload Setting Pic2
    var upload = multer({ storage: storage }).single("file");
    router.post("/SettingPic2", function (req, res) {
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

    //Upload Setting Pic3
    var upload = multer({ storage: storage }).single("file");
    router.post("/SettingPic3", function (req, res) {
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


    //Upload Setting Pic4
    var upload = multer({ storage: storage }).single("file");
    router.post("/SettingPic4", function (req, res) {
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