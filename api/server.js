const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");

// import env variables
require("dotenv").config();

//Github
const passport = require("passport");
const passportSetup = require("./passport");
const authRoute = require("./routes/auth");

const { repoContentController, pullRequestController } = require("./Endpoints");

const app = express();
const port = process.env.PORT;

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
/*************************************************************************************************/
/******************************************** Endpoints ******************************************/
/*************************************************************************************************/

// test function
app.get("/hello", function (req, res) {
  res.send("Hello World!");
});

app.get("/pr", pullRequestController());

app.get("/getcontent", repoContentController());

// /auth/github to authenticate the user using passport strategy
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🌏 Server is running at http://localhost:${port}`);
});
