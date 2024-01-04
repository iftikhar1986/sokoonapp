const express = require("express");
const router = express.Router();
const models = require("../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("../middleware/auth");
const {
  saltRounds,
  accessTokenSecret,
  smtpTransport,
} = require("../config");
const multer = require("multer");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
var randomstring = require("randomstring");

sgMail.setApiKey(
  "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"
);

//Admin Register
router.post("/Register", async (req, res, next) => {
  const { otp, f_name, email } = req.body.r_data;
  let hashed_pass = "";
  await bcrypt.hash(req.body.r_data.password, saltRounds).then((hash) => {
    hashed_pass = hash;
  });
  values = [
    {
      f_name: req.body.r_data.f_name,
      l_name: req.body.r_data.l_name,
      email: req.body.r_data.email,
      password: hashed_pass,
      is_active: "TRUE",
      created_at: new Date().toISOString(),
    },
  ];
  await models.admins
    .findAll({
      where: {
        email: values[0].email,
      },
    })
    .then((data) => {
      if (data?.length !== 0) {
        console.log("Email already exists");
        res.json({
          successful: false,
          message: "Email already exists",
        });
      } else {
        models.admins
          .bulkCreate(values)
          .then((x) => {
            if (x?.length !== 0) {
              const msg = {
                from: "admin@sokoon.qa", // Use the email address or domain you verified above
                personalizations: [
                  {
                    to: [
                      {
                        email: email,
                      },
                    ],
                    dynamic_template_data: {
                      firstname: f_name,
                      otp: otp,
                    },
                  },
                ],
                template_id: "d-6e6fb75f773d4bd7a08a559b12c423e5",
              };

              sgMail.send(msg).then(
                () => {},
                (error) => {
                  console.error(error);

                  if (error.response) {
                    console.error("Failed to Send Email", error.response.body);
                  }
                }
              );

              console.log("Admin Registered Successfully");
              const accessToken = jwt.sign(
                {
                  successful: true,
                  message: "Admin Registered Successfully",
                  data: x[0],
                },
                accessTokenSecret
              );
              res.json({
                successful: true,
                message: "Email has been sent to your address",
                data: x[0].id,
              });
            }
          })
          .catch(function (err) {
            console.log("Failed to Register Candidate: ", err);
            res.json({
              successful: false,
              message: "Failed to Register Candidate: " + err,
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

//Admin Email Verify
router.post("/VerifyEmail", (req, res, next) => {
  values = [
    {
      Email: req.body.data1.new_email,
    },
  ];

  models.admins
    .findAll({
      where: {
        Email: values[0].Email,
      },
    })
    .then((data) => {
      console.log(data?.length);

      if (data?.length != 0) {
        console.log("Email Already Exists");
        res.json({
          Successful: false,
          data: data,
        });
      } else {
        res.json({
          Successful: false,
        });
      }
    })
    .catch(function (err) {
      console.log("Error at find", err);
      res.json({
        Message: "Failed" + err,
        Successful: false,
      });
    });
});

//Admin Login
router.post("/Login", async (req, res, next) => {
  values = [
    {
      email: req.body.l_data.email,
      password: req.body.l_data.password,
      is_login: true,
      last_login: new Date().toISOString(),
    },
  ];
  await models.admins
    .findAll({
      where: {
        email: values[0].email,
      },
    })
    .then((data) => {
        if (data?.length == 0) {
          console.log("Email or Password incorrect");
          res.json({
            successful: false,
            message: "Email or Password incorrect",
          });
        } else {
          let password_check = bcrypt.compare(
            req.body.l_data.password,
            data[0].password
          );
          if (password_check) {
            const accessToken = jwt.sign(
              {
                successful: true,
                message: "Admin Login Successfully.",
                data: data[0],
              },
              accessTokenSecret
            );
            res.json({
              successful: true,
              message: "Admin Login Successfully.",
              data: data[0],
              accessToken: accessToken,
            });
          }else{
 		 console.log("Password incorrect");
          res.json({
            successful: false,
            message: "Password incorrect",
          });
	  }
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

//Admin Get Auth
router.get("/GetAuth", authenticateJWT, (req, res) => {
  console.log("Login Success for: ", req.user);
  res.json(req.user);
});

//Admin Forget password
router.post("/ForgetPassword", async (req, res, next) => {
  console.log("Forger Password API Calling:");
  const { email } = req.body;
  let hashed_pass = "";
  await bcrypt.hash("Sokoon@1234", saltRounds).then((hash) => {
    hashed_pass = hash;
  });

  await models.admins
    .update(
      {
        password: hashed_pass,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          email: email,
        },
      }
    )
    .then((data) => {
      if (data?.length == 0) {
        console.log("Email does not exist");
        res.json({
          successful: false,
          message: "Email does not exist",
        });
      } else {
        const msg = {
          from: "admin@sokoon.io", // Use the email address or domain you verified above
          personalizations: [
            {
              to: [
                {
                  email: email,
                },
              ],
              dynamic_template_data: {},
            },
          ],
          template_id: "d-43d496eb51b34406a077fa962948470c",
        };

        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);
            if (error.response) {
              console.error("Email Send Failed: ", error.response.body);
            }
          }
        );

        res.json({
          successful: true,
          message: "Email has been sent to your Email address.",
        });
      }
    })
    .catch(function (err) {
      console.log("Failed to Recover Password: ", err);
      res.json({
        successful: false,
        message: "Failed to Recover Password: " + err,
      });
    });
});

//Admin Password Reset
router.post("/PasswordReset", authenticateJWT, async (req, res, next) => {

  console.log("Password Reset API Calling:", req.body.pr_data);

  let hashed_pass = "";

  await bcrypt.hash(req.body.pr_data.password, saltRounds).then((hash) => {
    hashed_pass = hash;
  });

  const { name, email } = req.body.pr_data;

  values = [
    {
      id: req.body.pr_data.id,
      password: hashed_pass,
    },
  ];
  models.admins
    .findAll({
      where: {
        id: values[0].id,
      },
    })
    .then(async (data) => {
      if (data?.length != 0) {
        let password_check = await bcrypt.compare(
          req.body.pr_data.password,
          data[0].dataValues.password
        );
        if (password_check) {
          res.json({
            status: "unsuccess",
            successful: false,
            message: "Cannot use same password.",
          });
          return;
        } else {
          models.admins
            .update(
              {
                password: values[0].password,
              },
              {
                where: {
                  id: values[0].id,
                },
              }
            )
            .then(() => {
              const msg = {
                from: "ahsan@flux.pk", // Use the email address or domain you verified above
                personalizations: [
                  {
                    to: [
                      {
                        email: email,
                      },
                    ],
                    dynamic_template_data: {
                      name: name,
                    },
                  },
                ],
                template_id: "d-50b56a8a869445009ed9912d8655e23e",
              };

              sgMail.send(msg).then(
                () => {},
                (error) => {
                  console.error(error);

                  if (error.response) {
                    console.error("my email", error.response.body);
                  }
                }
              );

              res.json({
                status: "success",
                successful: true,
                message: "Password Reset Successfully",
              });
            })
            .catch(function (err) {
              console.log(err);
              res.json({
                message: "Failed to Reset Password" + err,
                successful: false,
              });
            });
        }
      } else {
        console.log("Email does not exist");
        res.json({
          successful: false,
          message: "Email does not exist",
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
});

//Get Admin profile
router.get("/Get_AdminProfile/:admin_id", (req, res, next) => {
  const { admin_id } = req.params;

  models.admins
    .findAll({
      where: {
        id: admin_id,
      }
    })

    .then((data) => {
      if (data?.length != 0) {
        console.log("Admin Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "Admin Get Successfully",
        });
      } else {
        console.log("No Admin Found");
        res.json({
          successful: false,
          message: "No Admin Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get Admin: ", err);
      res.json({
        successful: false,
        message: "Failed To Get Admin: " + err,
      });
    });
});

//Update Admin Status
router.post("/Update_AdminStatus", async (req, res, next) => {
  console.log("Update Admin Status API calling", req.body.data);
  values = [
    {
      id: req.body.data.id,
      status: req.body.data.status,
    },
  ];
  await models.admins
    .update(
      {
        status: values[0].status,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        exclude: ["password", "created_at", "updated_at"],
        include: [
          { model: models.cities, required: false },
          { model: models.states, required: false },
          { model: models.countries, required: false },
        ],
      }
    )
    .then((data) => {
      const val = {
        id: values[0].id,
        status: values[0].status,
      };
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "Admin Status Updated Successfully",
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

//Update Admin Profile
router.post("/Update_AdminProfile", async (req, res, next) => {
  console.log("Update Admin Profile API Calling:", req.body.data);
  values = [
    {
      id: req.body.data.id,
      f_name: req.body.data.f_name,
      l_name: req.body.data.l_name,
      dob: req.body.data.dob,
      gender: req.body.data.gender,
      city_id: parseInt(req.body.data.city_id),
      state_id: parseInt(req.body.data.state_id),
      country_id: parseInt(req.body.data.country_id),
      phone: req.body.data.phone,
      email: req.body.data.email,
    },
  ];
  await models.admins
    .update(
      {
        f_name: values[0].f_name,
        l_name: values[0].l_name,
        dob: values[0].dob,
        gender: values[0].gender,
        city_id: values[0].city_id,
        state_id: values[0].state_id,
        country_id: values[0].country_id,
        phone: values[0].phone,
        email: values[0].email,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        plain: true,
        exclude: ["password", "created_at", "updated_at"],
        include: [
          { model: models.cities, required: false },
          { model: models.states, required: false },
          { model: models.countries, required: false },
        ],
      }
    )
    .then((data) => {
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "Admin Profile Updated Successfully",
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

//Update Admin Profile Pic
router.post("/Update_AdminProfilePic", async (req, res, next) => {
  console.log("Update Admin Profile Pic API Calling",req.body.data);
  values = [
    {
      id: req.body.data.id,
      pic: req.body.data.pic,
    },
  ];
  await models.admins
    .update(
      {
        pic: values[0].pic,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        plain: true,
        exclude: ["password", "created_at", "updated_at"],
        include: [
          { model: models.cities, required: false },
          { model: models.states, required: false },
          { model: models.countries, required: false },
        ],
      }
    )
    .then((data) => {
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "Admin Profile Pic Updated Successfully",
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
    cb(null, "./ProfileImages");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//Upload Profile Pic
var upload = multer({ storage: storage }).single("file");
router.post("/AdminsProfilePic", function (req, res) {
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

//Add Admin Social Profile
router.post("/Add_AdminSocialProfile",authenticateJWT, (req, res, next) => {
  console.log("Add Admin Social Profile API Calling", req.body.data);
  values = [
    {
      admin_id: req.body.data.admin_id,
      social_profile_id: req.body.data.social_profile_id,
      url: req.body.data.url,
      description: req.body.data.description,
      created_at: new Date().toISOString(),
    },
  ];
  models.social_profiles
    .findAll({
      where: {
        admin_id: values[0].admin_id,
        social_profile_id: values[0].social_profile_id,
      },
    })
    .then(async (data) => {
      if (data?.length == 0) {
        await models.social_profiles
          .bulkCreate(values)
          .then((x) => {
            console.log(x);
            res.json({
              status: "success",
              message: "Admin Social Profile Added Successfully",
              data: x,
            });
          })
          .catch(function (err) {
            console.log(err);
            res.json({
              message: "Failed to Add Admin Social Profile" + err,
              successful: false,
            });
          });
      } else {
        console.log("Social Profile Already exist");
        res.json({
          successful: false,
          message: "Social Profile Already exist",
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
}
);

//Get Admin Social Profiles
router.get("/Get_AdminSocialProfiles/:id", (req, res, next) => {
const { id } = req.params;

models.social_profiles
  .findAll({
    where: {
      admin_id: id,
    },
  })

  .then((data) => {
    if (data?.length != 0) {
      console.log("Social Profiles For Admin Get Successfully");
      res.json({
        data: data,
        successful: true,
        message: "Social Profiles For Admin Get Successfully",
      });
    } else {
      console.log("No Social Profiles Found");
      res.json({
        successful: false,
        message: "No Social Profiles Found",
      });
    }
  })

  .catch(function (err) {
    console.log("Failed To Get Social Profiles For Admin: ", err);
    res.json({
      successful: false,
      message: "Failed To Get Social Profiles For Admin: " + err,
    });
  });
});

//Update Admin Social Profile
router.post("/Update_AdminSocialProfile", async (req, res, next) => {
  console.log("Update Admin Social Profile API Calling", req.body.data);
  values = [
    {
      id: req.body.data.id,
      admin_id: req.body.data.admin_id,
      social_profile_id: req.body.data.social_profile_id,
      url: req.body.data.url,
      description: req.body.data.description,
      updated_at: new Date().toISOString(),
    },
  ];
  await models.social_profiles
    .update(
      {
        candidate_id: values[0].candidate_id,
        social_profile_id: values[0].social_profile_id,
        url: values[0].url,
        description: values[0].description,
        updated_at: values[0].updated_at,
      },
      {
        where: {
          id: values[0].id,
          candidate_id: values[0].candidate_id,
        },
        returning: true,
        exclude: ["created_at", "updated_at"],
      }
    )
    .then((data) => {
      const val = {
        id: values[0].id,
        candidate_id: values[0].candidate_id,
        social_profile_id: values[0].social_profile_id,
        url: values[0].url,
        description: values[0].description,
      };
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "Social Profile Updated Successfully",
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

//Delete Admin Social Profile
router.get("/Delete_AdminSocialProfile/:id", (req, res, next) => {
  const { id } = req.params;

  models.social_profiles
    .destroy({
      where: {
        id: id,
      },
    })
    .then((data) => {
      if (data?.length != 0) {
        console.log("Admin Social Profile Deleted Successfully.");
        res.json({
          data: data,
          successful: true,
          message: "Admin Social Profile Deleted Successfully.",
        });
      } else {
        console.log("No Social Profile Found");
        res.json({
          successful: false,
          message: "No Social Profile Found",
        });
      }
    })
    .catch(function (err) {
      console.log("Failed To Delete Admin Social Profile: ", err);
      res.json({
        successful: false,
        message: "Failed To Delete Admin Social Profile: " + err,
      });
    });
});

//Get All Admins
router.get("/Get_AllAdmins", (req, res, next) => {
  models.admins
    .findAll({
      where: {

      },
     
      order: [["created_at", "DESC"]],
    })

    .then((data) => {
      if (data?.length != 0) {
        console.log("Get All Admins Successfully");
        res.json({
          data: data,
          successful: true,
          message: "Get All Admins Successfully",
        });
      } else {
        console.log("No Admins Found");
        res.json({
          successful: false,
          message: "No Admins Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get All Admins: ", err);
      res.json({
        successful: false,
        message: "Failed To Get All Admins: " + err,
      });
    });
});

module.exports = router;
