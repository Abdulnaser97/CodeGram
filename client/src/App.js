import "./App.css";
import { Button, Box } from "@mui/material";
import Github from "./img/github.png";
import { useEffect, useState } from "react";
import { invalidateToken, getRepo, getPR, getUser } from "./api/apiClient";

function App() {
  const [user, setUser] = useState([]);
  const [content, setContent] = useState([]);

  function login() {
    window.open("http://localhost:8080/auth/github", "_self");
  }

  const getRepoContent = async () => {
    const repoContent = await getRepo("AutoBook");
    setContent(repoContent);
  };

  const getPRContent = async () => {
    const PRContent = await getPR("hello-world", 1942);
    setContent(PRContent);
  };

  const logout = async () => {
    await invalidateToken();
    sessionStorage.clear();
    window.location.assign("/");
  };

  // Retrieves user details once authenticated
  useEffect(() => {
    getUser().then((userDetails) => {
      setUser(userDetails.user);
    });
  }, []);

  // Stores Access token in session storage, Not very secure, but good for now
  useEffect(() => {
    if (user.length !== 0) {
      sessionStorage.setItem("access_token", user.access_token);
    }
  }, [user]);

  return (
    <div className="App">
      <Box padding={10}>
        <div className="loginButton github" onClick={login}>
          <img src={Github} alt="" className="icon" />
          Login with Github
        </div>
        <Button variant="outlined" onClick={() => logout()}>
          Logoff!
        </Button>
        <Button variant="outlined" onClick={() => getPRContent()}>
          Get PR!
        </Button>
        <Button variant="outlined" onClick={() => getRepoContent()}>
          Get Repo!
        </Button>
        <code>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </code>

        <code>
          <pre>{JSON.stringify(content, null, 2)}</pre>
        </code>
      </Box>
    </div>
  );
}

export default App;
