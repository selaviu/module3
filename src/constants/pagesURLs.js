import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
  [pages.songsListPage]: `${config.UI_URL_PREFIX}/${pages.songsListPage}`,
  [pages.songDetailsPage]: `${config.UI_URL_PREFIX}/${pages.songDetailsPage}/:id`,
};

export default result;
