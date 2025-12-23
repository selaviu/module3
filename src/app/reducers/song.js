import { 
    RECEIVE_SONGS, 
    REQUEST_SONGS, 
    SUCCESS_DELETE_SONG,
    REQUEST_SAVE_SONG,    
    SUCCESS_SAVE_SONG,    
    RECEIVE_SONG  
} from '../constants/actionTypes';

const initialState = {
    list: [],
    currentSong: null, 
    isLoading: false,
};

export default function songReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_SONGS:
        case REQUEST_SAVE_SONG: 
        return { 
            ...state, 
            isLoading: true 
        };

        case RECEIVE_SONGS:
        return { 
            ...state, 
            list: action.payload, 
            totalPages: action.totalPages || 1, 
            isLoading: false 
        };
        case SUCCESS_SAVE_SONG:
        return { 
            ...state, 
            list: action.payload, 
            isLoading: false 
        };

        case RECEIVE_SONG: 
        return {
            ...state,
            currentSong: action.payload,
            isLoading: false
        };

        case SUCCESS_DELETE_SONG:
        return {
            ...state,
            list: state.list.filter(song => song.id !== action.payload),
            isLoading: false
        };

        default:
        return state;
    }
}