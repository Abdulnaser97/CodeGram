const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");

// import env variables
require("dotenv").config();

//Github
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

const {
  repoContentController,
  pullRequestController,
  repoNamesController,
  saveCodeGramFileController,
  repoBranchesController,
  retrieveCheckRunController,
  publicRepoContentController,
  getFileSHAController,
} = require("./Endpoints");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

var whitelist = [
  CLIENT_URL,
  "http://localhost:3001",
  "https://api.code-gram.com",
  "https://code-gram.com",
  "https://www.code-gram.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Origin is", origin);
        callback(null, true);
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

/*************************************************************************************************/
/******************************************** Endpoints ******************************************/
/*************************************************************************************************/

app.post("/pr", pullRequestController());

app.post("/getcontent", repoContentController());

app.post("/getrepos", repoNamesController());

app.post("/getbranches", repoBranchesController());

app.post("/getcheckrun", retrieveCheckRunController());

app.post("/getpubliccontent", publicRepoContentController());

app.post("/getfilesha", getFileSHAController());

app.put("/save", saveCodeGramFileController());

// /auth/github to authenticate the user using passport strategy
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🌏 Server is running at http://localhost:${port}`);
});
