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

//Get Single Word
router.get("/Get_SingleWord/:wd_id", (req, res, next) => {
    const { wd_id } = req.params;

    models.words
        .findAll({
            where: {
                id: wd_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Word Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Word Get Successfully",
                });
            } else {
                console.log("No Word Found");
                res.json({
                    successful: false,
                    message: "No Word Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Word: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Word: " + err,
            });
        });
});

//Get All Words
router.get("/Get_AllWords", (req, res, next) => {
    models.words
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Words Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Words Successfully",
                });
            } else {
                console.log("No Words Found");
                res.json({
                    successful: false,
                    message: "No Words Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Words: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Words: " + err,
            });
        });
});

//Create Word
router.post("/Create_Word", async (req, res, next) => {
    const { 
        catAZAr,
        idWord,
        arabic,
        english,
        catAZEn,
        catAZFr,
        video,
        categories,
        french,
        videoUrl,
        thumbnail,
        is_active 
    } = req.body.data;

    values = [
        {
            catAZAr : req.body.data.catAZAr,
            idWord : req.body.data.idWord,
            arabic : req.body.data.arabic,
            english : req.body.data.english,
            catAZEn : req.body.data.catAZEn,
            catAZFr : req.body.data.catAZFr,
            video : req.body.data.video,
            categories: req.body.data.categories,
            french : req.body.data.french,
            videoUrl : req.body.data.videoUrl,
            thumbnail : req.body.data.thumbnail,
            is_active: req.body.data.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.words
        .findAll({
            where: {
                english: values[0].english,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Word already exists");
                res.json({
                    successful: false,
                    message: "Word already exists",
                });
            } else {
                models.words
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Word Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Word",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Word: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Word: " + err,
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

//Update Word Detail
router.post("/Update_WordDetail", async (req, res, next) => {
    console.log("Update Word Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            catAZAr : req.body.data.catAZAr,
            idWord : req.body.data.idWord,
            arabic : req.body.data.arabic,
            english : req.body.data.english,
            catAZEn : req.body.data.catAZEn,
            catAZFr : req.body.data.catAZFr,
            video : req.body.data.video,
            categories: req.body.data.categories,
            french : req.body.data.french,
            videoUrl : req.body.data.videoUrl,
            thumbnail : req.body.data.thumbnail,
            is_active: req.body.data.is_active,
        },
    ];
    await models.words
        .update(
            {
                catAZAr : values[0].catAZAr,
                idWord : values[0].idWord,
                arabic : values[0].arabic,
                english : values[0].english,
                catAZEn : values[0].catAZEn,
                catAZFr : values[0].catAZFr,
                video : values[0].video,
                categories: values[0].categories,
                french : values[0].french,
                videoUrl : values[0].videoUrl,
                thumbnail : values[0].thumbnail,
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
                    message: "Word Detail Updated Successfully",
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

//Update Word Status
router.post("/Update_WordStatus", async (req, res, next) => {
    console.log("Update Word Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.words
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
                    message: "Word Status Updated Successfully",
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

//Update Word Pic
router.post("/Update_WordPic", async (req, res, next) => {
    console.log("Update Word Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            thumbnail: req.body.data.thumbnail,
        },
    ];
    await models.words
        .update(
            {
                thumbnail: values[0].thumbnail,
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
                    message: "Word Pic Updated Successfully",
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

//Update Word Vid
router.post("/Update_WordVid", async (req, res, next) => {
    console.log("Update Word Vid API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            videoUrl: req.body.data.videoUrl,
        },
    ];
    await models.words
        .update(
            {
                videoUrl: values[0].videoUrl,
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
                    message: "Word Pic Updated Successfully",
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
        cb(null, "./WordsImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload Word Pic
var upload = multer({ storage: storage }).single("file");
router.post("/WordPic", function (req, res) {
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

//Upload Word Vid
var upload = multer({ storage: storage }).single("file");
router.post("/WordVid", function (req, res) {
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

//Delete Single Word
router.get("/Delete_SingleWord/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.words
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Word Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Word Deleted Successfully.",
          });
        } else {
          console.log("No Word Found");
          res.json({
            successful: false,
            message: "No Word Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Word: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Word: " + err,
        });
      });
  });


module.exports = router;