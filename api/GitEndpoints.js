const { Octokit } = require("octokit");
const { Base64 } = require("js-base64");

// Get PR info
async function getPRFiles(token, repo, pullNumber) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  // owner: "octocat", repo: "hello-world", pull_number: 1942,
  try {
    const files = await octokit.rest.pulls.listFiles({
      owner: "octocat",
      repo: repo,
      pull_number: pullNumber,
    });
    return files;
  } catch (e) {
    console.log(e);
  }
}

// Fetch the data from the API and stores them in 'data' object
async function downloadZipArchive(token, repo) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.downloadZipballArchive({
    owner: login,
    repo: repo,
  });
  return files;
}

async function getRepoNames(token) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const repos = await octokit.request("GET /user/repos");
  return repos;
}

async function getContent(token, repo, branch, path) {
  // return repos
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.getContent({
    owner: login,
    repo: repo,
    path: path,
    ref: branch ? branch : null 
  });
  return files;
}

async function getRepoBranches(token, repo) {
  // return repos
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.listBranches({
    owner: login,
    repo: repo,
  });

  return files;
}


async function saveFileToRepo(token, repo, branch, content) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const contentEncoded = Base64.encode(JSON.stringify(content));
  let params = {
    owner: login,
    repo: repo,
    path: "Diagram1.CodeGram",
    message: "CodeGram: Save",
    branch: branch, 
    content: contentEncoded,
  };

  const files = await octokit.rest.repos.getContent({
    owner: login,
    repo: repo,
    ref: branch 
  });

  files.data.forEach((file) => {
    if (file.name.includes(".CodeGram")) {
      params["sha"] = file.sha;
    }
  });

  const result = await octokit.rest.repos.createOrUpdateFileContents(params);

  return result;
}
module.exports = { getRepoBranches, getRepoNames, getPRFiles, getContent, saveFileToRepo };
