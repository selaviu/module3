import axios from "misc/requests";
import config from "config";
import {
  REQUEST_ARTISTS,
  RECEIVE_ARTISTS,
  ERROR_ARTISTS,
} from "../constants/actionTypes";

const fetchArtists = () => (dispatch) => {
  const { SONGS_SERVICE } = config;

  dispatch({ type: REQUEST_ARTISTS });

  return axios
    .get(`${SONGS_SERVICE}/api/artist`, { withCredentials: true })
    .then((response) => {
      dispatch({
        type: RECEIVE_ARTISTS,
        payload: response || [],
      });
      return response;
    })
    .catch((error) => {
      dispatch({ type: ERROR_ARTISTS, payload: error });

      dispatch({ type: RECEIVE_ARTISTS, payload: [] });
    });
};

export default {
  fetchArtists,
};
