import { 
  REQUEST_ALBUMS, 
  RECEIVE_ALBUMS, 
  ERROR_ALBUMS 
} from '../constants/actionTypes';

const initialState = {
  list: [],
  isFetching: false,
  error: null
};

export default function albumsReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ALBUMS:
      return { ...state, isFetching: true };
    case RECEIVE_ALBUMS:
      return { ...state, isFetching: false, list: action.payload };
    case ERROR_ALBUMS:
      return { ...state, isFetching: false, error: action.payload };
    default:
      return state;
  }
}