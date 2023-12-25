const Sequelize = require("sequelize");
var db = require("../connection/connection");

const admins = db.connection.define("admins", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  f_name: Sequelize.STRING(50),
  l_name: Sequelize.STRING(50),
  dob: Sequelize.DATEONLY,
  gender: Sequelize.INTEGER,
  pic: Sequelize.STRING(100),
  phone: Sequelize.STRING(50),
  email: Sequelize.STRING(100),
  password: Sequelize.STRING(50),
  city_id: Sequelize.INTEGER,
  state_id: Sequelize.INTEGER,
  country_id: Sequelize.INTEGER,
  is_login: Sequelize.BOOLEAN,
  last_login: Sequelize.DATE,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const cities = db.connection.define("cities", {
  name: Sequelize.STRING(255),
  state_id: Sequelize.INTEGER,
});

const states = db.connection.define("states", {
  name: Sequelize.STRING(255),
  country_id: Sequelize.INTEGER,
});

const countries = db.connection.define("countries", {
  name: Sequelize.STRING(255),
  phonecode: Sequelize.STRING(255),
  sortname: Sequelize.STRING(255),
});

const social_profiles = db.connection.define("social_profiles", {
  admin_id: Sequelize.INTEGER,
  social_profile_id: Sequelize.INTEGER,
  url: Sequelize.STRING(255),
  description: Sequelize.STRING(255),
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const ads = db.connection.define("ads", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  url: Sequelize.STRING(100),
  time: Sequelize.DATE,
  image: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

// const catArAZs = db.connection.define("catArAZs", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//   cat: Sequelize.STRING,
//   is_active: Sequelize.BOOLEAN,
//   created_at: Sequelize.DATE,
//   updated_at: Sequelize.DATE,
// });

// const catAZs = db.connection.define("catAZs", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//   cat: Sequelize.STRING,
//   is_active: Sequelize.BOOLEAN,
//   created_at: Sequelize.DATE,
//   updated_at: Sequelize.DATE,
// });

const categories = db.connection.define("categories", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  categorieEn: Sequelize.STRING,
  categorieFr: Sequelize.STRING,
  categorieAr: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const feedbacks = db.connection.define("feedbacks", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  feedback: Sequelize.STRING,
  reference: Sequelize.STRING,
  string: Sequelize.STRING,
  provided: Sequelize.STRING,
  isRead: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const guides = db.connection.define("guides", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  pdfUrlAr: Sequelize.STRING,
  pdfUrlEn: Sequelize.STRING,
  imageEn: Sequelize.STRING,
  imageAr: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const newWords = db.connection.define("newWords", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  timer: Sequelize.STRING,
  isRead: Sequelize.BOOLEAN,
  word: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const notifications = db.connection.define("notifications", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  idWord: Sequelize.STRING,
  messageAr: Sequelize.STRING,
  isRead: Sequelize.BOOLEAN,
  messageEn: Sequelize.STRING,
  title: Sequelize.STRING,
  body: Sequelize.STRING,
  isWord: Sequelize.BOOLEAN,
  time: Sequelize.STRING,
  messageFr: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const sentences = db.connection.define("sentences", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  catAZAr: Sequelize.STRING,
  idWord: Sequelize.STRING,
  arabic: Sequelize.STRING,
  english: Sequelize.STRING,
  catAZEn: Sequelize.STRING,
  catAZFr: Sequelize.STRING,
  video: Sequelize.STRING,
  french: Sequelize.STRING,
  videoUrl: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

// const sentences2 = db.connection.define("sentences2", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//   catAZAr: Sequelize.STRING,
//   idWord: Sequelize.STRING,
//   arabic: Sequelize.STRING,
//   english: Sequelize.STRING,
//   catAZEn: Sequelize.STRING,
//   catAZFr: Sequelize.STRING,
//   video: Sequelize.STRING,
//   french: Sequelize.STRING,
//   is_active: Sequelize.BOOLEAN,
//   created_at: Sequelize.DATE,
//   updated_at: Sequelize.DATE,
// });

// const sentences3 = db.connection.define("sentences3", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//   catAZAr: Sequelize.STRING,
//   idWord: Sequelize.STRING,
//   arabic: Sequelize.STRING,
//   english: Sequelize.STRING,
//   catAZEn: Sequelize.STRING,
//   catAZFr: Sequelize.STRING,
//   video: Sequelize.STRING,
//   french: Sequelize.STRING,
//   videoUrl: Sequelize.STRING,
//   videoUrlMobile: Sequelize.STRING,
//   thumbnail: Sequelize.STRING,
//   is_active: Sequelize.BOOLEAN,
//   created_at: Sequelize.DATE,
//   updated_at: Sequelize.DATE,
// });


const settings = db.connection.define("sokoonDescription", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  titleFr: Sequelize.STRING,
  titleAr: Sequelize.STRING,
  titleEn: Sequelize.STRING,
  descriptionFr: Sequelize.STRING,
  descriptionEn: Sequelize.STRING,
  descriptionAr: Sequelize.STRING,
  updated_at: Sequelize.DATE,
});

const signs = db.connection.define("signs", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  namespace: Sequelize.STRING,
  app: Sequelize.STRING,
  path: Sequelize.STRING,
  kind: Sequelize.STRING,
  name: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const stories = db.connection.define("stories", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  titleFr: Sequelize.STRING,
  titleEn: Sequelize.STRING,
  type: Sequelize.STRING,
  titleAr: Sequelize.STRING,
  url: Sequelize.STRING,
  thumbnail: Sequelize.STRING,
  nbreOfView: Sequelize.INTEGER,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

// const storiesOrders = db.connection.define("storiesOrders", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.STRING,
//   },
//   titleFr: Sequelize.STRING,
//   titleEn: Sequelize.STRING,
//   titleAr: Sequelize.STRING,
//   orderBy: Sequelize.STRING,
//   is_active: Sequelize.BOOLEAN,
//   created_at: Sequelize.DATE,
//   updated_at: Sequelize.DATE,
// });

const updateWords = db.connection.define("updateWords", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.STRING,
  },
  lastid: Sequelize.INTEGER,
  value: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const userGuides = db.connection.define("userGuides", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  language: Sequelize.STRING,
  title: Sequelize.STRING,
  picture: Sequelize.STRING,
  description: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const users = db.connection.define("users", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.STRING,
  },
  lastLogin: Sequelize.STRING,
  countryISOCode: Sequelize.STRING,
  isAdmin: Sequelize.BOOLEAN,
  token: Sequelize.STRING,
  emailVerified: Sequelize.BOOLEAN,
  photoURL: Sequelize.STRING,
  uid: Sequelize.STRING,
  phone: Sequelize.STRING,
  countryCode: Sequelize.STRING,
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const words = db.connection.define("words", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
    catAZAr : Sequelize.STRING,
    idWord : Sequelize.STRING,
    arabic : Sequelize.STRING,
    english : Sequelize.STRING,
    catAZEn : Sequelize.STRING,
    catAZFr : Sequelize.STRING,
    video : Sequelize.STRING,
    categories: Sequelize.JSON,
    french : Sequelize.STRING,
    videoUrl : Sequelize.STRING,
    thumbnail : Sequelize.STRING,
    is_active: Sequelize.BOOLEAN,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
});

// const words2 = db.connection.define("words2", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//     catAZAr : Sequelize.STRING,
//     idWord : Sequelize.STRING,
//     arabic : Sequelize.STRING,
//     english : Sequelize.STRING,
//     catAZEn : Sequelize.STRING,
//     catAZFr : Sequelize.STRING,
//     video : Sequelize.STRING,
//     categories: Sequelize.JSON,
//     french : Sequelize.STRING,
//     is_active: Sequelize.BOOLEAN,
//     created_at: Sequelize.DATE,
//     updated_at: Sequelize.DATE,
// });

// const words3 = db.connection.define("words3", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: Sequelize.INTEGER,
//   },
//     catAZAr : Sequelize.STRING,
//     idWord : Sequelize.STRING,
//     arabic : Sequelize.STRING,
//     english : Sequelize.STRING,
//     catAZEn : Sequelize.STRING,
//     catAZFr : Sequelize.STRING,
//     video : Sequelize.STRING,
//     categories: Sequelize.JSON,
//     french : Sequelize.STRING,
//     videoUrl : Sequelize.STRING,
//     videoUrlMobile : Sequelize.STRING,
//     thumbnail : Sequelize.STRING,
//     is_active: Sequelize.BOOLEAN,
//     created_at: Sequelize.DATE,
//     updated_at: Sequelize.DATE,
// });

cities.hasMany(admins, {
  foreignKey: {
    fieldName: "city_id",
  },
});
states.hasMany(admins, {
  foreignKey: {
    fieldName: "state_id",
  },
});
countries.hasMany(admins, {
  foreignKey: {
    fieldName: "country_id",
  },
});

countries.hasMany(states, {
  foreignKey: {
    fieldName: "country_id",
  },
});
states.hasMany(cities, {
  foreignKey: {
    fieldName: "state_id",
  },
});

admins.hasMany(social_profiles, {
  foreignKey: {
    fieldName: "candidate_id",
  },
});


admins.belongsTo(countries, { foreignKey: "country_id" });
admins.belongsTo(cities, { foreignKey: "city_id" });
admins.belongsTo(states, { foreignKey: "state_id" });

cities.belongsTo(states, { foreignKey: "state_id" });
states.belongsTo(countries, { foreignKey: "country_id" });

social_profiles.belongsTo(admins, { foreignKey: "admin_id" });


//Exports Modules
module.exports.admins = admins;
module.exports.cities = cities;
module.exports.states = states;
module.exports.countries = countries;
module.exports.social_profiles = social_profiles;
module.exports.ads = ads;
// module.exports.catArAZs = catArAZs;
// module.exports.catAZs = catAZs;
module.exports.categories = categories;
module.exports.guides = guides;
module.exports.newWords = newWords;
module.exports.notifications = notifications;
module.exports.feedbacks = feedbacks;
module.exports.sentences = sentences;
// module.exports.sentences2 = sentences2;
// module.exports.sentences3 = sentences3;
module.exports.settings = settings;
module.exports.signs = signs;
module.exports.stories = stories;
// module.exports.storiesOrders = storiesOrders;
module.exports.updateWords = updateWords;
module.exports.userGuides = userGuides;
module.exports.users = users;
module.exports.words = words;
// module.exports.words2 = words2;
// module.exports.words3 = words3;