let orignObj = {
  name: 'Bob',
  age: 37,
  son: {
    name: 'Allen',
    age: 8
  },
  work() {
    console.log('workwork')
  }
}

// assign浅拷贝，对象属性不行
// let newObj = Object.assign(orignObj);

// 扩展运算符浅拷贝
// let newObj = {...orignObj };

// JSON可以实现部分深拷贝，对函数属性会报错，不符合json规范
// let newObj = JSON.parse(JSON.stringify(orignObj));

// 深拷贝算法
Object.prototype.deepClone = function() {
  const _this = this;
  if (typeof _this !== 'object') return;
  let newObj = Object.prototype.toString.call(_this) === '[Object Array]' ? [] : {};
  Object.keys(_this).forEach(key => {
    if (_this.hasOwnProperty(key)) {
      newObj[key] = typeof _this[key] === 'object' ? _this[key].deepClone() : _this[key];
    }
  })
  return newObj;
}


let newObj = orignObj.deepClone();

newObj.son.age = 10;

console.log(orignObj, newObj);