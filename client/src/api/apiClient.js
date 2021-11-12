import axios from 'axios';

const BASE_URI = 'http://localhost:8080';


const client = axios.create({
  baseURL: BASE_URI,
  json: true
});

class apiClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  getHello(){
    return this.perform('get', `/hello`); 
  }

  
  logoff() {
    return this.perform('get', `/logoff`);
  }

  githubAuth(){
    console.log('github Auth')
    return this.perform('get', `/auth/github`);
  }

  getRepo(){
    return this.perform('get', `/getcontent`); 
  }

  getPR(){
    return this.perform('get', `/getcontent`); 
  }

  async perform (method, resource, data) {
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    }).then(resp => {   
      return resp.data ? resp.data : [];
    })
  }
}

export default apiClient;