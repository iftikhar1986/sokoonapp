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
		    datacount: data.length,
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
        isAdmin, 
        token, 
        emailVerified, 
        photoURL, 
        uid, 
        phone, 
        countryCode, 
        name,
        email, 
        is_active 
    } = req.body.data;

    values = [
        {
            lastLogin: req.body.lastLogin,
            countryISOCode: req.body.countryISOCode,
            isAdmin: req.body.isAdmin,
            token: req.body.token,
            emailVerified: req.body.emailVerified, 
            photoURL: req.body.photoURL,
            uid: req.body.uid,
            phone: req.body.phone,
            countryCode: req.body.countryCode,
            name: req.body.name,
            email: req.body.email,
            is_active: req.body.is_active,
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
            isAdmin: req.body.data.isAdmin,
            token: req.body.data.token,
            emailVerified: req.body.data.emailVerified, 
            photoURL: req.body.data.photoURL,
            uid: req.body.data.uid,
            phone: req.body.data.phone,
            countryCode: req.body.data.countryCode,
            name: req.body.data.name,
            email: req.body.data.email,
            is_active: req.body.data.is_active,
        },
    ];
    await models.users
        .update(
            {
                lastLogin: values[0].lastLogin,
                countryISOCode: values[0].countryISOCode,
                isAdmin: values[0].isAdmin,
                token: values[0].token,
                emailVerified: values[0].emailVerified, 
                photoURL: values[0].photoURL,
                uid: values[0].uid,
                phone: values[0].phone,
                countryCode: values[0].countryCode,
                name: values[0].name,
                email: values[0].email,
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

//Update User Status
router.post("/Update_UserStatus", async (req, res, next) => {
    console.log("Update User Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.users
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
                    message: "User Status Updated Successfully",
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

//Update User Pic
router.post("/Update_UserPic", async (req, res, next) => {
    console.log("Update User Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            photoURL: req.body.data.photoURL,
        },
    ];
    await models.users
        .update(
            {
                photoURL: values[0].photoURL,
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
                    message: "User Pic Updated Successfully",
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
        cb(null, "./UsersImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload User Pic
var upload = multer({ storage: storage }).single("file");
router.post("/UserPic", function (req, res) {
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