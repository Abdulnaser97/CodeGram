import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  errorNotification,
  successNotification,
  loadingNotification,
} from "../Redux/actions/notification";

export function NotifDiagramLoaded() {
  const message = useSelector((state) => {
    return state.present.notifications.successNotificationMessage;
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
  const message = useSelector((state) => {
    return state.present.notifications.loadingNotificationMessage;
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
      onClose={() => dispatch(loadingNotification(""))}
    >
      <Alert onClose={() => dispatch(loadingNotification(""))}>{message}</Alert>
    </Snackbar>
  );
}

export function NotifError() {
  const message = useSelector((state) => {
    return state.present.notifications.errorNotificationMessage;
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
