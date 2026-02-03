import SongDetailsPage from 'pages/songDetails';
import React from 'react';

import PageContainer from './components/PageContainer';

const SongDetails = (props) => {
  return (
    <PageContainer>
      <SongDetailsPage {...props} />
    </PageContainer>
  );
};

export default SongDetails;
