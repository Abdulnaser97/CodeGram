const { getPRFiles, getContent, getRepoNames } = require("./GitEndpoints");

const repoContentController = () => {
  return async (req, res) => {
    // Check if access token exists in request

    try {
      // Call github API here
      let { authorization } = req.headers;
      if (authorization) {
        let body = req.body;
        const resp = await getContent(authorization, body.repo);
        res.status(200).json(resp);
        console.log(`repoContentController: Success`);
      }
    } catch (error) {
      console.log(`repoContentController: Error`);
      //console.log(error);
    }
  };
};

const pullRequestController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      // Check if access token exists in request
      if (authorization) {
        let body = req.body;

        // Call github API here
        const resp = await getPRFiles(authorization, body.repo, body.prNum);
        console.log(`pullRequestController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`pullRequestController: Error`);
      console.log(error);
    }
  };
};

const repoNamesController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      // Check if access token exists in request
      if (authorization) {
        // Call github API here
        const resp = await getRepoNames(authorization);
        console.log(`repoNamesController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`repoNamesController: Error`);
      console.log(error);
    }
  };
};


module.exports = {
  repoContentController,
  pullRequestController,
  repoNamesController
};
