import { 
  ERROR_NOTIFICATION, 
  SUCCESS_NOTIFICATION, 
  LOADING_NOTIFICATION 
} from "../constants";

export function successNotification(message) {
  return {
    type: SUCCESS_NOTIFICATION,
    payload: message,
  };
}

export function errorNotification(message) {
  return {
    type: ERROR_NOTIFICATION,
    payload: message,
  };
}

//Add in loading notification
export function loadingNotification(message) {
  return {
    type: LOADING_NOTIFICATION,
    payload: message,
  };
}

