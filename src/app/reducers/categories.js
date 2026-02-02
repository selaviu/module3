import {
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
} from "../constants/actionTypes";

const initialState = {
  list: [],
  isFetching: false,
  error: null,
};

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case RECEIVE_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        list: action.payload,
        error: null,
      };

    case ERROR_CATEGORIES:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
