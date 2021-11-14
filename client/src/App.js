import "./App.css";
import { Button, Box } from "@mui/material";
import apiClient from "./api/apiClient";
import Github from "./img/github.png";
import { useEffect, useState } from "react";

function App() {
  const ac = new apiClient("none");
  const [user, setUser] = useState([]);

  function login() {
    window.open("http://localhost:8080/auth/github", "_self");
  }

  function getPR() {
    ac.getPR().then((data) => console.log(data));
  }

  function getRepo() {
    ac.getRepo().then((data) => console.log(data));
  }

  function logoff() {
    ac.logoff().then((data) => console.log(data));
  }
  function helloWorld() {
    ac.getHello().then((data) => console.log(data));
  }

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:8080/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
          console.log(user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);

  return (
    <div className="App">
      <Box padding={10}>
        <div className="loginButton github" onClick={login}>
          <img src={Github} alt="" className="icon" />
          Login with Github
        </div>
        <Button variant="outlined" onClick={() => logoff()}>
          Logoff!
        </Button>
        <Button variant="outlined" onClick={() => getPR()}>
          Get PR!
        </Button>
        <Button variant="outlined" onClick={() => getRepo()}>
          Get Repo!
        </Button>
        <Button variant="outlined" onClick={() => helloWorld()}>
          Hello
        </Button>
        <code>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </code>
      </Box>
    </div>
  );
}

export default App;
