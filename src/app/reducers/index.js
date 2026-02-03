import { combineReducers } from 'redux';

import user from './user';
import song from './song';
import categories from './categories';
import albums from './album';
import artists from './artist';
import stream from './stream';

export default combineReducers({
  user,
  song,
  categories,
  albums,
  artists,
  stream
});
