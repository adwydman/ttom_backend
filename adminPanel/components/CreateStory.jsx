import { useState } from 'react';
import { useCurrentAdmin } from 'admin-bro';
import styled from 'styled-components';
import { generateConversationClusters } from '../utils/utils';
import { config } from '../utils/config';
import { TextMessages } from './TextMessages';

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const UploadForm = (props) => {
  const [currentAdmin] = useCurrentAdmin();
  const [csvFile, setCsvFile] = useState(null);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [mainCharacter, setMainCharacter] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [storyPreview, setStoryPreview] = useState(null);

  const handleFileUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!csvFile) {
      alert('Csv file is required!')
      return;
    }
    const formData = new FormData();
    formData.append('csvFile', csvFile);
    formData.append('author', author);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('pictureUrl', pictureUrl);
    formData.append('mainCharacter', mainCharacter);
    formData.append('preview', true)

    const fetchResponse = await fetch(`${config.backendUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentAdmin.token}`
      },
      body: formData,
    })
    const result = await fetchResponse.json();
    console.log('result', result.data)

    const uploadedStory = generateConversationClusters(result.data);

    setStoryPreview(uploadedStory);
  };

  if (Boolean(storyPreview)) {
    return (
      <>
        <div style={{marginBottom: '20px'}}>
          <button onClick={() => {
            setStoryPreview(null);
            setSelectedConversation(null);
          }}>Go back</button>
        </div>
        <div>
          {Object.keys(storyPreview).map((contactName) => {
            const orderValues = storyPreview[contactName].map((c) => c.__order__);

            return (
              <div key={contactName}>
                <button onClick={() => {
                  setSelectedConversation(contactName)
                }}>
                  {contactName} ({orderValues.join(', ')})
                </button>
              </div>
            )
          })}
        </div>
        { selectedConversation && <TextMessages textMessages={storyPreview[selectedConversation]} /> }
      </>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FormRow>
          <label>Author</label>
          <input type="text" placeholder="Enter author's name" value={author} onChange={(e) => setAuthor(e.target.value)} />
        </FormRow>
        <FormRow>
          <label>Title</label>
          <input type="text" placeholder="Enter story title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormRow>
        <FormRow>
          <label>Story Description</label>
          <textarea rows={3} placeholder="Enter a short description of what the story is about" value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormRow>
        <FormRow>
          <label>Main Character</label>
          <input type="text" placeholder="Enter main character's name" value={mainCharacter} onChange={(e) => setMainCharacter(e.target.value)} />
        </FormRow>
        <FormRow>
          <label>Story Cover Image URL</label>
          <input type="text" placeholder="Enter the URL of the story cover image" value={pictureUrl} onChange={(e) => setPictureUrl(e.target.value)} />
        </FormRow>
        <FormRow>
          <label>Story File in CSV format</label>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </FormRow>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadForm;
