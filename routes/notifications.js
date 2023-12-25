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
            order: [["created_at", "DESC"]],
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
    const { idWord, messageAr, isRead, messageEn, title, body, isWord, time, messageFr, is_active } = req.body.data;

    values = [
        {
            idWord: req.body.data.idWord,
            messageAr: req.body.data.messageAr,
            isRead: req.body.data.isRead,
            messageEn: req.body.data.messageEn,
            title: req.body.data.title,
            body: req.body.data.body,
            isWord: req.body.data.isWord,
            time: req.body.data.time,
            messageFr: req.body.data.messageFr,
            is_active: req.body.data.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.notifications
        .findAll({
            where: {
                idWord: values[0].idWord,
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
                                message: "Unable to Create New Notification",
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
            messageAr: req.body.data.messageAr,
            isRead: req.body.data.isRead,
            messageEn: req.body.data.messageEn,
            title: req.body.data.title,
            body: req.body.data.body,
            isWord: req.body.data.isWord,
            time: req.body.data.time,
            messageFr: req.body.data.messageFr,
            is_active: req.body.data.is_active,
        },
    ];
    await models.notifications
        .update(
            {
                idWord: values[0].idWord,
                messageAr: values[0].messageAr,
                isRead: values[0].isRead,
                messageEn: values[0].messageEn,
                title: values[0].title,
                body: values[0].body,
                isWord: values[0].isWord,
                time: values[0].time,
                messageFr: values[0].messageFr,
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

//Update Notification Status
router.post("/Update_NotificationStatus", async (req, res, next) => {
    console.log("Update Notification Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.notifications
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
                    message: "Notification Status Updated Successfully",
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