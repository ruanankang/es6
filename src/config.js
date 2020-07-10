const code = 'code123';
export default code; // 默认导出(匿名导出)，一个文件只能有一个默认导出

export const apiKey = 'apiKey456'; // 命名导出，一个文件可以有多个命名导出
export const name = 'Tom';
export const age = 18;

// export {apiKey as Key, name, age} // 全部导出, as 可以重命名，导入模块时要用重命名之后的名称

export function getAge() {
  return age;
}

// 练习实例
export const url = "https://codecast.com";
