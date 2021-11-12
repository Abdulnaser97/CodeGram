const _ = require("underscore");

const { getWelcomeMessage, getPRFiles, getContent } = require("./GitEndpoints");

const COOKIE = process.env.PROJECT_DOMAIN;

const landingPageController = () => {
  return async (req, res) => {
    let data = {
      session: req.cookies[COOKIE] && JSON.parse(req.cookies[COOKIE]),
    };

    let githubData;
    // Check if session exists in browser
    if (data.session && data.session.token) {
      try {
        // Call github API here
        githubData = await getWelcomeMessage(data.session.token);
      } catch (error) {
        githubData = { error: error };
      }

      // Using the _ underscore library to create
      // a shallow copy of the github api response
      _.extend(data, githubData);
    } else if (data.session) {
      data.session.token = "mildly obfuscated.";
    }

    let token = data.session ? data.session.token : "Signed out";
    data.json = JSON.stringify(data, null, 2);

    return res.render("main", {
      username: githubData,
      token: token,
    });
  };
};

const repoContentController = () => {
  return async (req, res) => {
    let session = req.cookies[COOKIE] && JSON.parse(req.cookies[COOKIE]);

    // Check if session exists in browser
    if (session && session.token) {
      try {
        let resp;
        // Call github API here
        resp = await getContent(session.token);
        resp = await JSON.stringify(resp, undefined, 2);

        return res.render("main", {
          content: resp,
          token: session.token,
        });
      } catch (error) {
        return res.render("main", {
          error: error,
          token: session.token,
        });
      }
    }
  };
};

const pullRequestController = () => {
  return async (req, res) => {
    let session = req.cookies[COOKIE] && JSON.parse(req.cookies[COOKIE]);

    // Check if session exists in browser
    if (session && session.token) {
      try {
        let resp;
        // Call github API here
        resp = await getPRFiles(session.token);
        resp = await JSON.stringify(resp, undefined, 2);

        return res.render("main", {
          pr: resp,
          token: session.token,
        });
      } catch (error) {
        return res.render("main", {
          error: error,
          token: session.token,
        });
      }
    }
  };
};

module.exports = {
  landingPageController,
  repoContentController,
  pullRequestController,
};
