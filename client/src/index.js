import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";

import { configureStore } from "./Redux/configureStore";

import { App } from "./App";
import { ReactFlowProvider } from "./react-flow-renderer/dist/nocss/additional-components/ReactFlowProvider/index.d.ts";

const store = configureStore();

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactFlowProvider>
        <App />
      </ReactFlowProvider>
    </Provider>
  </React.StrictMode>,
  rootElement
);
