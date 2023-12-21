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

//Get Single UserGuide
router.get("/Get_SingleUserGuide/:ug_id", (req, res, next) => {
    const { ug_id } = req.params;

    models.userGuides
        .findAll({
            where: {
                id: ug_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("UserGuide Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "UserGuide Get Successfully",
                });
            } else {
                console.log("No UserGuide Found");
                res.json({
                    successful: false,
                    message: "No UserGuide Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get UserGuide: ", err);
            res.json({
                successful: false,
                message: "Failed To Get UserGuide: " + err,
            });
        });
});

//Get All UserGuides
router.get("/Get_AllUserGuides", (req, res, next) => {
    models.userGuides
        .findAll({
            order: [["created_at", "DESC"]],
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All UserGuides Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All UserGuides Successfully",
                });
            } else {
                console.log("No UserGuides Found");
                res.json({
                    successful: false,
                    message: "No UserGuides Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All UserGuides: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All UserGuides: " + err,
            });
        });
});

//Create UserGuide
router.post("/Create_UserGuide", async (req, res, next) => {
    const { language, title, picture, description, is_active } = req.body.data;

    values = [
        {
            language: req.body.language,
            title: req.body.title,
            picture: req.body.picture,
            description: req.body.description,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.userGuides
        .findAll({
            where: {
                title: values[0].title,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("UserGuide already exists");
                res.json({
                    successful: false,
                    message: "UserGuide already exists",
                });
            } else {
                models.userGuides
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "UserGuide Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New UserGuide",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New UserGuide: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New UserGuide: " + err,
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

//Update UserGuide Detail
router.post("/Update_UserGuideDetail", async (req, res, next) => {
    console.log("Update UserGuide Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            language: req.body.data.language,
            title: req.body.data.title,
            picture: req.body.data.picture,
            description: req.body.data.description,
            is_active: req.body.data.is_active,
        },
    ];
    await models.userGuides
        .update(
            {
                language: rvalues[0].language,
                title: rvalues[0].title,
                picture: rvalues[0].picture,
                description: rvalues[0].description,
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
                    message: "UserGuide Detail Updated Successfully",
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

//Update UserGuide Status
router.post("/Update_UserGuideStatus", async (req, res, next) => {
    console.log("Update UserGuide Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.userGuides
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
                    message: "UserGuide Status Updated Successfully",
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

//Update UserGuide Pic
router.post("/Update_UserGuidePic", async (req, res, next) => {
    console.log("Update UserGuide Pic API Calling", req.body.data);
   
    values = [
        {
            id: req.body.data.id,
            picture: req.body.data.picture,
        },
    ];
    await models.userGuides
        .update(
            {
                picture: values[0].picture,
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
                    message: "UserGuide Pic Updated Successfully",
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
        cb(null, "./UserGuidesImages");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

//Upload UserGuide Pic
var upload = multer({ storage: storage }).single("file");
router.post("/UserGuidePic", function (req, res) {
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

//Delete Single UserGuide
router.get("/Delete_SingleUserGuide/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.userGuides
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("UserGuide Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "UserGuide Deleted Successfully.",
          });
        } else {
          console.log("No UserGuide Found");
          res.json({
            successful: false,
            message: "No UserGuide Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete UserGuide: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete UserGuide: " + err,
        });
      });
  });


module.exports = router;