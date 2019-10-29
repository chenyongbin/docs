# 类型兼容性

`TypeScript`中的类型兼容性基于结构子类型。结构类型是一种仅仅关联成员，而不是名义类型的方式。

`TypeScript`的结构类型系统是根据 JavaScript 通常书写方式设计的。在 JavaScript 中，广泛使用了匿名对象，像函数表达式和对象字面量。因此使用结构类型系统代表 JavaScript 库中的关系种类就比名义类型更自然了。

## 开始

比较两个类型是否兼容的基本原则是，源类型中至少包含目标类型中的所有必需成员。

```ts
interface Target {
  name: string;
  age: number;
}

interface Source1 {
  name: string;
}

interface Source2 {
  name: string;
  age: string;
}

let src1: Source1 = { name: "source1" };
let src2: Souce2 = { name: "source2", age: 12 };
let p1: Target = src1; // 报错
let p2: Target = src2; // 正确
```  

_注意：比较流程会递归进行，浏览类型的每个成员及其子成员。_

## 比较两个函数

## 枚举

## 类

## 高级类型
