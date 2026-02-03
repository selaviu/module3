import axios from "misc/requests";
import config from "config";
import {
  REQUEST_SONGS,
  RECEIVE_SONGS,
  REQUEST_DELETE_SONG,
  SUCCESS_DELETE_SONG,
  SUCCESS_SAVE_SONG,
  REQUEST_SAVE_SONG,
  REQUEST_SONG,
  RECEIVE_SONG,
  REQUEST_UPDATE_SONG,
  SUCCESS_UPDATE_SONG,
} from "../constants/actionTypes";

export const secondsToTime = (totalSeconds) => {
  if (!totalSeconds && totalSeconds !== 0) return "";
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
};

export const timeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr === "number") return timeStr || 0;
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
};

const fetchSongs = (filters) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SONGS });

  const { page, limit, sort, ...filterBody } = filters;

  return axios
    .post(`${SONGS_SERVICE}/api/song/_list`, filterBody, {
      params: {
        page: (page || 1) - 1,
        size: limit || 5,
        sort: `duration,${sort || "desc"}`,
      },
      withCredentials: true,
    })
    .then((response) => {
      dispatch({
        type: RECEIVE_SONGS,
        payload: response.content || response,
        totalPages: response.totalPages || 1,
      });
    })
    .catch((error) => {
      console.error("Error fetching songs:", error);
    });
};

const fetchSongDetails = (id) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SONG });

  return axios
    .get(`${SONGS_SERVICE}/api/song/${id}`, { withCredentials: true })
    .then((song) => {
      dispatch({ type: RECEIVE_SONG, payload: song });
      return song;
    })
    .catch((error) => {
      console.error("Error fetching song details:", error);
      throw error;
    });
};

const fetchCreateSong = (formData) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SAVE_SONG });

  const preparedData = {
    ...formData,
    duration: timeToSeconds(formData.duration),
  };

  return axios
    .post(`${SONGS_SERVICE}/api/song`, preparedData, { withCredentials: true })
    .then((newSong) => {
      dispatch({ type: SUCCESS_SAVE_SONG, payload: newSong });
      return newSong;
    })
    .catch((error) => {
      console.error("Error creating song:", error);
      throw error;
    });
};

const fetchUpdateSong = (id, formData) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_UPDATE_SONG });

  const preparedData = {
    ...formData,
    duration: timeToSeconds(formData.duration),
  };

  return axios
    .put(`${SONGS_SERVICE}/api/song/${id}`, preparedData, {
      withCredentials: true,
    })
    .then((updatedSong) => {
      dispatch({ type: SUCCESS_UPDATE_SONG, payload: updatedSong });
      return updatedSong;
    })
    .catch((error) => {
      console.error("Error updating song:", error);
      throw error;
    });
};

const fetchDeleteSong = (id) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_DELETE_SONG });

  return axios
    .delete(`${SONGS_SERVICE}/api/song/${id}`, { withCredentials: true })
    .then(() => {
      dispatch({ type: SUCCESS_DELETE_SONG, payload: id });
    })
    .catch((error) => {
      console.error("Error deleting song:", error);
      throw error;
    });
};

const downloadCsv = async () => {
  const { SONGS_SERVICE } = config;

  const filterBody = {
    albumName: "",
    artistName: "",
    releasedYear: null,
  };

  try {
    const response = await axios.post(
      `${SONGS_SERVICE}/api/song/_report`,
      filterBody,
      {
        responseType: "blob",
        withCredentials: true,
      },
    );

    const blobData = response.data || response;

    if (!blobData || blobData.size === 0) {
      console.error("Помилка: отримано порожній файл");
      return;
    }

    const url = window.URL.createObjectURL(
      new Blob([blobData], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `songs_report.csv`);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Помилка при скачуванні CSV:", error);
  }
};

export default {
  fetchSongs,
  fetchSongDetails,
  fetchCreateSong,
  fetchUpdateSong,
  fetchDeleteSong,
  downloadCsv,
};
