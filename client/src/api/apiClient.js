export async function perform(method, resource, data) {
  const BASE_URI = process.env.REACT_APP_BACKEND_URL;
  const accessToken = sessionStorage.getItem("access_token");
  try {
    let reqParams;
    if (method === "post" || method === "put") {
      reqParams = {
        method: method,
        credentials: "include",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      };
    } else {
      reqParams = {
        method: method,
        credentials: "include",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Authorization: `Bearer ${accessToken}`,
        },
      };
    }

    let res = await fetch(`${BASE_URI}${resource}`, reqParams);

    if (res.status !== 200) {
      throw new Error("authentication has been failed!");
    }
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function invalidateToken() {
  const result = await perform("get", `/auth/logout`);
  return result.success;
}

export async function getRepo(repo) {
  const data = {
    repo: repo,
  };
  return await perform("post", `/getcontent`, data);
}

export async function getRepos() {
  const data = {};
  return await perform("post", `/getrepos`, data);
}

export async function getPR(repo, prNum) {
  const data = {
    repo: repo,
    prNum: prNum,
  };
  return await perform("post", `/pr`, data);
}

export async function save(repo, content) {
  // const str = JSON.stringify(content); // Convert Object to a String
  // const encodedString = Buffer.from(str, "base64"); // String to base64

  const data = {
    repo: repo,
    content: content,
  };
  return await perform("put", `/save`, data);
}

export async function getUser() {
  return await perform("get", `/auth/login/success`);
}
