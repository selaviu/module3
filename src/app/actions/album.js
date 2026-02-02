import axios from "misc/requests";
import config from "config";
import {
  REQUEST_ALBUMS,
  RECEIVE_ALBUMS,
  ERROR_ALBUMS,
} from "../constants/actionTypes";

const fetchAlbums = () => (dispatch) => {
  const { SONGS_SERVICE } = config;

  dispatch({ type: REQUEST_ALBUMS });

  return axios
    .get(`${SONGS_SERVICE}/api/album`, { withCredentials: true })
    .then((response) => {
      dispatch({
        type: RECEIVE_ALBUMS,
        payload: response || [],
      });
      return response;
    })
    .catch((error) => {
      dispatch({ type: ERROR_ALBUMS, payload: error });

      dispatch({ type: RECEIVE_ALBUMS, payload: [] });
    });
};

export default {
  fetchAlbums,
};
