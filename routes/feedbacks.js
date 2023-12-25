const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single Feedback
router.get("/Get_SingleFeedback/:fb_id", (req, res, next) => {
    const { fb_id } = req.params;

    models.feedbacks
        .findAll({
            where: {
                id: fb_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Feedback Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Feedback Get Successfully",
                });
            } else {
                console.log("No Feedback Found");
                res.json({
                    successful: false,
                    message: "No Feedback Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Feedback: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Feedback: " + err,
            });
        });
});

//Get All Feedbacks
router.get("/Get_AllFeedbacks", (req, res, next) => {
    models.feedbacks
        .findAll({
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Feedbacks Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Feedbacks Successfully",
                });
            } else {
                console.log("No Feedbacks Found");
                res.json({
                    successful: false,
                    message: "No Feedbacks Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Feedbacks: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Feedbacks: " + err,
            });
        });
});

//Create Feedback
router.post("/Create_Feedback", async (req, res, next) => {
    const { 
        feedback, 
        reference,
        string,
        provided,
        isRead
    } = req.body.data;

    values = [
        {
            feedback: req.body.feedback,
            reference: req.body.reference,
            string: req.body.string,
            provided: req.body.provided,
            isRead: req.body.isRead,
            created_at: new Date().toISOString(),
        },
    ];
    await models.feedbacks
        .findAll({

        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Feedback already exists");
                res.json({
                    successful: false,
                    message: "Feedback already exists",
                });
            } else {
                models.feedbacks
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Feedback Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Feedback",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Feedback: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Feedback: " + err,
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

//Update Feedback Detail
router.post("/Update_FeedbackDetail", async (req, res, next) => {
    console.log("Update Feedback Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            feedback: req.body.data.feedback,
            reference: req.body.data.reference,
            string: req.body.data.string,
            provided: req.body.data.provided,
            isRead: req.body.data.isRead,
        },
    ];
    await models.feedbacks
        .update(
            {
                feedback: values[0].feedback,
                reference: values[0].reference,
                string: values[0].string,
                provided: values[0].provided,
                isRead: values[0].isRead,
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
                    message: "Feedback Detail Updated Successfully",
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


//Delete Single Feedback
router.get("/Delete_SingleFeedback/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.feedbacks
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Feedback Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Feedback Deleted Successfully.",
          });
        } else {
          console.log("No Feedback Found");
          res.json({
            successful: false,
            message: "No Feedback Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Feedback: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Feedback: " + err,
        });
      });
  });


module.exports = router;