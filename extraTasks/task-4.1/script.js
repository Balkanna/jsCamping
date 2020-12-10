'use strict';

class List {
  constructor() {
    this.head = null;
    this.length = 0;
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

add(value) {
  let node = new Node(value);

  if (this.length === 0) {
    this.head = node;
  } else {
    let current = this.head;
    while(current.next) {
      current = current.next;
    }
    current.next = new Node(value);
  }
  this.length++;
}

