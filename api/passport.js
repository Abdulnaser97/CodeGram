const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");

GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(`Your access token is: ${accessToken}`);
      console.log(`Your refresh token is: ${refreshToken}`);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
