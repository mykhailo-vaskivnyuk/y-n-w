import fs from 'node:fs';
const file = fs.readFileSync(__filename);
console.log(file.toString())

const arr = new Array(5).fill(0);
console.log(arr);

// Array.prototype.myMethod = () => console.log('myMethod');
// const newArr = new Array(1);
// newArr.myMethod();

export = { arr };
