import axios from "misc/requests";
import config from "config";
import {
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  ERROR_CATEGORIES,
} from "../constants/actionTypes";

const fetchCategories = () => (dispatch) => {
  const { SONGS_SERVICE } = config;

  dispatch({ type: REQUEST_CATEGORIES });

  return axios
    .get(`${SONGS_SERVICE}/api/genre`, { withCredentials: true })
    .then((response) => {
      dispatch({
        type: RECEIVE_CATEGORIES,
        payload: response || [],
      });
      return response;
    })
    .catch((error) => {
      dispatch({ type: ERROR_CATEGORIES, payload: error });

      dispatch({ type: RECEIVE_CATEGORIES, payload: [] });
    });
};

export default {
  fetchCategories,
};
