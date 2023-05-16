import { useState } from 'react';
import { useCurrentAdmin } from 'admin-bro';
import { useAsyncEffect } from '../utils/hooks';
import { config } from '../utils/config';

const ShowStory = ({ record }) => {
  const [currentAdmin] = useCurrentAdmin();
  const [loading, setLoading] = useState(false);
  const [storyElements, setStoryElements] = useState(null);

  useAsyncEffect(async () => {
    setLoading(true);
    const fetchResponse = await fetch(`${config.backendUrl}/userStoryTextMessages?storyId=${record.id}`, {
      headers: {
        'Authorization': `Bearer ${currentAdmin.token}`
      },
    })

    const result = await fetchResponse.json();

    setLoading(false);
    setStoryElements(result);
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return <div>Test</div>
};

export default ShowStory;
