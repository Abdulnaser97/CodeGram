import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../constants";

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
