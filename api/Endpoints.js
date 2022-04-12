const {
  getPRFiles,
  getContent,
  getRepoNames,
  saveFileToRepo,
  getRepoBranches,
  retrieveCheckRunRun,
  getPublicContent,
  getFileSHA,
} = require("./GitEndpoints");

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

const publicRepoContentController = () => {
  return async (req, res) => {
    try {
      console.log("public");

      // Call github API here
      let body = req.body;
      const resp = await getPublicContent(body.url);
      console.log(`publicRepoContentController: Success`);
      res.status(200).json(resp);
    } catch (error) {
      console.log(`PublicRepoController: Error`);
      console.log(error);
    }
  };
};

const getFileSHAController = () => {
  return async (req, res) => {
    try {
      // Call github API here
      let body = req.body;
      const resp = await getFileSHA(body.url);
      console.log(`getFileSHAController: Success`);
      res.status(200).json(resp);
    } catch (error) {
      console.log(`getFileSHAController: Error`);
      console.log(error);
    }
  };
};

const repoContentController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      // Check if access token exists in request
      if (authorization) {
        // Call github API here
        let body = req.body;
        const resp = await getContent(
          authorization,
          body.repo,
          body.branch,
          body.path,
          body.owner
        );
        console.log(`fullRepoController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`fullRepoController: Error`);
      console.log(error);
    }
  };
};

const repoBranchesController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      // Check if access token exists in request
      if (authorization) {
        // Call github API here
        let body = req.body;

        const resp = await getRepoBranches(
          authorization,
          body.repo,
          body.owner
        );

        console.log(`repoBranchesController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`repoBranchesController: Error`);
      console.log(error);
    }
  };
};

const saveCodeGramFileController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      let body = req.body;
      // Check if access token exists in request
      if (authorization) {
        // Call github API here
        const resp = await saveFileToRepo(
          authorization,
          body.repo,
          body.branch,
          body.content
        );
        console.log(`saveCodeGramFileController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`saveCodeGramFileController: Error`);
      console.log(error);
    }
  };
};

const retrieveCheckRunController = () => {
  return async (req, res) => {
    try {
      let { authorization } = req.headers;
      let body = req.body;
      // Check if access token exists in request
      if (authorization) {
        // Call github API here
        const resp = await retrieveCheckRunRun(
          authorization,
          body.repo,
          body.sha
        );
        console.log(`retrieveCheckRunController: Success`);
        res.status(200).json(resp);
      }
    } catch (error) {
      console.log(`retrieveCheckRunController: Error`);
      console.log(error);
    }
  };
};

module.exports = {
  repoContentController,
  pullRequestController,
  repoNamesController,
  saveCodeGramFileController,
  repoBranchesController,
  retrieveCheckRunController,
  publicRepoContentController,
  getFileSHAController,
};
