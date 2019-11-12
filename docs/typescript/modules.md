# 模块

> **关于术语的注意点**：请务必注意，在 TypeScript1.5 中，术语已更改。“内部术语”现在是命名空间，“外部术语”现在是模块，正如[`ECMAScript 2015`](http://www.ecma-international.org/ecma-262/6.0/)术语一致，（也就是说，`module x`和现在首选的`namespace x`一样）。

## 介绍

从 ECMAScript 2015 开始，JavaScript 有了模块概念，TypeScript 共享此概念。

模块在它自己的作用域而不是全局作用域执行，这意味着一个模块内的变量、函数、类等等在模块外不可见，除非显示使用`export`格式导出它们。反过来，为了使用一个不同模块内的变量、函数、类和接口等等，必须使用`import`格式导入。

模块是声明性的，模块间的关系是根据文件级别的导入和导出指定的。

模块使用一个模块加载器另一个模块。在运行时，该加载器负责定位和执行所有依赖。JavaScript 中众所周知使用的模块加载器有：用于`CommonJS`模块的**NodeJs**加载器，和 Web 应用程序中用于`AMD`模块的**RequireJS**加载器。

在 TypeScript 中，正如 ECMAScript 2015 一样，任何顶层包含`import`和`export`的文件都可被视为模块。反过来顶层没有`import`和`export`的文件被视为全局可用的脚本。

## export

```ts
// 基本导出
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
// 导出并命名别名
export { StringValidator as StrValidator };
// 转发
export { FuncA } from "./otherModule";
// 转发所有
export * from "./otherModule";
```

## import

```ts
// 导入单个变量
import { varA } from "./otherModule";
// 导入函数并重命名
import { mathAdd as add } from "./otherModule";
// 导入整个模块
import * as MathCaculator from "./otherModule";
```

尽管实际上不推荐，一些模块会设置一些其它模块可用的全局状态。这些模块或许没有任何导出，或者消费者不关心它的任何导出。导入这些模块的用法是：

```ts
import "./otherModule";
```

## Default exports

每个模块都可以导出一个带有`default`关键字的导出，该导出称之为默认导出。每个模块只有一个默认导出，其导入方式也不同。

```ts
// a.ts
interface A {}
export default A;

// b.ts
import A from "./a";
```

## `export =`和`import = require()`

CommonJS 和 AMD 格式的模块都有一个`exports`对象包含模块的所有输出。TypeScript 支持使用`export =`塑造传统的 CommonJS 和 AMD 工作流程。

`export =`指定了一个模块要导出的单个对象，可以是类、接口、函数、命名空间或枚举。

与`export =`对应的导入指令是`import module = require("module")`

```ts
// ZipCodeValidator.ts #
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;

// Test.ts
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(
    `"${s}" - ${validator.isAcceptable(s) ? "matches" : "does not match"}`
  );
});
```

## 加载可选模块及其他高级场景

暂无

## 与其他 JavaScript 库合作

为了描述没有使用 TypeScript 库的形状，需要声明这些库暴露的 API。我们称那些只有声明没有实现的为“外围”，这些声明定义通常在`.d.ts`文件内。

除了把声明放在各自文件外，把所有的声明放在一个文件内更方便。示例如下：

```ts
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

定义了上述声明后，可以使用三斜杠指令引入该声明。

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

如果不想把在使用外围模块声明前就声明，可以使用一种快捷声明方式。

```ts
// 声明
declare module "hot-new-module";
// 使用，注意此时的y是any类型
import x, { y } from "hot-new-module";
x(y);
```

还可以使用通配符的形式添加声明。

```ts
declare module "*!text" {
  const content: string;
  export default content;
}
// Some do it the other way around.
declare module "json!*" {
  const value: any;
  export default value;
}
```

使用时

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

## 结构模块指南

### 尽可能地在顶层导出

- 导出应尽可能地简洁，涉及的层级应该尽可能地少。
- 命名空间会增加额外的层，类的静态方法也会增加嵌套的层。
- 如果只是想导出单个类、方法，应使用`export default`

### 重新导出扩展模块

扩展模块的最好方式是在不改变源模块，只是增加新的功能，并重新导出  

### 不要在模块中使用命名空间  

如题  
