/**
 * 数组扁平化：将多维数组变成一维数组
 * 方法：递归  toString  扩展运算符...
 */

let originArr = [1, [1, 2, 3],
  [4],
  [
    [2, [2], 3], 1
  ]
];

// 递归
function flattenArray1(arr) {
  let newArr = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      newArr = newArr.concat(flattenArray1(item));
    } else {
      newArr.push(item);
    }
  })
  return newArr;
}

// toString
function flattenArray2(arr) {
  return arr.toString().split(',').map(item => {
    return parseInt(item);
  });
}

// 扩展运算符
function flattenArray3(arr) {
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

console.log(flattenArray3(originArr));