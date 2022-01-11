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
      profile["access_token"] = accessToken;
      done(null, profile);
      return accessToken;
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, {
    id: user.id,
    access_token: user.access_token,
    login: user.login,
    username: user.username,
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
