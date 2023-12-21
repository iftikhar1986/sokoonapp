const express = require("express");
const app = express();
const Connection = require("./connection/connection");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("./middleware/auth");
const sequelize = require("sequelize");


const dotenv = require("dotenv");
//connectionsync=require('./sync/sync')

const server = require("http").createServer(app);
// const io = new Server(server, {
//   origin: {
//     cors: "*",
//   },
// });
const io = require("socket.io")(server, {
  origin: {
    cors: "*",
  },
});

// Socket
var mycount = 0;
io.on("connection", (socket) => {
  mycount++;
  console.log("connect", mycount);

  socket.on("setup", (userData) => {
    console.log("userData", userData);
    socket.join(userData);
    socket.emit("connected");
  });

  socket.on("new message", (emitId) => {
    console.log("chat.userchat.user", emitId);

    if (!emitId) return console.log("emitId not defined");
    console.log("emitId", emitId);
    io.emit("message recieved", emitId);
  });
});

const bodyParser = require("body-parser");
//convert into json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var path = require("path");
var cors = require("cors");
const corsOption = {
  origin: "*",
};

app.use(cors(corsOption)); // Use this after the variable declaration
dotenv.config();

// app.use("/", (req, res, next) => {
Connection.connection
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    server.listen(process.env.PORT || 80, () =>
      console.log(`server is listening at port ${process.env.PORT || 80}`)
    );
  })
  .catch((err) => {
    console.log("Error...", err);
    // res.redirect("/error");
  });
// });

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    errors: err.errors,
  });
});

// For heroku
app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  res.send("Server is running 🚀!");
});

app.use("/error", (req, res, next) => {
  res.send("connection not authenticated");
});

//Routes
const adminRoutes = require("./routes/admins");
const locationsRoutes = require("./routes/locations");
const adRoutes = require("./routes/ads");
const categoriesRoutes = require("./routes/categories");
const feedbacksRoutes = require("./routes/feedbacks");
const guidesRoutes = require("./routes/guides");
const newWordsRoutes = require("./routes/newWords");
const notificationsRoutes = require("./routes/notifications");
const sentencesRoutes = require("./routes/sentences");
const settingsRoutes = require("./routes/settings");
const signsRoutes = require("./routes/signs");
const storiesRoutes = require("./routes/stories");
const updateWordsRoutes = require("./routes/updateWords");
const userGuidesRoutes = require("./routes/userGuides");
const usersRoutes = require("./routes/users");
const wordsRoutes = require("./routes/words");


app.use("/admins", adminRoutes);
app.use("/locations", locationsRoutes);
app.use("/ads", adRoutes);
app.use("/categories", categoriesRoutes);
app.use("/feedbacks", feedbacksRoutes);
app.use("/guides", guidesRoutes);
app.use("/newWords", newWordsRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/sentences", sentencesRoutes);
app.use("/settings", settingsRoutes);
app.use("/signs", signsRoutes);
app.use("/stories", storiesRoutes);
app.use("/updateWords", updateWordsRoutes);
app.use("/userGuides", userGuidesRoutes);
app.use("/users", usersRoutes);
app.use("/words", wordsRoutes);