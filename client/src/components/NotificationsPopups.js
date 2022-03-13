import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  errorNotification,
  successNotification,
  loadingNotification,
} from "../Redux/actions/notification";

export function NotifDiagramLoaded() {
  const message = useSelector((state) => {
    return state.notifications.successNotificationMessage;
  });
  const dispatch = useDispatch();

  return (
    <Snackbar
      style={{
        position: "fixed",
        "max-height": "fit-content",
        "min-width": "15vw",
        top: "5vh",
        left: "35vw",
      }}
      open={message}
      autoHideDuration={4000}
      onClose={() => dispatch(successNotification(""))}
    >
      <Alert onClose={() => dispatch(successNotification(""))}>{message}</Alert>
    </Snackbar>
  );
}

export function NotifDiagramLoading() {
  const { loadingMessage, reloadDiagram } = useSelector((state) => {
    return {
      loadingMessage: state.notifications.loadingNotificationMessage,
      reloadDiagram: state.RFState.reloadDiagram,
    };
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loadingMessage) {
      setOpen(true);
    }
  }, [loadingMessage]);

  useEffect(() => {
    if (!reloadDiagram) {
      setOpen(false);
      dispatch(loadingNotification(""));
    }
  }, [reloadDiagram]);

  const dispatch = useDispatch();

  return (
    <Snackbar
      style={{
        position: "fixed",
        "max-height": "fit-content",
        "min-width": "15vw",
        top: "5vh",
        left: "35vw",
      }}
      open={open}
      onClose={() => dispatch(loadingNotification(""))}
    >
      <Alert severity="info" onClose={() => dispatch(loadingNotification(""))}>
        {loadingMessage}
      </Alert>
    </Snackbar>
  );
}

export function NotifError() {
  const message = useSelector((state) => {
    return state.notifications.errorNotificationMessage;
  });
  const dispatch = useDispatch();

  return (
    <Snackbar
      style={{
        position: "fixed",
        "max-height": "fit-content",
        "min-width": "15vw",
        top: "5vh",
        left: "35vw",
      }}
      open={message}
      autoHideDuration={4000}
      onClose={() => dispatch(errorNotification(""))}
    >
      <Alert onClose={() => dispatch(errorNotification(""))} severity="error">
        {message}
      </Alert>
    </Snackbar>
  );
}
