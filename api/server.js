const express = require("express");
const exphbs = require("express-handlebars");
const cors = require('cors');

//Github
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const crypto = require("crypto");
const passport = require("passport");
const GithubStrategy = require("passport-github").Strategy;
// import env variables
require("dotenv").config();

const {
  repoContentController,
  landingPageController,
  pullRequestController,
} = require("./Endpoints");

const app = express();
const port = process.env.PORT;
const COOKIE = process.env.PROJECT_DOMAIN;

// add cors for cross origin linking 
app.options('*', cors())

// Create a cookie which will hold the saved authenticated user
app.use(cookieParser());

// Using crypto library to create a random string of secret value for the user's session in the browser
app.use(
  expressSession({
    secret: crypto.randomBytes(64).toString("hex"),
    resave: true,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let scopes = ["notifications", "user:email", "read:org", "repo"];

// Passport is authentication middleware for any Nodejs server application
// Here, we are using passport to define our authentication strategy with the github account
// i.e. defining how we are going to authenticate with github
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/login/github/return",
      scope: scopes.join(" "),
    },
    function (token, tokenSecret, profile, cb) {
      return cb(null, { profile: profile, token: token });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
app.use(passport.initialize());
app.use(passport.session());

const hbs = exphbs.create({
  layoutsDir: __dirname + "/views",
});

app.engine("handlebars", hbs.engine);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/*************************************************************************************************/
/******************************************** Endpoints ******************************************/
/*************************************************************************************************/

// test function 
app.get('/hello', function (req, res) {
  res.send('Hello World!');
});

app.get("/", landingPageController());

app.get("/pr", pullRequestController());

app.get("/getcontent", repoContentController());

// /logoff clear the cookie from the browser session as well as redirect the user to the home or initial route
app.get("/logoff", function (req, res) {
  res.clearCookie(COOKIE);
  res.redirect("/");
});

// /auth/github to authenticate the user using passport strategy
app.get("/auth/github", passport.authenticate("github"));

// /login/github/return is the callback URL. On success, it will create the cookie with user authorization data, and on failure, it will redirect to the initial route
app.get(
  "/login/github/return",
  passport.authenticate("github", {
    successRedirect: "/setcookie",
    failureRedirect: "/",
  })
);

// /setcookie on successful auth, this route will store the user profile detail and token
app.get("/setcookie", function (req, res) {
  let data = {
    user: req.session.passport.user.profile._json,
    token: req.session.passport.user.token,
  };
  res.cookie(COOKIE, JSON.stringify(data));
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`🌏 Server is running at http://localhost:${port}`);
});
