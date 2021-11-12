const { Octokit } = require("octokit");

// Fetch the data from the API and stores them in 'data' object
async function getWelcomeMessage(token) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  return `Hello ${login}`;
}

// Get PR info
async function getPRFiles(token) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.pulls.listFiles({
    owner: login,
    repo: "portfolio",
    pull_number: 4,
  });

  return files;
}

// Fetch the data from the API and stores them in 'data' object
async function downloadZipArchive(token) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.downloadZipballArchive({
    owner: login,
    repo: "portfolio",
  });
  return files;
}

// Get Repository Content
async function getContent(token) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.getContent({
    owner: login,
    repo: "AutoBook",
  });
  return files;
}

module.exports = { getWelcomeMessage, getPRFiles, getContent };
