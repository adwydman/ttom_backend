import styled from 'styled-components';
import { getMessageTimestamp } from '../utils/utils';

const Bubble = styled.div`
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 2px;
`;
const LeftBubble = styled(Bubble)`
  background-color: white;
`;
const RightBubble = styled(Bubble)`
  background-color: #0D47A1;
  margin-left: 16px;
  color: white;
`;

export function Message({ type, children, enabledAt, extraStyles = {}, shouldShowTail, conversation, previousMessage }) {
  const shouldShowNameInGroupChat = (type === 'left') && (conversation.whoTo.split(';').length > 1) && (previousMessage === undefined || previousMessage.whoFrom !== conversation.whoFrom);

  return (
    <div>
      {shouldShowNameInGroupChat && (
        <div>
          {conversation.whoFrom}
        </div>
      )}
      <div>
        {type === 'left' && <LeftBubble>{children}</LeftBubble>}
        {type === 'right' && <RightBubble>{children}</RightBubble>}
        {/* <div>
              {
                // isImage(children) ? <img /> : <span></span>
                <span>{children}</span>
              }
            </div> */}

      </div>
      <div>
        {getMessageTimestamp(enabledAt)}
      </div>
    </div>
  );
}
