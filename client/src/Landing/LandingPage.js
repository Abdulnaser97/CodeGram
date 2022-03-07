import "../App.css";
import "./LandingPage.css";

// asset imports
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../Themes";
import GitHub from "./GitHub";
import Background from "./Background";
import Logo from "./Logo";
import MailchimpSubscribe from "react-mailchimp-subscribe";

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const REACT_APP_MC_URL = process.env.REACT_APP_MC_URL;

// api call import
function login() {
  window.location.assign(`${REACT_APP_BACKEND_URL}/auth/github`);
}

// a basic form
const CustomForm = ({ status, message, onValidated }) => {
  let email;
  const submit = () =>
    email &&
    email.value.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email.value,
    });

  return (
    <div className="SubscribeWrapper">
      {status === "sending" && (
        <div className="SubscribeMessage">sending...</div>
      )}
      {status === "error" && (
        <div
          className="SubscribeMessage"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          className="SubscribeMessage"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <div style={{ display: "inline-flex" }}>
        <input
          className="EmailInput"
          ref={(node) => (email = node)}
          type="email"
          placeholder="Sign up for our beta release"
        />
        <br />
        <button class="SubmitButton" onClick={submit}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="LandingPage">
        <div className="LogoDiv background">
          <Background className="Background" />
        </div>
        <div className="LogoDiv">
          <Logo className="Logo" />
        </div>
        <h1 className="CodeGram">CodeGram</h1>
        <MailchimpSubscribe
          url={REACT_APP_MC_URL}
          render={({ subscribe, status, message }) => (
            <CustomForm
              status={status}
              message={message}
              onValidated={(formData) => subscribe(formData)}
            />
          )}
        />
        <div className="GitHubButtonWrapper" onClick={login}>
          <GitHub className="GitHub" />
        </div>
      </div>
    </ThemeProvider>
  );
}
