import { uniq } from "lodash"; //导入lodash中指定模块
import lodash from "lodash"; //导入lodash全部模块
import sscode from "./src/config.js"; //匿名导入，可以自定义模块名称
import { apiKey, name, getAge } from "./src/config.js"; //命名导入，必须用大括号且模块名称和模块导出时名称一致，多个命名模块导入时，用逗号隔开

import User, { createURL, gravatar } from "./src/users.js";

const arr = [1, 2, 2, 3, 3, 5, 8, 4];

console.log(uniq(arr));
console.log(sscode, apiKey, name);

console.log(getAge());

// 练习实例
const Bob = new User('Bob', '157@bob.com');
const BobUrl = createURL(Bob.name);
const avatar = gravatar(Bob.email);

console.log(Bob, BobUrl, avatar);
