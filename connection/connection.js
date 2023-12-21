const Sequelize = require("sequelize");

const connection = new Sequelize(
  "sokoon",
  "postgres",
  "admin",
  {
    //flux is user name of aws
    //host: "bsuxgky29gzgp8moorjg-postgresql.services.clever-cloud.com",
    host: 'localhost',
    dialect: "postgres",
    port: "5432",
    define: {
      timestamps: false, //turnoff timestapm
    },
    pool: {
      max: 3,
      min: 1,
      idle: 10000,
    },
  }
);

module.exports.connection = connection;