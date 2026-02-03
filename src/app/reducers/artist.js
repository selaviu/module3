import {
  REQUEST_ARTISTS,
  RECEIVE_ARTISTS,
  ERROR_ARTISTS,
} from "../constants/actionTypes";

const initialState = { list: [], isFetching: false, error: null };

export default function artistsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ARTISTS:
      return { ...state, isFetching: true };
    case RECEIVE_ARTISTS:
      return { ...state, isFetching: false, list: action.payload };
    case ERROR_ARTISTS:
      return { ...state, isFetching: false, error: action.payload };
    default:
      return state;
  }
}
