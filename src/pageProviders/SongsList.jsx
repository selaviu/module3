import SongsListPage from 'pages/songsList';
import React from 'react';

import PageContainer from './components/PageContainer';

const SongsList = (props) => {
  return (
    <PageContainer>
      <SongsListPage {...props} />
    </PageContainer>
  );
};

export default SongsList;
