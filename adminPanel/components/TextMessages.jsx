import styled from 'styled-components';
import { isImage, isMainCharacter } from '../utils/utils';
import { Message } from './Message';

const SectionHeader = styled.span`
  color: red;
`

const Section = styled.div`
  border: 1px solid red;
  width: 50%;
`

export const TextMessages = ({ textMessages }) => {
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

    return (
      <div>
        <SectionHeader>Section {cluster.__order__}</SectionHeader>
        <Section>
          {messages}
        </Section>
      </div>
    );
  });

  return (
    <div>
      {renderableClusters}
    </div>
  );
};
