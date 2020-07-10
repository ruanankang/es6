/**
 * 对象扁平化
 * 要点：递归，将key保存在数组中，递归的底层用一个对象接收值
 */

let entry = {
  a: {
    b: {
      c: {
        dd: 'abcdd'
      }
    }
  },
  d: {
    xx: 'adxx'
  },
  e: [1, 2]
}

function flattenObject(obj, keysArr = [], keyValue = {}) {
  if (typeof obj !== 'object' || Array.isArray(obj)) return;
  for (let key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keysArr.push(key);
      flattenObject(obj[key], keysArr, keyValue);
      keysArr = [];
    } else {
      keysArr.push(key);
      keyValue[keysArr.join('.')] = obj[key];
    }
  }
  return keyValue;
}

console.log(flattenObject(entry));