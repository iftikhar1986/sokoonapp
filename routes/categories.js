const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single Category
router.get("/Get_SingleCategory/:cat_id", (req, res, next) => {
    const { cat_id } = req.params;

    models.categories
        .findAll({
            where: {
                id: cat_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Category Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Category Get Successfully",
                });
            } else {
                console.log("No Category Found");
                res.json({
                    successful: false,
                    message: "No Category Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Category: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Category: " + err,
            });
        });
});

//Get All Categories
router.get("/Get_AllCategories", (req, res, next) => {
    models.categories
        .findAll({
        })
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Categories Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Categories Successfully",
                });
            } else {
                console.log("No Categories Found");
                res.json({
                    successful: false,
                    message: "No Categories Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Categories: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Categories: " + err,
            });
        });
});

//Create Category
router.post("/Create_Category", async (req, res, next) => {
    const {categorieAr, categorieEn, categorieFr, is_active } = req.body.data;
    values = [
        {
            categorieEn: req.body.categorieEn,
            categorieFr: req.body.categorieFr,
            categorieAr: req.body.categorieAr,
            is_active: req.body.is_active,
            created_at: new Date().toISOString(),
        },
    ];
    await models.categories
        .findAll({
            where: {
                categprieEn: values[0].categprieEn,
            },
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Category already exists");
                res.json({
                    successful: false,
                    message: "Category already exists",
                });
            } else {
                models.categories
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Category Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Category",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Category: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Category: " + err,
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

//Update Category Detail
router.post("/Update_CategoryDetail", async (req, res, next) => {
    console.log("Update Category Detail API Calling:", req.body.data);
    values = [
        {
            id: req.body.data.id,
            categorieEn: req.body.data.categorieEn,
            categorieFr: req.body.data.categorieFr,
            categorieAr: req.body.data.categorieAr,
            is_active: req.body.data.is_active,
        },
    ];
    await models.categories
        .update(
            {
                categorieEn: values[0].categorieEn,
                categorieFr: values[0].categorieFr,
                categorieAr: values[0].categorieAr,
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
                    message: "Category Detail Updated Successfully",
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

//Update Category Status
router.post("/Update_CategoryStatus", async (req, res, next) => {
    console.log("Update Category Status API calling", req.body.data);
    values = [
        {
            id: req.body.data.id,
            status: req.body.data.status,
        },
    ];
    await models.categories
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
                    message: "Category Status Updated Successfully",
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

//Delete Single Category
router.get("/Delete_SingleCategory/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.categories
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Category Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Category Deleted Successfully.",
          });
        } else {
          console.log("No Category Found");
          res.json({
            successful: false,
            message: "No Category Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Category: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Category: " + err,
        });
      });
  });

module.exports = router;