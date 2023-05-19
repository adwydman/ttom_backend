import { useState } from 'react';
import { useCurrentAdmin } from 'admin-bro';
import { useAsyncEffect } from '../utils/hooks';
import { generateConversationClusters } from '../utils/utils';
import { Link, Route, Switch, BrowserRouter, useLocation } from 'react-router-dom';

import { config } from '../utils/config';
import { TextMessages } from './TextMessages';

const Photos = () => {
  return <div>Photos</div>
}

const ShowStory = ({ record }) => {
  const [currentAdmin] = useCurrentAdmin();
  const [storyElements, setStoryElements] = useState(null);
  const location = useLocation()

  useAsyncEffect(async () => {
    const fetchResponse = await fetch(`${config.backendUrl}/userStoryTextMessages?storyId=${record.id}`, {
      headers: {
        'Authorization': `Bearer ${currentAdmin.token}`
      },
    })

    const result = await fetchResponse.json();

    setStoryElements(result);
  }, []);

  if (!storyElements) {
    return <div>Loading...</div>
  }

  const conversations = generateConversationClusters(storyElements.userStoryTextMessages);

  return (
    <BrowserRouter>
      <div>
        Select story element:
        <ul>
          { 
            storyElements.userStoryTextMessages && 
            <li>
              <Link to={`${location.pathname}/textMessages`}>Text messages</Link>
            </li> 
          }
          {
            storyElements.userPhotos && 
            <li>
              Photos
            </li>
          }
        </ul>
        <Switch>
          <Route path={`${location.pathname}/textMessages/:id?`} render={(props) => <TextMessages {...props} conversations={conversations} />} />
        </Switch>
      </div>
    </BrowserRouter>
  )
};

export default ShowStory;
