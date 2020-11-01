'use strict';

const allMessages = [
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

const messagesModule = (function(){
  
    const messages = allMessages.slice();

    function getMessage(id) {
        return messages.find(item => item.id === id);
    };

    function getMessages (skip = 0, top = 10, filterConfig = {} ) {
      // Sorting
      let result = messages.slice().sort((a, b) => {
        let dateA = Date.parse(a.createdAt), 
            dateB = Date.parse(b.createdAt);
        return dateA - dateB;
      });

      // Filtering
      const { text, dateFrom, dateTo, author } = filterConfig;
      if (text) {
        result = result.filter(message => {
          return message.text.includes(text);
        });
      }
      if (author) {
        result = result.filter(message => {
          return message.author === author;
        });
      }
      if (dateFrom) {
        result = result.filter(message => {
          return message.createdAt >= dateFrom;
        });
      }
      if (dateTo) {
        result = result.filter(message => {
          return message.createdAt <= dateTo;
        });
      }

      // Pagination
      result = result.slice(skip, skip+top); 

      return result;
    };

    function validateMessage(msg){

      if ((typeof msg.id === 'string' && msg.id !== '' && typeof msg.id !== "undefined") 
      && (typeof msg.text === 'string' && msg.text !== '' && typeof msg.text !== "undefined") 
      && (typeof msg.createdAt === 'object' && msg.createdAt !== '' && typeof msg.createdAt !== "undefined") 
      && (typeof msg.author === 'string' && msg.author !== '' && typeof msg.author !== "undefined")
      && typeof msg.isPersonal === 'boolean'
      && (typeof msg.to === 'string' || typeof msg.to === "undefined")){
        return true;
      } else {
        return false;
      };
    };

    function addMessage(msg) {
  
      if (validateMessage(msg)) {
          messages.push(msg);
          return true;
      } else {
        return false;
      };
    };

    function editMessage(id, msg) {
      
      const copyObj = Object.assign({}, getMessage(id));

      if (validateMessage(copyObj)){
        for (let key in msg) {
          if (key !== 'id' && key !== 'author' && key !== 'createdAt') {
            return copyObj[key] = msg[key];
          } 
        };
        return true;
      } else {
        return false;
      }
    };

    function removeMessage(id) {
        
      const index = messages.findIndex(item => item.id === id);
      if (index === -1) {
        return false;
      }
      messages.splice(index, 1);
      return true;
    }

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
console.log('Get messages:', messagesModule.getMessages(0, 10, { author: 'Anna' }));
console.log('Get message (id):', messagesModule.getMessage('1'));
console.log('Get message (id):', messagesModule.getMessage('33'));
console.log('Validate message:', messagesModule.validateMessage({
        id: '21',
        text: 'Hello World!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Anna',
        isPersonal: true,
        to: 'Tom'
}));
console.log('Validate message:', messagesModule.validateMessage({
        id: 21,
        text: 'Пока!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Anna',
        isPersonal: true,
        to: 'Hanna'
}));
console.log('Add valid message:', messagesModule.addMessage({
        id: '21',
        text: 'Hello World!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 'Anna',
        isPersonal: true,
        to: 'Tom'}));
console.log('Add valid message:',messagesModule.addMessage({
        id: '22',
        text: 'Hello World!',
        createdAt: new Date('2020-10-12T23:00:00'),
        author: 777,
        isPersonal: true,
        to: 'Tom'}));
console.log('Edit message:', messagesModule.editMessage('1', { text: 'hello!' }));
console.log('Remove message:',messagesModule.removeMessage('2'));
console.log('Result:', messagesModule.getMessages(0,20));