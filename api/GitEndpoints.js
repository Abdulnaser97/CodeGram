const { Octokit } = require("octokit");
const { Base64 } = require("js-base64");
const { App } = require("@octokit/app");

const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
});

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
// https://github.com/Abdulnaser97/CodeGram

async function recursiveRepoBuilder(
  octokit,
  login,
  repoName,
  subRepo,
  subProcessedFiles
  // branch
) {
  for (const file of subRepo) {
    if (file.type === "dir") {
      const contents = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: login,
          repo: repoName,
          path: file.path,
          // ref: branch ? branch : null,
        }
      );

      await recursiveRepoBuilder(
        octokit,
        login,
        repoName,
        contents.data,
        subProcessedFiles

        // branch
      );
      subProcessedFiles[file.path] = {
        name: file.name,
        contents: contents.data,
        type: file.type,
        path: file.path,
        url: file.download_url,
        linked: false,
      };
    } else {
      subProcessedFiles[file.path] = {
        name: file.name,
        type: file.type,
        path: file.path,
        url: file.download_url,
        linked: false,
      };
    }
  }
  return subProcessedFiles;
}

async function getPublicContent(url) {
  var splitUrl = url.split("/");
  var repo = splitUrl.pop();
  var username = splitUrl.pop();
  console.log("-------------------- getPublicContent ----------------------");
  console.log(splitUrl);
  console.log(username);
  console.log(repo);
  const login = username;

  var path = null;
  var branch = null;
  let octokits = [];

  await app.eachInstallation(({ octokit, installation }) =>
    octokits.push(octokit)
  );
  console.log();
  const files = await octokits[0].request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: login,
      repo: repo,
      path: path ? path : null,
      // ref: branch ? branch : null,
    }
  );

  return recursiveRepoBuilder(octokits[0], login, repo, files.data, {});
}

async function getContent(token, repo, branch, path, owner) {
  // return repos
  let octokit = new Octokit({ auth: token });

  let userAuth;
  if (owner && owner !== "sameUser") {
    octokit = app.octokit;
    userAuth = await octokit.rest.users.getByUsername({
      owner,
    });
  } else {
    userAuth = await octokit.rest.users.getAuthenticated();
  }

  const files = await octokit.rest.repos.getContent({
    owner: userAuth.data.login,
    repo: repo,
    path: path,
    ref: branch ? branch : null,
  });
  return files;
}

async function getRepoBranches(token, repo, owner) {
  // return repos
  let octokit = new Octokit({ auth: token });

  let userAuth;
  if (owner && owner !== "sameUser") {
    octokit = app.octokit;
    userAuth = await octokit.rest.users.getByUsername({
      owner,
    });
  } else {
    userAuth = await octokit.rest.users.getAuthenticated();
  }
  const files = await octokit.rest.repos.listBranches({
    owner: userAuth.data.login,
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
    ref: branch,
  });

  files.data.forEach((file) => {
    if (file.name.includes(".CodeGram")) {
      params["sha"] = file.sha;
    }
  });

  const result = await octokit.rest.repos.createOrUpdateFileContents(params);

  return result;
}

async function getFileSHA(url) {
  var splitUrl = url.split("/");
  var path = splitUrl.pop();
  var sha = splitUrl.pop(); // branch name
  var repo = splitUrl.pop();
  var username = splitUrl.pop();
  const login = username;

  let octokits = [];

  await app.eachInstallation(({ octokit, installation }) =>
    octokits.push(octokit)
  );
  const fileCommits = await octokits[0].request(
    "GET /repos/{owner}/{repo}/commits?path={path}&sha={sha}",
    {
      owner: login,
      repo: repo,
      path: path ? path : null,
      sha: sha ? sha : null,
    }
  );

  return fileCommits.data[0];
}

async function retrieveCheckRunRun(token, repo, sha) {
  const octokit = new Octokit({ auth: token });

  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();

  const checks = await octokit.rest.checks.listForRef({
    owner: login,
    repo: repo,
    ref: sha,
  });

  return checks;
}
module.exports = {
  getRepoBranches,
  getRepoNames,
  getPRFiles,
  getContent,
  getPublicContent,
  saveFileToRepo,
  retrieveCheckRunRun,
  getFileSHA,
};
