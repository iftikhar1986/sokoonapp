const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single Notification
router.get("/Get_SingleNotification/:nt_id", (req, res, next) => {
    const { nt_id } = req.params;

    models.notifications
        .findAll({
            where: {
                id: nt_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Notification Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Notification Get Successfully",
                });
            } else {
                console.log("No Notification Found");
                res.json({
                    successful: false,
                    message: "No Notification Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Notification: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Notification: " + err,
            });
        });
});

//Get All Notifications
router.get("/Get_AllNotifications", (req, res, next) => {
    models.notifications
        .findAll({
           
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Notifications Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Notifications Successfully",
                });
            } else {
                console.log("No Notifications Found");
                res.json({
                    successful: false,
                    message: "No Notifications Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Notifications: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Notifications: " + err,
            });
        });
});

//Create Notification
router.post("/Create_Notification", async (req, res, next) => {
    const { idWord, typenoti, title, body, messageAr, messageEn, messageFr } = req.body.data;

    values = [
        {
            idWord: req.body.data.idWord,
            title: req.body.data.title,
            body: req.body.data.body,
            typenoti: req.body.data.typenoti,
            messageEn: req.body.data.messageEn,
	    messageAr: req.body.data.messageAr,
            messageFr: req.body.data.messageFr,
            created_at: new Date().toISOString(),
        },
    ];
    await models.notifications
        .findAll({
            where: {
                title: values[0].title,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Same Notification already exists");
                res.json({
                    successful: false,
                    message: "Same Notification already exists",
                });
            } else {
                models.notifications
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Notification Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Notification Created Successfully",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Notification: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Notification: " + err,
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

//Update Notification Detail
router.post("/Update_NotificationDetail", async (req, res, next) => {
    console.log("Update Notification Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
             idWord: req.body.data.idWord,
            title: req.body.data.title,
            body: req.body.data.body,
            typenoti: req.body.data.typenoti,
            messageEn: req.body.data.messageEn,
	    messageAr: req.body.data.messageAr,
            messageFr: req.body.data.messageFr,
            updated_at: new Date().toISOString(),
        },
    ];
    await models.notifications
        .update(
            {
                idWord: values[0].idWord,
            title: values[0].title,
            body: values[0].body,
            typenoti: values[0].typenoti,
            messageEn: values[0].messageEn,
	    messageAr: values[0].messageAr,
            messageFr: values[0].messageFr,
            updated_at: values[0].updated_at,
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
                    message: "Notification Detail Updated Successfully",
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




//Delete Single Notification
router.get("/Delete_SingleNotification/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.notifications
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Notification Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Notification Deleted Successfully.",
          });
        } else {
          console.log("No Notification Found");
          res.json({
            successful: false,
            message: "No Notification Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Notification: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Notification: " + err,
        });
      });
  });


module.exports = router;
