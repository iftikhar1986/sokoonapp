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
           
	    include: [
                { model: models.users, required: false },
              ]
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All New Words Successfully");
                res.json({
                    data: data,
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
    const { reference, isRead, word } = req.body.data;

    values = [
        {
            reference: req.body.data.timer,
            isRead: req.body.data.isRead,
            word: req.body.data.word,
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
                console.log("New Word Suggestion already exists");
                res.json({
                    successful: false,
                    message: "New Word Suggestion already exists",
                });
            } else {
                models.newWords
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "New Word Suggested Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Suggest New Word",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Suggest New Word: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Suggest New Word: " + err,
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
            reference: req.body.data.reference,
            isRead: req.body.data.isRead,
            word: req.body.data.word,
        },
    ];
    await models.newWords
        .update(
            {
                reference: values[0].reference,
                isRead: values[0].isRead,
                word: values[0].word,
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
