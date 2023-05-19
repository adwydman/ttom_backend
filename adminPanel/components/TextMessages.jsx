import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { isImage, isMainCharacter } from '../utils/utils';
import { Message } from './Message';

const Cluser = styled.div`
  border: 1px solid red;
  width: 50%;
`
export const TextMessages = (props) => {
  const { conversations, match, history } = props;

  if (match.params.id) {
    const textMessages = conversations[match.params.id];

    const renderableClusters = textMessages.map((cluster) => {
      const messages = [];
      let lastType = null;

      for (let i = 0; i < cluster.length; i++) {
        const { message, whoFrom, enabledAt } = cluster[i];
        const type = isMainCharacter(whoFrom) ? 'right' : 'left';

        lastType = type;

        messages.push(
          <Message
            type={type}
            enabledAt={enabledAt}
            conversation={cluster[i]}
            previousMessage={cluster[i - 1]}
          >
            {message}
          </Message>
        )
      }

      return <div>
        Cluster {cluster.__order__}
        <Cluser>
          {messages}
        </Cluser>
      </div>;
    });

    return <div>
      <div onClick={() => {
        const url = match.path.split('/').filter(x => !x.includes(':')).join('/');
        history.push(url);
      }}>
        Go back
      </div>

      <div>
        {renderableClusters}
      </div>
    </div>;
  }

  return <ul>
    {Object.keys(conversations).map((contactName) => {
      const orderValues = conversations[contactName].map((c) => c.__order__);

      return <li key={contactName}>
        <Link to={`${location.pathname}/${contactName}`}>{contactName} ({orderValues.join(', ')})</Link>
      </li>;
    })}
  </ul>;
};
