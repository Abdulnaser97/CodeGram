const { getWelcomeMessage, getPRFiles, getContent } = require("./GitEndpoints");

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
  repoContentController,
  pullRequestController,
};
