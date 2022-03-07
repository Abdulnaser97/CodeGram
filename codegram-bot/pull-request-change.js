const { Base64 } = require("js-base64");

async function handlePullRequestChange(context) {
  const pr = context.payload.pull_request;
  if (!pr || pr.state !== "open") return;
  const org = pr.base.repo.owner.login;
  const repo = pr.base.repo.name;
  const sourceBrance = pr.head.ref;

  const files = await context.octokit.rest.pulls.listFiles({
    pull_number: pr.number,
    owner: org,
    repo: repo,
  });
  let feedback = { files: [], lines: [] };

  for (const file of files.data) {
    const addedlines = file.patch.match(/(\n\+)+\s*[^\d\+](.*)/g);

    // append file name to feedback
    feedback.files.push(file.filename);
    if (addedlines) {
      for (const line of addedlines) {
        feedback.lines.push({ file: file.filename, code: line });
      }
    }
  }

  let diagram = await context.octokit.rest.repos.getContent({
    owner: org,
    repo: repo,
    ref: sourceBrance,
    path: "Diagram1.CodeGram",
  });

  if (diagram && diagram.data && diagram.data.content) {
    diagram = await Base64.decode(diagram.data.content);
    diagram = await JSON.parse(diagram);

    let prFiles = new Set(feedback.files);
    diagram.elements.forEach((element) => {
      if (element.type && element.type === "FileNode") {
        let path = element.data.path;

        if (prFiles.has(path)) {
          prFiles.delete(path);
        }
      }
    });

    feedback.files = Array.from(prFiles);
    console.log(`Found diagram for ${org}/${repo}#${sourceBrance}`);
  }

  const action_required = feedback.files.length > 0;
  const conclusion = action_required ? "action_required" : "success";
  const title = action_required
    ? feedback.files.length + " files need update on CodeGram"
    : "No issues found";
  let summary = "";
  if (action_required) {
    summary += "### " + "The following files need update on CodeGram" + "\n";
    for (const issue of feedback.files) {
      summary += "**File:** " + issue + "\n";
    }

    summary +=
      "\n\n ## [Click Here to Update Diagram](" +
      `http://localhost:3001?pr=${pr.number}&repo=${repo}&branch=${sourceBrance}&sha=${pr.head.sha}` +
      ")";
  }

  return context.octokit.rest.checks.create({
    owner: org,
    repo: repo,
    name: "CodeGram Scanner",
    head_sha: pr.head.sha,
    status: "completed",
    conclusion: conclusion,
    completed_at: new Date().toISOString(),
    output: {
      title: title,
      summary: summary,
    },
  });
}

module.exports = handlePullRequestChange;
