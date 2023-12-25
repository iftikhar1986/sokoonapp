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

//Get Single Sentence
router.get("/Get_SingleSentence/:snt_id", (req, res, next) => {
    const { snt_id } = req.params;

    models.sentences
        .findAll({
            where: {
                id: snt_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Sentence Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Sentence Get Successfully",
                });
            } else {
                console.log("No Sentence Found");
                res.json({
                    successful: false,
                    message: "No Sentence Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Sentence: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Sentence: " + err,
            });
        });
});

//Get All Sentences
router.get("/Get_AllSentences", (req, res, next) => {
    models.sentences
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Sentences Successfully");
                res.json({
                    data: data,
		    datacount: data.length,
                    successful: true,
                    message: "Get All Sentences Successfully",
                });
            } else {
                console.log("No Sentences Found");
                res.json({
                    successful: false,
                    message: "No Sentences Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Sentences: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Sentences: " + err,
            });
        });
});

//Create Sentence
router.post("/Create_Sentence", async (req, res, next) => {
    const { catAZAr, idWord, arabic, english, catAZEn, catAZFr, french, videoUrl, thumbnail, is_active } = req.body.data;

    values = [
        {
            catAZAr: req.body.catAZAr,
            idWord: req.body.idWord,
            arabic: req.body.arabic,
            english: req.body.english,
            catAZEn: req.body.catAZEn,
            catAZFr: req.body.catAZFr,
	    video: req.body.data.video,
            french: req.body.french,
            videoUrl: req.body.videoUrl,
            thumbnail: req.body.thumbnail,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.sentences
        .findAll({
            where: {
                arabic: values[0].arabic,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Sentence already exists");
                res.json({
                    successful: false,
                    message: "Sentence already exists",
                });
            } else {
                models.sentences
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Sentence Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Sentence",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Sentence: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Sentence: " + err,
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

//Update Sentence Detail
router.post("/Update_SentenceDetail", async (req, res, next) => {
    console.log("Update Sentence Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            catAZAr: req.body.data.catAZAr,
            idWord: req.body.data.idWord,
            arabic: req.body.data.arabic,
            english: req.body.data.english,
            catAZEn: req.body.data.catAZEn,
            catAZFr: req.body.data.catAZFr,
	    video: req.body.data.video,
            french: req.body.data.french,
            videoUrl: req.body.data.videoUrl,
            thumbnail: req.body.data.thumbnail,
            is_active: req.body.data.is_active,
        },
    ];
    await models.sentences
        .update(
            {
                catAZAr:values[0].catAZAr,
                idWord:values[0].idWord,
                arabic:values[0].arabic,
                english:values[0].english,
                catAZEn:values[0].catAZEn,
                catAZFr:values[0].catAZFr,
                video:values[0].video,
                french:values[0].french,
                videoUrl:values[0].videoUrl,
                thumbnail:values[0].thumbnail,
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
                    message: "Sentence Detail Updated Successfully",
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

//Update Sentence Status
router.post("/Update_SentenceStatus", async (req, res, next) => {
    console.log("Update Sentence Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.sentences
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
                    message: "Sentence Status Updated Successfully",
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

//Update Sentence Pic
router.post("/Update_SentencePic", async (req, res, next) => {
    console.log("Update Sentence Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            thumbnail: req.body.data.thumbnail,
        },
    ];
    await models.sentences
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
                    message: "Sentence Pic Updated Successfully",
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

//Update Sentence Vid
router.post("/Update_SentenceVid", async (req, res, next) => {
    console.log("Update Sentence Vid API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            videoUrl: req.body.data.videoUrl,
        },
    ];
    await models.sentences
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
                    message: "Sentence Pic Updated Successfully",
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
        cb(null, "./SentencesImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload Sentence Pic
var upload = multer({ storage: storage }).single("file");
router.post("/SentencePic", function (req, res) {
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

//Upload Sentence Video
var upload = multer({ storage: storage }).single("file");
router.post("/SentenceVideo", function (req, res) {
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

//Delete Single Sentence
router.get("/Delete_SingleSentence/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.sentences
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Sentence Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Sentence Deleted Successfully.",
          });
        } else {
          console.log("No Sentence Found");
          res.json({
            successful: false,
            message: "No Sentence Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Sentence: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Sentence: " + err,
        });
      });
  });


module.exports = router;