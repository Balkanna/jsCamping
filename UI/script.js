let count = 1;
const generatorId = () => (count++).toString();

class Message {
  constructor(id, createdAt, author, text, isPersonal, to) {
    this._id = id;
    this._createdAt = createdAt;
    this._author = author;
    this._text = text;
    this._to = to;
    this._isPersonal = isPersonal;
  }

  get id() {    
    return this._id;
  }

  set id(id) {    
    throw new Error('Deny to edit object field.')
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(value) {
    throw new Error('Deny to edit object field.')
  }

  set text(value) {
    this._text = value.slice(0, 200);  
  }

  get text() {
    return this._text;
  }

  get author() {
    return this._author;
  }

  set author(value) {
    throw new Error('Deny to edit object field.')
  }

  get to(){
    return this._to;
  }

  set to(value) {
    this._to = value;
    this._to !== undefined ? this._isPersonal = true : this._isPersonal = false;
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
    this._user = null;
  }

  get user() {
    return this._user;
  }

  set user(user) {
    this._user = user;
  }

  get messages() {
    return this._messages;
  }

  set messages(value) {
    this._messages = value;
  }

  restore() {
    const rawMessages = JSON.parse(localStorage.getItem());
    this._messages = rawMessages.map(item => new Message(item));
    return this.messages;
  }

  save() {
    localStorage.setItem('messages', JSON.stringify(this._messages));
    localStorage.setItem('users', JSON.stringify(this.users)); //???
    localStorage.setItem('currentUser', JSON.stringify(this.user));
  }
   
  get(id) {
    return this._messages.find(item => item.id === id);
  };

  getPage(skip = 0, top = 10, filterConfig = {}) {
    const filterObj = { 
      text: (item, text) => text && item.text.toLowerCase().includes(text.toLowerCase()),
      author: (item, author) => author && item.author.toLowerCase().includes(author.toLowerCase()),
      dateTo: (item, dateTo) => dateTo && item.createdAt < dateTo,
      dateFrom: (item, dateFrom) => dateFrom && item.createdAt > dateFrom,
    }

    let result = this._messages.slice().filter(item => {
      return (item.author === this.user || ((item.isPersonal === true && item.to === this.user) || item.isPersonal === false));
    });
  
    Object.keys(filterConfig).forEach(key => {
      result = result.filter(item => filterObj[key](item, filterConfig[key]));
    });

    result = result.sort((a, b) => {
      return  b.createdAt - a.createdAt;
    }); 

    return result.slice(skip, skip+top);
  };

  add(msg) {
    const newMsg = new Message(generatorId(), new Date(), this.user, msg.text, msg.isPersonal, msg.to);
    if (MessageList.validate(newMsg) && msg.author === this.user) {
      this._messages.push(newMsg);
      this.save();
      return true; 
    }
    return false; 
  };

  static validate(msg){
    const validateObj = {
      id: (msg) => msg.id && typeof msg.id === 'string',
      text: (msg) => msg.text && typeof msg.text === 'string' && msg.text.length <= 200,
      author: (msg) => msg.author && typeof msg.author === 'string',
      createdAt: (msg) => msg.createdAt,
      isPersonal: (msg) => {
        if ((msg.isPersonal === false && !msg.to)
          || (msg.isPersonal && msg.to && typeof msg.to === 'string')) {
          return typeof msg.isPersonal === 'boolean';
        }
        return false;
      }
    }
    return Object.keys(validateObj).every(key => validateObj[key](msg));  
  };

  edit(id, msg) {
    const editObj = {
      text: (item, text) => text ? item.text = text : item.text,
      to: (item, to) => to ? item.to = to : item
    };

    const msgIndex = this._messages.findIndex((msg) => msg.id === id);
    const copyObj = Object.assign({}, this._messages[msgIndex]);

    Object.keys(editObj).forEach(key => editObj[key](copyObj, msg[key]));

    if (msgIndex !== -1 && this._messages[msgIndex].author === this.user) {
      if (MessageList.validate(msg)) {
        this._messages[msgIndex] = msg;
        this.save();
        return true;
      }
    }
    return false;
  };

  remove(id) {
    let index = this._messages.findIndex(item => item.id === id);

    if (this._messages[index].author === this.user && index !== -1 ) {
      this._messages.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  } 

  addAll(messages) {
    let invalidMessages = [];

    messages.forEach(msg => {
      MessageList.validate(msg) ? this._messages.push(msg) : invalidMessages.push(msg);
    });
    return invalidMessages;
  }

  clear() {
    this._messages = [];
    this.save();
  }
}

class UserList {
  constructor(users, activeUsers) {
    this._users = users;
    this._activeUsers = activeUsers || false;
  }

  get activeUsers() {
    return this._activeUsers;
  }

  get users() {
    return this._users;
  }
}

class HeaderView {
  constructor(id) {
    this.id = id;
  }

  display(user) {
    let btnAuthorization = document.getElementById("header");
    let messageSend = document.getElementById("message-send");
  
    btnAuthorization.innerHTML = 
    `<div class="container">
      <div class="header__inner">
        <div class="header__logo">
          <img src="./images/logo_chat.png" alt="logo" class="logo">
        </div>
        <div class="header__authorization" id="header__authorization">
          <div class="name-authorization" id="name-authorization">${messageList.user ? user : ''}</div>
          ${(messageList.user !== undefined) ?
            `<button class="btn-sign-out btn" id="btn-sign-out" type="button" onclick="controller.returnToChatPage2()">Sign Out</button>`:
            `<button class="btn-sign-in btn" id="btn-sign-in" type="button" onclick="controller.moveToLoginPage()">Sign In</button>`}
        </div>
      </div>
    </div>`;

    messageSend.innerHTML = 
      `<form class="form-send-message" id="form-send-message" onsubmit="event.preventDefault(); controller.sendMessage(event)">
        <textarea class="message-send__input" id="message-send__input" type="text" placeholder="Write a message..." ${messageList.user !== undefined ? '' : 'disabled'}></textarea>
        <button type="submit" class="message-send__icon" id="message-send__icon" ${messageList.user !== undefined ? '' : 'disabled'}>
          <span class="iconify" data-icon="ic-round-send" data-inline="false"></span>
        </button>
      </form>
    `
  }
}

class ActiveUsersView {
  constructor(id) {
    this.id = id;
  }

  display(activeUsers) {
    const activeUsersListContainer = document.getElementById(this.id);
    const innerHTML = activeUsers.map( user => (`
        <div class="user-info">
          <div class="circle"></div>
          <span class="user-name">${user}</span>
          <span class="user-status">online</span> 
        </div>
      `)).join(``);

    activeUsersListContainer.innerHTML = innerHTML;
  }
}

class MessagesView {
  constructor(id) {
    this.id = id;
  }

  display(msgs) {
    const messagesList = document.getElementById(this.id);
    messagesList.innerHTML = msgs.map( msg => {
      let createdAt = msg.createdAt.toLocaleDateString();
      let time = msg.createdAt.toLocaleTimeString().slice(0, -3);

      return (`
        <div class="message-chat" id="message-chat">
          <div id="message-chat__info" class="message-chat__info ${msg.author === messageList.user ? "user-chat__info" : "" }">
            <div class="message__name">${msg.author}</div>
            <div class="message__time">${time}</div>
            <div class="message__date">${createdAt}</div>
          </div>
          <div id="message__container" class="message__container ${msg.author === messageList.user && messageList.user !== undefined ? "user-message" : "" }">
            <div class="message__text">${msg.text}</div>
            ${msg.author === messageList.user ? 
            `<div class="user-message__change" id="user-message__change">
              <button class="btn-edit" id="btn-edit" title="Edit" data-message-id="${msg.id}" onclick="controller.editMessage(this)"><i class="fas fa-pencil-alt icon-edit"></i></button>
              <button class="btn-delete" id="btn-delete" onclick="controller.removeMessage(${msg.id})" title="Delete"><i class="fas fa-trash-alt icon-delete" id="icon-delete"></i></button>
            </div>` : ''}
          </div>
        </div>
      `)
    }).join('');
  } 
}

class ChatController {
  constructor() {
    this.chatApiService = new ChatApiService("https://jslabdb.datamola.com/");
    this.userList = new UserList(['Alexander', 'Alice', 'Elon', 'Max','Tom', 'Natasha'], ['Alexander', 'Alice', 'Elon', 'Max','Tom']);
    this.activeUsersView = new ActiveUsersView('users-list__content');
    this.headerView = new HeaderView('header');
    this.messagesView = new MessagesView('messages-block');
    this._numberLoadedMessages = 10;   
    this.editableMessage = null;
    this.messageText = document.querySelector('#message-send__input');
    this.messageSubmit = document.querySelector('#message-send__icon');
  }

  get numberLoadedMessages() {
    return this._numberLoadedMessages;
  }

  set numberLoadedMessages(num) {
      this._numberLoadedMessages = num;
  }

  setCurrentUser(user) {
    messageList.user = user;
    this.headerView.display(user);
  }

  showActiveUsers() {
    this.activeUsersView.display(this.userList.activeUsers);
  }

  showMessages(skip = 0, top = 10, filterConfig = {}) {
    this.messagesView.display(messageList.getPage(skip, top, filterConfig));
  }

  addMessage(msg) {
    if (messageList.add(msg)) {
      this.showMessages(0, 10);
    }
  }

  removeMessage(id) {
    if (confirm('Do you want to delete this message?')) {
      messageList.remove(id.toString());
      this.messagesView.display(messageList.getPage());
      messageList.save();
    }
  }

  editMessage(elem) {
    const id = elem.dataset.messageId;
    this.editableMessage = messageList.messages.find(msg => msg.id === id.toString());
    document.querySelector('#message-send__input').value = this.editableMessage.text;

    document.getElementById('form-send-message').onsubmit = (event) => {
      event.preventDefault();
      const messageField = document.getElementById('form-send-message');
      const msg = controller.editableMessage;
      msg.text = document.querySelector('#message-send__input').value;

      if (messageList.edit(msg.id.toString(), msg)) {
        controller.messagesView.display(messageList.getPage(), messageList.user);
        messageList.save();
      }

      controller.editableMessage = null;
      messageField.reset();

      messageField.onsubmit = (event) => {
        event.preventDefault();
        controller.sendMessage(event);
      };
    } 
  }

  moveToLoginPage() {
    document.getElementById('main').style.display = "none";
    document.getElementById('authorization-container').style.display = "block";
    document.getElementById('registration-container').style.display = "none";
    btnSignInHeader.style.display = "none";
  }

  moveToRegistrationPage() {
    document.getElementById('registration-container').style.display = "block";
    document.getElementById('authorization-container').style.display = "none";
    btnSignInHeader.style.display = "none";
  }

  defaultPage() {
    this.showMessages(0, 10);
    document.getElementById('registration-container').style.display = "none";
    document.getElementById('authorization-container').style.display = "none";
    document.getElementById('main').style.display = "block";
  }

  returnToChatPage() {
    controller.defaultPage();
    btnSignInHeader.style.display = "block";
  }

  returnToChatPage2() {
    controller.setCurrentUser();
    controller.defaultPage();
    controller.showMessages(0, 10);
    console.log('Click: back!');
  }

  getFilterResult() {
    const filterConfig = {};

    let author = document.getElementById('nameFilter').value;
    let text = document.getElementById('textFilter').value;
    let dateFrom = new Date(document.getElementById('fromDateFilter').value);
    let dateTo = new Date(document.getElementById('toDateFilter').value);

    if (author) {
      filterConfig.author = author;
    };

    if (text) {
      filterConfig.text = text;
    };

    if (dateFrom.toString() !== 'Invalid Date') {
      filterConfig.dateFrom = dateFrom;
    };

    if (dateTo.toString() !== 'Invalid Date') {
      filterConfig.dateTo = dateTo;
    };

    this.showMessages(0, 10, filterConfig);
    console.log('Submit form');
  }

  reset() {
    document.getElementById("main__filter").reset();
  };

  sendMessage() {
    let messageField = document.querySelector('#message-send__input');
    let messageText = messageField.value;
    let msg = { author: this.user, text: messageText, isPersonal: false };
    this.addMessage(msg);
    messageField.value = '';
    console.log('Click: add new message!');
    console.log(MessageList.validate(msg));
  }

  loadMoreMessages() {
    let number = this.numberLoadedMessages + 10;
    this.showMessages(0, number);
    this.numberLoadedMessages = number;
  }

  signUp(event) {
    event.preventDefault();
    const signUpLogin = document.getElementById('sign-up-login'); 
    const signUpPassword = document.getElementById('sign-up-password'); 
    const confirmPassword = document.getElementById('sign-up-confirm'); 

    if (users.filter(item => item.user === signUpLogin.value).length === 1) {
      signUpLogin.style.border = 'var(--border-error)';
      document.getElementById('error-login').style.display = "inline";
    }

    else if (!signUpLogin.value || signUpLogin.value === ' ') {
      console.log('1 Error');
      signUpLogin.style.border = 'var(--border-error)';
      signUpPassword.style.border = 'var(--border-error)';
      confirmPassword.style.border = 'var(--border-error)';
      document.getElementById('error-empty').style.display = "inline";
    }
  
    else if (!signUpPassword.value || !confirmPassword.value || signUpPassword.value !== confirmPassword.value) {
      console.log('2 Error');
      signUpPassword.style.border = 'var(--border-error)';
      confirmPassword.style.border = 'var(--border-error)';
      document.getElementById('error-empty').style.display = "none";
      document.getElementById('error-not-match').style.display = "inline";
    } 

    else {
      const values = {};
      values.user = signUpLogin.value;
      values.password = signUpPassword.value;
      users.push(values);
      messageList.user = signUpLogin.value;
      controller.setCurrentUser(messageList.user);
      controller.defaultPage();
      messageList.save();
    }
  }
    
  signIn() {
    const signInLogin = document.getElementById('sign-in-login'); 
    const signInPassword = document.getElementById('sign-in-password'); 

    if (users.filter((item) => item.user === signInLogin.value).length !== 1) {
      signInLogin.style.border = 'var(--border-error)';
      signInPassword.style.border = 'var(--border-error)';
    }
    else if (users.filter( item => item.user === signInLogin.value === 1)) {
      let values = users.filter( item => item.user === signInLogin.value);
      signInLogin.style.border = 'var(--error-color)';
      if (values[0].password === signInPassword.value) {
        console.log('Match');
        document.getElementById('authorization-container').style.display = "none";
        this.user = signInLogin.value;
        this.setCurrentUser(this.user);
        this.defaultPage();
        messageList.save();
      }
      else {
        signInPassword.style.border = 'var(--border-error)';
        document.getElementById('error-message').style.display = "inline";
        console.log('Incorrect password.');
      }
    }
  }
};

class ChatApiService {
  constructor(url) {
    this.url = url;
    this._users = null;
  }

  set url(url) {
    this._serverURL = url;
  }

  get url() {
    return this._url;
  }

  getMessages() {
    let headers = new Headers();
    headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    fetch(`${this.url}messages?skip=0&top=10`, {
      method: "GET",
      headers: headers,
    })
      .then( data => {
        return data.json();
      })
      .then( messages => {
        messagesView.display(messages, user);
        localStorage.setItem("messages", JSON.stringify(messages));
      });
  }

  getUsers() {
    const url = `${this.url}/users`;
    return fetch(url)
    .then( response => {
      return {
        status: response.status,
        result: response.json()
      }
    });
  }

}

const messageList = new MessageList([
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:00'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:05'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:00:07'),
    author: 'Anna',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:01:00'),
    author: 'Elon',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:01:08'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:02:00'),
    author: 'Anna',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:05:00'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:05:02'),
    author: 'Alice',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T20:07:03'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:00:00'),
    author: 'Anna',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:05:00'),
    author: 'Elon',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:05:10'),
    author: 'Max',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:06:00'),
    author: 'Anna',
    isPersonal: true,
    to: 'Alice',
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T21:07:01'),
    author: 'Tom',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:04:09'),
    author: 'Alexander',
    isPersonal: true,
    to: 'Alice',
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:05:00'),
    author: 'Anna',
    isPersonal: true,
    to: 'Tom',
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:08:07'),
    author: 'Max',
    isPersonal: false,
  },
  //invalid message
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:00'),
    author: 'Anna',
    isPersonal: true,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:03'),
    author: 'Anna',
    isPersonal: false,
  },
  {
    id: generatorId(),
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    createdAt: new Date('2020-10-12T22:09:07'),
    author: 'Anna',
    isPersonal: false,
  }
]); 
const users = [{user: 'Anna', password: '777'}];

const controller = new ChatController();

controller.setCurrentUser();
controller.showActiveUsers(this.userList);
controller.showMessages();

const btnLoadMessages = document.getElementById("btn-load-messages");
btnLoadMessages.addEventListener('click', () => {controller.loadMoreMessages()});

const btnRegistrationForm = document.getElementById('registration-form');
btnRegistrationForm.addEventListener('submit', controller.signUp);

const btnSignInHeader = document.getElementById("btn-sign-in");
btnSignInHeader.addEventListener('click', controller.moveToLoginPage);
const linkSignIn = document.getElementById("link-sign-in");
linkSignIn.addEventListener('click', controller.moveToLoginPage);

const btnSignOut = document.getElementById("btn-sign-out");
//btnSignOut.addEventListener('click', controller.returnToChatPage2);

const linkSignUp = document.getElementById("link-sign-up");
linkSignUp.addEventListener('click', controller.moveToRegistrationPage);

const linkBackToChat = document.getElementById("back-link-signin");
linkBackToChat.addEventListener('click', controller.returnToChatPage);
const linkBackToChat2 = document.getElementById("back-link-signup");
linkBackToChat2.addEventListener('click', controller.returnToChatPage);

const reset = document.getElementById("btn-reset");
reset.addEventListener('click', controller.reset);