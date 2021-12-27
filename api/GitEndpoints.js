const { Octokit } = require("octokit");

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

async function getRepoNames(token){
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const repos = await octokit.rest.repos.listForUser({
    username: login
  });
  return repos
}

async function getContent(token, repo, path){

    // return repos
    const octokit = new Octokit({ auth: token });

    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();
  
    const files = await octokit.rest.repos.getContent({
      owner: login,
      repo: repo,
      path: path
    });
    return files;

}


module.exports = { getRepoNames, getPRFiles, getContent};

