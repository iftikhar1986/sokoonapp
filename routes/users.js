const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single User
router.get("/Get_SingleUser/:usrs_id", (req, res, next) => {
    const { usrs_id } = req.params;

    models.users
        .findAll({
            where: {
                id: usrs_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("User Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "User Get Successfully",
                });
            } else {
                console.log("No User Found");
                res.json({
                    successful: false,
                    message: "No User Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get User: ", err);
            res.json({
                successful: false,
                message: "Failed To Get User: " + err,
            });
        });
});

//Get All Users
router.get("/Get_AllUsers", (req, res, next) => {
    models.users
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Users Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Users Successfully",
                });
            } else {
                console.log("No Users Found");
                res.json({
                    successful: false,
                    message: "No Users Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Users: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Users: " + err,
            });
        });
});

//Create User
router.post("/Create_User", async (req, res, next) => {
    const {
        lastLogin, 
        countryISOCode, 
        token, 
        emailVerified, 
        uid, 
        phone, 
        countryCode, 
        name,
        email, 
    } = req.body.data;

    values = [
        {
            lastLogin: req.body.lastLogin,
            countryISOCode: req.body.countryISOCode,
            token: req.body.token,
            emailVerified: req.body.emailVerified, 
            uid: req.body.uid,
            phone: req.body.phone,
            countryCode: req.body.countryCode,
            name: req.body.name,
            email: req.body.email,
            created_at: new Date().toISOString(),
        },
    ];
    await models.users
        .findAll({
            where: {
                uid: values[0].uid,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("User already exists");
                res.json({
                    successful: false,
                    message: "User already exists",
                });
            } else {
                models.users
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "User Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New User",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New User: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New User: " + err,
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

//Update User Detail
router.post("/Update_UserDetail", async (req, res, next) => {
    console.log("Update User Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            lastLogin: req.body.data.lastLogin,
            countryISOCode: req.body.data.countryISOCode,
            token: req.body.data.token,
            emailVerified: req.body.data.emailVerified, 
            uid: req.body.data.uid,
            phone: req.body.data.phone,
            countryCode: req.body.data.countryCode,
            name: req.body.data.name,
            email: req.body.data.email,
        },
    ];
    await models.users
        .update(
            {
                lastLogin: values[0].lastLogin,
                countryISOCode: values[0].countryISOCode,
                token: values[0].token,
                emailVerified: values[0].emailVerified, 
                uid: values[0].uid,
                phone: values[0].phone,
                countryCode: values[0].countryCode,
                name: values[0].name,
                email: values[0].email,
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
                    message: "User Detail Updated Successfully",
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

//Delete Single User
router.get("/Delete_SingleUser/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.users
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("User Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "User Deleted Successfully.",
          });
        } else {
          console.log("No User Found");
          res.json({
            successful: false,
            message: "No User Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete User: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete User: " + err,
        });
      });
  });


module.exports = router;