'use strict';

let curAuthor = 'Anna';

class Message {
  constructor(text, to, isPersonal) {
    this._id = this.generateId(),
    this._createdAt = new Date(),
    this._author = curAuthor,
    this._text = text,
    this._to = to,
    this._isPersonal = isPersonal
  }

  generateId(){
    return Math.random().toString(36).substr(2, 10);
  }

  get id() {    
    return this._id;
  }

  set id(id) {    
    throw new Error('Deny to edit object field')
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    throw new Error('Deny to edit object field')
  }

  set text(value) {
    if (value.length < 200){
      this._text = value;
    }
    else {
      this._text = value.slice(0, 200);
    }   
  }

  get author() {
    return this._author;
  }

  set author(value) {
    throw new Error('Deny to edit object field')
  }

  get isPersonal() {
    return this._isPersonal;
  }

  set isPersonal(value) {
    this._isPersonal = value;
  }
}

class MessageList {

  constructor(messages = []) {
    this._messages = messages;
  }
      
  get(id) {
    return this._messages.find(item => item.id === id);
  };

  getFilterObj() {
    return {
      text: (item, text) => text && item.text.toLowerCase().includes(text),
      author: (item, author) => author && item.author.toLowerCase().includes(author.toLowerCase()),
      dateTo: (item, dateTo) => dateTo && item.dateTo < dateTo,
      dateFrom: (item, dateFrom) => dateFrom && item.dateFrom > dateFrom
    }
  };

  getPage(skip = 0, top = 10, filterConfig = {}) {
    let result = this._messages.slice();
    const messageFilter = this.getFilterObj();
    // Filtering
    Object.keys(filterConfig).forEach(key => {
      result = result.filter(item => messageFilter[key](item, filterConfig[key]));
    });

    // Sorting
    result = result.slice().sort((a, b) => {
      let dateA = Date.parse(a.createdAt), 
          dateB = Date.parse(b.createdAt);
      return dateA - dateB;
    }); 

    return result.slice(skip, skip+top);;
  };

  getValidateObj() {
    return {
      id: (item) => item.id && typeof item.id === "string",
      text: (item) => item.text && typeof item.text === "string" && item.text.length <= 200,
      author: (item) => item.author && typeof item.author === "string",
      createdAt: (item) => item.createdAt
    };
  }

  add (msg) {
    if (this.validate(msg)) {
      msg._id = `${+new Date()}`;
      msg._author = author;
      msg._createdAt = new Date();
      messages.push(msg);
      return true; 
    }
    return false; 
  };

  validate(msg){
    const messageValidator = this.getValidateObj();

    return Object.keys(messageValidator).every(key => messageValidator[key](msg));  
  };

  edit(id, msg) {
    const editObj = {
      text: (item, text) => text ? item.text = text : item.text,
      to: (item, to) => to ? item.to = to : item,
    };

    const msgIndex = this._messages.findIndex((msg) => msg._id === id);
    const copyObj = Object.assign({}, this._messages[msgIndex]);

    Object.keys(editObj).every(key => editObj[key](copyObj, msg[key]));
    
    if (this.validate(copyObj)) {
      this._messages[msgIndex] = copyObj;
      return true;
    }
    return false;
  };

  remove(id) {
    const index = this._messages.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    this._messages.splice(index, 1);
    return true;
  };

  addAll(messages) {
    const invalidMessages = [];
    this._messages.forEach(msg => {
      if (this.validate(msg)) {
        this._messages.push(msg);
      } else {
        this.invalidMessages.push(msg);
      }
    });
    return invalidMessages;
  }

  clear() {
    this._messages = [];
  }
}

const messages = [
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:05'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:07'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:01:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:01:08'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:02:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:05:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:05:02'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:07:03'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:00:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:05:00'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:05:10'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:06:00'),
    isPersonal: true,
    to: 'Alexander',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:07:01'),
    isPersonal: true,
    to: 'Alice',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:04:09'),
    isPersonal: true,
    to: 'Alice',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:05:00'),
    isPersonal: true,
    to: 'Maxim',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:08:07'),
    isPersonal: true,
    to: 'Elon',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:00'),
    isPersonal: true,
    to: 'Alice',
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:03'),
    isPersonal: false,
  }),
  new Message({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:07'),
    isPersonal: false,
  })
];

const messageList = new MessageList(messages);

const message1 = new Message('Hi Tom', 'Tom', true);

messageList.add(message1);

console.log( 'Msgs collection: ', messageList);
console.log('Msg example: ', message1 );
