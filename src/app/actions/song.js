import axios from 'misc/requests';
import config from 'config';
import { 
  REQUEST_SONGS, RECEIVE_SONGS, 
  REQUEST_DELETE_SONG, SUCCESS_DELETE_SONG, 
  SUCCESS_SAVE_SONG, REQUEST_SAVE_SONG,
  REQUEST_SONG, RECEIVE_SONG, 
} from '../constants/actionTypes';

const STORAGE_KEY = 'MOCK_SONGS';

export const secondsToTime = (totalSeconds) => {
  if (!totalSeconds && totalSeconds !== 0) return '';
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export const timeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr === 'number') return timeStr || 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    return (parts[0] * 60) + parts[1];
  }
  return parts[0] || 0;
};

const DEFAULT_SONGS = [
  { 
    id: 1, 
    title: "Smells Like Teen Spirit", 
    artistName: "Nirvana", 
    album: "Nevermind", 
    duration: 301, 
    genres: ["Rock"], 
    releaseYear: 1991 
  },
  { 
    id: 2, 
    title: "Blinding Lights", 
    artistName: "The Weeknd", 
    album: "After Hours", 
    duration: 200, 
    genres: ["Pop"], 
    releaseYear: 2019 
  },
  { 
    id: 3, 
    title: "Blue Train", 
    artistName: "John Coltrane", 
    album: "Blue Train", 
    duration: 643, 
    genres: ["Jazz"], 
    releaseYear: 1957 
  },
  { 
    id: 4, 
    title: "Strobe", 
    artistName: "deadmau5", 
    album: "For Lack of a Better Name", 
    duration: 637, 
    genres: ["Techno"], 
    releaseYear: 2009 
  },
  { 
    id: 5, 
    title: "One More Time", 
    artistName: "Daft Punk", 
    album: "Discovery", 
    duration: 320, 
    genres: ["Electronic", "Dance"], 
    releaseYear: 2000 
  }
];

const getStoredSongs = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SONGS));
    return DEFAULT_SONGS;
  }
  return JSON.parse(stored);
};

const fetchSongs = (filters) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SONGS });

  return axios.get(`${SONGS_SERVICE}/songs`, { params: filters })
    .catch((err) => {
      const data = getStoredSongs();
      let filteredData = [...data];

      if (filters?.genres) {
        filteredData = filteredData.filter(s => Array.isArray(s.genres) && s.genres.includes(filters.genres));
      }

      if (filters?.sort) {
        filteredData.sort((a, b) => (filters.sort === 'asc' ? a.duration - b.duration : b.duration - a.duration));
      }

      const page = parseInt(filters?.page || 1, 10);
      const limit = parseInt(filters?.limit || 5, 10);
      const totalPages = Math.ceil(filteredData.length / limit);
      const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

      return { data: paginatedData, totalPages };
    })
    .then(({ data, totalPages }) => {
      dispatch({ 
        type: RECEIVE_SONGS, 
        payload: data,
        totalPages: totalPages 
      });
    })
    .catch((error) => console.error("Error fetching songs:", error));
};

const fetchSongDetails = (id) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SONG });

  return axios.get(`${SONGS_SERVICE}/songs/${id}`)
    .catch(() => {
      const data = getStoredSongs();
      return data.find(song => song.id === Number(id));
    })
    .then((song) => {
      dispatch({ type: RECEIVE_SONG, payload: song });
      return song;
    })
    .catch((error) => console.error("Error fetching song details:", error));
};

const fetchCreateSong = (formData) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SAVE_SONG });

  return axios.post(`${SONGS_SERVICE}/songs`, formData)
    .catch(() => {
      const data = getStoredSongs();
      const newSong = {
        ...formData,
        id: data.length > 0 ? Math.max(...data.map(s => s.id)) + 1 : 1,
        duration: Number(formData.duration),
        genres: typeof formData.genres === 'string' 
            ? formData.genres.split(/[ ,.;]+/).map(g => g.trim()).filter(Boolean)
            : (Array.isArray(formData.genres) ? formData.genres : [])
      };
      const updatedList = [...data, newSong];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return { updatedList, newSong };
    })
    .then(({ updatedList, newSong }) => {
      dispatch({ type: SUCCESS_SAVE_SONG, payload: updatedList });
      return newSong;
    })
    .catch((error) => {
      throw error; 
    });
};

const fetchUpdateSong = (id, formData) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_SAVE_SONG });

  return axios.put(`${SONGS_SERVICE}/songs/${id}`, formData)
    .catch(() => {
      const data = getStoredSongs();
      const updatedList = data.map(song => 
        song.id === Number(id) ? { 
          ...song, 
          ...formData,
          duration: Number(formData.duration),
          genres: typeof formData.genres === 'string' 
            ? formData.genres.split(/[ ,.;]+/).map(g => g.trim()).filter(Boolean)
            : (Array.isArray(formData.genres) ? formData.genres : [])
        } : song
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    })
    .then((payload) => {
      dispatch({ type: SUCCESS_SAVE_SONG, payload });
      return payload;
    })
    .catch((error) => {
      throw error;
    });
};

const fetchDeleteSong = (id) => (dispatch) => {
  const { SONGS_SERVICE } = config;
  dispatch({ type: REQUEST_DELETE_SONG });

  return axios.delete(`${SONGS_SERVICE}/songs/${id}`)
    .catch(() => {
      const data = getStoredSongs();
      const newData = data.filter(song => song.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return id;
    })
    .then((deletedId) => {
      dispatch({ type: SUCCESS_DELETE_SONG, payload: deletedId });
    })
    .catch((error) => console.error("Error deleting song:", error));
};

export default {
  fetchSongs,
  fetchSongDetails,
  fetchCreateSong,
  fetchUpdateSong,
  fetchDeleteSong,
};