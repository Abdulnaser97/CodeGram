import { SUCCESS_NOTIFICATION, ERROR_NOTIFICATION } from "../constants";

const initialState = {
  successNotificationMessage: "",
  errorNotificationMessage: "",
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_NOTIFICATION:
      return {
        ...state,
        successNotificationMessage: action.payload,
      };
    case ERROR_NOTIFICATION:
      return {
        ...state,
        errorNotificationMessage: action.payload,
      };
    default:
      return state;
  }
};
