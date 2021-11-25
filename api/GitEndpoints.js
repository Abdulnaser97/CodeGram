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

// Get Repository Content
async function getContent(token, repo) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const files = await octokit.rest.repos.getContent({
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

  const repos = await octokit.request('GET /user/repos')
  return repos
  // octokit
  // .paginate(
  //   "'GET /user/repos'",
  //   { owner: login},
  //   (response) => response.data.map((repo) =>repo.name)
  // )
  // .then((repoNames) => {
  //   // issueTitles is now an array with the titles only
  //   console.log(repoNames)
  //   return repoNames;

  // });



}

module.exports = { getRepoNames , getPRFiles, getContent };
