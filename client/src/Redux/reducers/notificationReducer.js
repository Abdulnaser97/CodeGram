import { SUCCESS_NOTIFICATION, ERROR_NOTIFICATION, LOADING_NOTIFICATION } from "../constants";

const initialState = {
  successNotificationMessage: "",
  errorNotificationMessage: "",
  loadingNotificationMessage: "",
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
    case LOADING_NOTIFICATION:
      return {
        ...state,
        loadingNotificationMessage: action.payload,
      };  
    default:
      return state;
  }
};
