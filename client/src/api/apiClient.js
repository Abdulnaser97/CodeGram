import axios from "axios";

const BASE_URI = "http://localhost:8080";

const client = axios.create({
  baseURL: BASE_URI,
  json: true,
});

class apiClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  getHello() {
    return this.perform("get", `/hello`);
  }

  logoff() {
    return this.perform("get", `/logoff`);
  }

  githubAuth() {
    console.log("github Auth");
    return this.perform(
      "get",
      `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Flogin%2Fgithub%2Freturn&scope=notifications%20user%3Aemail%20read%3Aorg%20repo&client_id=882414159e94387ed4ae`
    );
  }

  getRepo() {
    return this.perform("get", `/getcontent`);
  }

  getPR() {
    return this.perform("get", `/getcontent`);
  }

  async perform(method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then((resp) => {
      return resp.data ? resp.data : [];
    });
  }
}

export default apiClient;
