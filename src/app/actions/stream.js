import axios from "misc/requests";
import {
  REQUEST_CREATE_STREAM,
  SUCCESS_CREATE_STREAM,
  REQUEST_STREAM_COUNT,
  RECEIVE_STREAM_COUNT,
} from "../constants/actionTypes";
import config from "config";

const fetchCreateStream = (songId, name) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_CREATE_STREAM });

  const streamData = {
    songId: songId,
    userId: name,
  };

  return axios
    .post(`${SONGS_SERVICE}/api/streams`, streamData, { withCredentials: true })
    .then((response) => {
      dispatch({ type: SUCCESS_CREATE_STREAM, payload: response });
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

const fetchStreamCount = (songId) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_STREAM_COUNT });

  const streamData = {
    entity1Ids: [songId],
  };

  return axios
    .post(`${SONGS_SERVICE}/api/streams/_counts`, streamData, {
      withCredentials: true,
    })
    .then((response) => {
      dispatch({
        type: RECEIVE_STREAM_COUNT,
        payload: { songId, count: response[songId] || 0 },
      });
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export default {
  fetchCreateStream,
  fetchStreamCount,
};
