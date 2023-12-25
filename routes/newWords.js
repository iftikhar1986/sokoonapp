const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single New Word
router.get("/Get_SingleNewWord/:nw_id", (req, res, next) => {
    const { nw_id } = req.params;

    models.newWords
        .findAll({
            where: {
                id: nw_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("New Word Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Bew Word Get Successfully",
                });
            } else {
                console.log("No New Word Found");
                res.json({
                    successful: false,
                    message: "No New Word Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get newWord: ", err);
            res.json({
                successful: false,
                message: "Failed To Get newWord: " + err,
            });
        });
});

//Get All New Words
router.get("/Get_AllNewWords", (req, res, next) => {
    models.newWords
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All New Words Successfully");
                res.json({
                    data: data,
	            datacount: data.length,
                    successful: true,
                    message: "Get All New Words Successfully",
                });
            } else {
                console.log("No New Words Found");
                res.json({
                    successful: false,
                    message: "No newWords Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All New Words: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All New Words: " + err,
            });
        });
});

//Create New Word
router.post("/Create_NewWord", async (req, res, next) => {
    const { timer, isRead, word, is_active } = req.body.data;

    values = [
        {
            timer: req.body.timer,
            isRead: req.body.isRead,
            word: req.body.word,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.newWords
        .findAll({
            where: {
                word: values[0].word,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("New Word already exists");
                res.json({
                    successful: false,
                    message: "New Word already exists",
                });
            } else {
                models.newWords
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "New Word Created Successfully",
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

//Update New Word Detail
router.post("/Update_NewWordDetail", async (req, res, next) => {
    console.log("Update New Word Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            timer: req.body.data.timer,
            isRead: req.body.data.isRead,
            word: req.body.data.word,
            is_active: req.body.data.is_active,
        },
    ];
    await models.newWords
        .update(
            {
                timer: values[0].timer,
                isRead: values[0].isRead,
                word: values[0].word,
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
                    message: "newWord Detail Updated Successfully",
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

//Update New Word Status
router.post("/Update_NewWordstatus", async (req, res, next) => {
    console.log("Update newWord Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.newWords
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
                    message: "newWord Status Updated Successfully",
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

//Delete Single New Word
router.get("/Delete_SingleNewWord/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.newWords
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("newWord Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "newWord Deleted Successfully.",
          });
        } else {
          console.log("No newWord Found");
          res.json({
            successful: false,
            message: "No newWord Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete newWord: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete newWord: " + err,
        });
      });
  });


module.exports = router;