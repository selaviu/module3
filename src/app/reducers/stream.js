import {
  REQUEST_CREATE_STREAM,
  SUCCESS_CREATE_STREAM,
  ERROR_CREATE_STREAM,
  REQUEST_STREAM_COUNT,
  RECEIVE_STREAM_COUNT,
} from "../constants/actionTypes";

const initialState = {
  isCreating: false,
  isFetchingCounts: false,
  lastStream: null,
  counts: {},
  error: null,
};

const streamReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_CREATE_STREAM:
      return { ...state, isCreating: true, error: null };

    case SUCCESS_CREATE_STREAM:
      return {
        ...state,
        isCreating: false,
        lastStream: action.payload,
        error: null,
      };

    case ERROR_CREATE_STREAM:
      return { ...state, isCreating: false, error: action.payload };

    case REQUEST_STREAM_COUNT:
      return { ...state, isFetchingCounts: true };

    case RECEIVE_STREAM_COUNT:
      return {
        ...state,
        isFetchingCounts: false,
        counts: {
          ...state.counts,
          [action.payload.songId]: action.payload.count,
        },
      };

    default:
      return state;
  }
};

export default streamReducer;
