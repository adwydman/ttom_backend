import moment from 'moment';

function flatten(array) {
  let result = [];
  
  for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i])) {
          result = result.concat(array[i]);
      } else {
          result.push(array[i]);
      }
  }
  
  return result;
}

export const isImage = (message) => /\.(jpg|jpeg|png|gif)$/.test(message);

export const generateAvailableConversations = (userStoryTextMessages) => {
  const conversationClusters = generateConversationClusters(userStoryTextMessages);

  let totalAvailableMessages = 0;
  const parsedConversations = {};
  let visibleMessages = []
  Object.keys(conversationClusters).forEach((contactName) => {
    const clusters = conversationClusters[contactName];

    const availableClusters = clusters.filter((c) => c.__canBeDisplayed__);
    const availableMessages = flatten(availableClusters);
    visibleMessages = [
      ...visibleMessages,
      availableMessages,
    ]

    if (availableMessages.length > 0) {
      const unreadMessagesCount = availableMessages.filter((m) => !m.seenByUser).length;

      totalAvailableMessages += unreadMessagesCount;
      parsedConversations[contactName] = availableMessages;
    }
  })

  visibleMessages = flatten(visibleMessages);

  return [parsedConversations, totalAvailableMessages, visibleMessages];
}

export const isMainCharacter = (storyCharacter) => {
  return storyCharacter.toLowerCase() === 'me';
}

export const generateConversationClusters = (userStoryTextMessages) => {
  let previousContactName = null;
  let order = 1;
  return userStoryTextMessages.reduce((acc, message, index, array) => {
    const whoToSeparated = message.whoTo.split(';');

    let contactName = '';
 
    if (whoToSeparated.length === 1) {
      contactName = isMainCharacter(message.whoFrom) ? message.whoTo : message.whoFrom;
    } else {
      contactName = whoToSeparated.join(', ');
    }


    if (!acc[contactName]) {
      acc[contactName] = [];
    }

    const conversation = acc[contactName];

    let cluster;
    if (previousContactName !== contactName) {
      cluster = [];
      cluster.__canBeDisplayed__ = true;
      cluster.__order__ = order;
      order++;

      conversation.push(cluster);
    } else {
      cluster = conversation[conversation.length - 1];
    }

    cluster.push(message);
    previousContactName = contactName

    return acc;
  }, {})
};

const offset = moment().utcOffset();

export const getMessageTimestamp = (enabledAt) => {
  const messageEnabledAtLocal = moment(enabledAt).add(offset, 'minutes');  // moment(enabledAt) is UTC time
  // const currentDate = moment(new Date()).startOf('day').add(offset, 'minutes');  // Central Time
  const currentDate = moment(new Date());  // Central Time

  const diffInDays = currentDate.diff(messageEnabledAtLocal, 'days');

  let displayedDate = null;
  if (diffInDays === 1) {
    displayedDate = 'Yesterday';
  } else if (diffInDays > 1) {
    const dayName = messageEnabledAtLocal.format('dddd')

    if (diffInDays < 6) {
      displayedDate = dayName;
    } else if (diffInDays >= 6 && diffInDays <= 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')}`;
    } else if (diffInDays > 365) {
      displayedDate = `${dayName}, ${messageEnabledAtLocal.format('MMM')} ${messageEnabledAtLocal.format('D')} ${messageEnabledAtLocal.format('YYYY')}`;
    }
  } 

  return `${displayedDate ? `${displayedDate} • ` : ''}${moment(enabledAt).format('h:mm a')}`;
}
