const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
} = require("../config");

//Get Single User Favourite
router.get("/Get_SingleUserFavourite/:user_id", (req, res, next) => {
    const { user_id } = req.params;

    models.favourites
        .findAll({
            where: {
                id: user_id,
            }
        })

        .then((data) => {
            if (data?.length != 0) {
                console.log("Favourite Get Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Favourite Get Successfully",
                });
            } else {
                console.log("No Favourite Found");
                res.json({
                    successful: false,
                    message: "No Favourite Found",
                });
            }
        })

        .catch(function (err) {
            console.log("Failed To Get Favourite: ", err);
            res.json({
                successful: false,
                message: "Failed To Get Favourite: " + err,
            });
        });
});

//Get All Favourites
router.get("/Get_AllFavourites", (req, res, next) => {
    models.favourites
        .findAll(
	    {
            include: [
                { model: models.users, required: false },
              ]
        },
      )
        .then((data) => {
            if (data?.length > 0) {
                console.log("Get All Favourites Successfully");
                res.json({
                    data: data,
                    successful: true,
                    message: "Get All Favourites Successfully",
                });
            } else {
                console.log("No Favourites Found");
                res.json({
                    successful: false,
                    message: "No Favourites Found",
                });
            }
        })
        .catch(function (err) {
            console.log("Failed To Get All Favourites: ", err);
            res.json({
                successful: false,
                message: "Failed To Get All Favourites: " + err,
            });
        });
});

//Create Favourite
router.post("/Create_Favourite", async (req, res, next) => {
    const { 
        user_id,
        video_url
    } = req.body.data;

    values = [
        {
            user_id: req.body.data.user_id,
            video_url: req.body.data.video_url,
        },
    ];
    await models.favourites
        .findAll({
 
        })
        .then((data) => {
            if (data?.length !== 0) {
                console.log("Favourite already exists");
                res.json({
                    successful: false,
                    message: "Favourite already exists",
                });
            } else {
                models.favourites
                    .bulkCreate(values)
                    .then((x) => {
                        if (x?.length !== 0) {
                            const accessToken = jwt.sign(
                                {
                                    successful: true,
                                    message: "Favourite Created Successfully",
                                    data: x[0],
                                },
                                accessTokenSecret
                            );
                            res.json({
                                successful: true,
                                message: "Unable to Create New Favourite",
                                data: x[0].id,
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log("Failed to Create New Favourite: ", err);
                        res.json({
                            successful: false,
                            message: "Failed to Create New Favourite: " + err,
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


//Delete Single Favourite
router.get("/Delete_SingleFavourite/:id", (req, res, next) => {
    const { id } = req.params;
  
    models.favourites
      .destroy({
        where: {
          id: id,
        },
      })
      .then((data) => {
        if (data?.length > 0) {
          console.log("Favourite Deleted Successfully.");
          res.json({
            data: data,
            successful: true,
            message: "Favourite Deleted Successfully.",
          });
        } else {
          console.log("No Favourite Found");
          res.json({
            successful: false,
            message: "No Favourite Found",
          });
        }
      })
      .catch(function (err) {
        console.log("Failed To Delete Favourite: ", err);
        res.json({
          successful: false,
          message: "Failed To Delete Favourite: " + err,
        });
      });
  });


module.exports = router;
