'use strict';

const messagesModule = (function() {

  const messages = [
    {
      id: '1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:00:00'),
      author: 'Tom',
      isPersonal: false,
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:00:05'),
      author: 'Tom',
      isPersonal: false,
    },
    {
      id: '3',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:00:07'),
      author: 'Anna',
      isPersonal: false,
    },
    {
      id: '4',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:01:00'),
      author: 'Elon',
      isPersonal: false,
    },
    {
      id: '5',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:01:08'),
      author: 'Tom',
      isPersonal: false,
    },
    {
      id: '6',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:02:00'),
      author: 'Anna',
      isPersonal: false,
    },
    {
      id: '7',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:05:00'),
      author: 'Tom',
      isPersonal: false,
    },
    {
      id: '8',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:05:02'),
      author: 'Alice',
      isPersonal: false,
    },
    {
      id: '9',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T20:07:03'),
      author: 'Tom',
      isPersonal: false,
    },
    {
      id: '10',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T21:00:00'),
      author: 'Anna',
      isPersonal: false,
    },
    {
      id: '11',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T21:05:00'),
      author: 'Elon',
      isPersonal: false,
    },
    {
      id: '12',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T21:05:10'),
      author: 'Maxim',
      isPersonal: false,
    },
    {
      id: '13',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T21:06:00'),
      author: 'Alice',
      isPersonal: true,
      to: 'Anna',
    },
    {
      id: '14',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T21:07:01'),
      author: 'Anna',
      isPersonal: true,
      to: 'Alice',
    },
    {
      id: '15',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:04:09'),
      author: 'Anna',
      isPersonal: true,
      to: 'Alice',
    },
    {
      id: '16',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:05:00'),
      author: 'Alice',
      isPersonal: true,
      to: 'Anna',
    },
    {
      id: '17',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:08:07'),
      author: 'Alice',
      isPersonal: true,
      to: 'Anna',
    },
    {
      id: '18',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:09:00'),
      author: 'Anna',
      isPersonal: true,
      to: 'Alice',
    },
    {
      id: '19',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:09:03'),
      author: 'Elon',
      isPersonal: false,
    },
    {
      id: '20',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      createdAt: new Date('2020-10-12T22:09:07'),
      author: 'Alexander',
      isPersonal: false,
    }
  ];

  const filterObj = {
    text: (item, text) => text && item.text.toLowerCase().includes(text),
    author: (item, author) => author && item.author.toLowerCase().includes(author.toLowerCase()),
    dateTo: (item, dateTo) => dateTo && item.dateTo < dateTo,
    dateFrom: (item, dateFrom) => dateFrom && item.dateFrom > dateFrom
  };

  const validateObj = {
    id: (item) => item.id && typeof item.id === "string",
    text: (item) => item.text && typeof item.text === "string" && item.text.length <= 200,
    author: (item) => item.author && typeof item.author === "string",
    createdAt: (item) => item.createdAt
  }
  
  const editObj = {
    text: (item, text) => text ? item.text = text : item.text,
    to: (item, to) => to ? item.to = to : item,
  };

  let curAuthor = 'Anna';

  function getMessage(id) {
    return messages.find(item => item.id === id);
  };

  function getMessages (skip = 0, top = 10, filterConfig = {} ) {
    let result = messages.slice();
    
    // Filtering
    Object.keys(filterConfig).forEach(key => {
      result = result.filter(item => filterObj[key](item, filterConfig[key]));
    });

    // Sorting
    result = result.slice().sort((a, b) => {
      let dateA = Date.parse(a.createdAt), 
          dateB = Date.parse(b.createdAt);
      return dateA - dateB;
    });

    // Pagination
    result = result.slice(skip, skip+top); 

    return result;
  };

  function validateMessage(msg){
    return Object.keys(validateObj).every(key => validateObj[key](msg));
  };

  function generateID() {
    return Math.random().toString(36).substr(2, 10);
  }

  function addMessage(msg) {
    if (validateMessage(msg)) {
      msg.id = generateID();
      msg.author = curAuthor;
      msg.createdAt = new Date();
      messages.push(msg);
      return true;
    }
    return false;
  };

  function editMessage(id, msg) {
    const msgIndex = messages.findIndex((msg) => msg.id === id);
    const copyObj = Object.assign({}, messages[msgIndex]);

    Object.keys(editObj).every(key => editObj[key](copyObj, msg[key]));
    
    if (validateMessage(copyObj)) {
      messages[msgIndex] = copyObj;
      return true;
    }
    return false;
  };

  function removeMessage(id) {
    const index = messages.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    messages.splice(index, 1);
    return true;
  };

  return {
    getMessages,
    getMessage,
    validateMessage,
    addMessage,
    editMessage,
    removeMessage
  }
})();

console.log('Get messages:', messagesModule.getMessages());
console.log('Get messages (0,10):', messagesModule.getMessages(0,10));
console.log('Get messages (10,10):', messagesModule.getMessages(10,10));
console.log('Get messages (author:Anna):', messagesModule.getMessages(0, 10, { author: 'Anna' }));
console.log('Get message (id:1):', messagesModule.getMessage('1'));
console.log('Get message (id:33):', messagesModule.getMessage('33'));
console.log('Validate message:', messagesModule.validateMessage({
        id: '123',
        text: 'Hello World!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Anna',
        isPersonal: true,
        to: 'Tom'
}));
console.log('Validate invalid message:', messagesModule.validateMessage({
        id: '212',
        text: 'Пока!',
        createdAt: new Date('2020-10-12T23:00:00'),
}));
console.log('Add valid message:', messagesModule.addMessage({
        id: '21',
        text: 'I was added recently!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Anna',
        isPersonal: true,
        to: 'Tom'
}));
console.log('Add invalid message:', messagesModule.addMessage({
        id: '22',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit ametifjj.',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Elon',
        isPersonal: true,
        to: 'Tom'
}));
console.log('Edit message:', messagesModule.editMessage('1', {text: 'I changed!'}));
console.log(messagesModule.getMessage('1'));
console.log('Remove message:', messagesModule.removeMessage('2'));
console.log('Result:', messagesModule.getMessages(0,20));