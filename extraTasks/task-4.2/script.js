'use srict'

function add(x, y) {
  if (y) {
    return x + y;
  }
  return (z) => x + z;
}

function sub(x, y) {
  if (y) {
    return x - y;
  }
  return (z) => z - x;
}

function mul(x, y) {
  if (y) {
    return x * y;
  }
  return (z) => x * z;
}

function div(x, y) {
  if (y) {
    return x / y;
  }
  return (z) => z / x;
}

function pipe(...arg) {
  return (y) => {
    let a = y;
    for (let i = 0; i < arg.length; i++){
      a = arg[i](a);
    }
    return a;
  };
}

console.log('Call a function "add" with 2 parameters 6 and 8: ', add(6, 8));
console.log('Call a function "sub" with 2 parameters 14 and 8: ', sub(14, 8));
console.log('Call a function "mul" with 2 parameters 8 и 6: ', mul(6, 8));
console.log('Call a function "div" with 2 parameters 48 и 6: ', div(48, 6));
console.log('Call a function "add" with add(6) and 8: ', add(6)(8));
console.log('Call a function "add" with sub(6) and 14: ', sub(6)(14));
console.log('Call a function "mul" with mul(6) and 8: ', mul(6)(8));
console.log('Call a function "div" with div(6) and 48: ', div(6)(48));
console.log('Call a function "pipe": ', pipe(add(1),mul(2))(3));