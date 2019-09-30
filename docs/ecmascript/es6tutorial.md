# ECMAScript6 入门

> 作者：阮一峰

## 目录

- [第 1 章：let 和 const 命令](#letandconstcmd)
- [第 2 章：变量的解构赋值](#destructuringandassignment)
- [第 3 章：字符串的扩展](#stringextension)

<h2 id='letandconstcmd'>let和const命令</h2>

ES5 只有`var`和`function`两种声明变量的方法。ES6 新增了`let`和`const`两个新命令，再加上后面会讲到的`import`和`class`命令，ES6 现在有 6 种声明变量的命令。

`let`命令和`var`命令类似，区别点就是`var`命令有变量提升，而`let`命令只会在它所在的代码块有效。

另外，在 for 循环语句中，`let`命令在声明变量部分是父作用域，而循环体内是子作用域。

在块级作用域使用`let`命令声明变量前，都不能访问该变量，否则会报错，这称之为**暂时性死区**(_temporal dead zone，简称 TDZ_)。暂时性死区意味着`typeof`命令不再是百分百安全的操作。

`let`不允许在同一作用域，重复声明同一个变量。

`let`实际上为 JavaScript 新增了块级作用域。ES6 引入了块级作用域，明确允许在块级作用域中声明函数，还明确规定在块级作用域中声明函数类似于使用`let`。_ES6 在附录 B 中规定，浏览器可以不遵守这些规定，所以最好在块级作用域内使用函数表达式声明函数。_

`const`声明的是一个只读常量。一旦声明，常量的值就不会改变。对于简单类型，等同于常量。对于引用类型，保证的是存储那个指向实际数据的指针不变。

<h2 id='destructuringandassignment'>解构赋值</h2>

ES6 允许按照一定的模式，从数组和对象中提取值，对变量进行赋值，这被称之为解构。

解构的本质是“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。

解构的规则是，只要等号右边的值不是对象或数组，就先将其转换为对象。由于`undefined`和`null`无法转为对象，所以对它们进行解构赋值，都会报错。

数组的解构规则是，按顺序匹配等号右边的数据。只要左边模式至少匹配右边的一部分，且等号右边是数组那么解构就会成功。如果右边不是数组（_或者严格来说不是可遍历结构，即没有实现了`Symbol.iterator`属性_），会报错。

对象的解构规则是，按照属性名匹配等号右边的数据。

字符串是一个类似数组的对象，所以可以按照数组的规则进行解构赋值，又因为其包含一个 length 属性，也可以对这个属性进行解构赋值。

对布尔值合适数值解构赋值时，会先将等号右边的值转换为基本包装类型，然后再和等号左边的模式匹配赋值。

解构赋值允许设置默认值，设置规则是等号右边匹配的项全等于`undefined`时，等号左边的变量取默认值。

<h2 id='stringextension'>字符串的扩展</h2>

JavaScript 内部，字符以 UTF-16 格式存储，每个字符固定 2 个字节，对于那些需要 4 个字节存储的字符（Unicode 码点大于`0xFFFF`），JavaScript 会认为它们是两个字符。

ES6 加强了对 Unicode 字符的支持，把码点放进大括号内，就能正确解读四个字节的字符。如：

```javascript
"\u{20BB7}";
```

JavaScript 不能处理 4 个字节的字符，会将字符串长度误判为 2。而且原有的`charAt`和`charCodeAt`无法读取整个字符。ES6 提供了如下方法处理 4 个字节的字符：

- `codePointAt(int index):int`，读取字符串中每个字符的码点，参数是字符在字符串中的位置
- `String.fromCodePoint(...args):string`，从码点返回对应的字符，弥补`String.fromCharCode`不能识别大于`0xFFFF`码点的缺憾

若字符串只有一个字符，但是占 4 个字节，`for`循环会认为它包含两个字符，且都不可打印，`for...of`循环会正确识别出字符串是一个字符。

除了`indexOf`函数，ES6 提供了如下 3 个方法确定一个字符串是否包含另一个字符串：

- `includes(string searchString,int position):boolean`，是否找到参数字符串，第二个参数表示查找的起点
- `startsWith(string searchString,int position):boolean`，参数字符串是否在原字符串头部，第二个参数表示查找的起点
- `endsWith(string searchString,int position):boolean`，参数字符串是否在原字符串尾部，第二个参数表示针对原字符串前`position`个字符

下面是上面 3 个方法的兼容性方法：

```javascript
// 包含
function includes(targetString, searchString, position) {
  if (typeof String.prototype.includes == "function") {
    return targetString.includes(searchString, position);
  }

  if (position > 0) {
    targetString = targetString.substr(position);
  }
  var regexp = new RegExp(searchString);
  return regexp.test(targetString);
}

// 以***开始
function startsWith(targetString, searchString, position) {
  if (typeof String.prototype.includes == "function") {
    return targetString.includes(searchString, position);
  }

  if (position > 0) {
    targetString = targetString.substr(position);
  }
  var regexp = new RegExp("^" + searchString);
  return regexp.test(targetString);
}

// 以***结束
function endsWith(targetString, searchString, position) {
  if (typeof String.prototype.includes == "function") {
    return targetString.includes(searchString, position);
  }

  if (position > 0) {
    targetString = targetString.substr(0, position);
  }
  var regexp = new RegExp(searchString + "$");
  return regexp.test(targetString);
}
```

`repeat(int n):string`，这个方法返回一个新字符串，表示将原字符重复`n`次。该方法有一些规则如下：

- 参数是负数或`Infinity`，会报错
- 如果是小数，会用`Math.floor()`函数向下取整
- 如果是 0 到-1 之间的数，则等同于 0
- 参数 NaN 等同于 0
- 如果参数是符串，先转换为数字

ES2017 引入了两个补全字符串功能，如果某个字符串不够指定长度，会在头部或尾部补全。

- `padStart(int maxLength,string fillString):string`，补全头部
- `padEnd(int maxLength,string fillString):string`，补全尾部

这两个方法都会接收两个参数：第一个参数表示最大长度，第二个参数是用来补全的字符串。补全规则如下：

- 如果原字符串长度大于或等于最大长度，则字符串不补全，返回原字符串
- 如果原字符串+补全字符串>最大长度，则会截去超出位数的补全字符串
- 如果省略第 2 个参数，默认以空格补全长度

下面是这两个方法的兼容性版本：

```js
// 补全开始部分
function padStart(originalString, maxLength, fillString) {
  if (typeof String.prototype.padStart == "function") {
    return originalString.padStart(maxLength, fillString);
  }

  if (originalString.length >= maxLength) {
    return originalString;
  }

  if (typeof fillString == "undefined") {
    fillString = " ";
  }
  fillString += "";
  while ((fillString + originalString).length < maxLength) {
    originalString = fillString + originalString;
  }
  return (
    fillString.substr(0, maxLength - originalString.length) + originalString
  );
}

// 补全结束部分
function padEnd(originalString, maxLength, fillString) {
  if (typeof String.prototype.padEnd == "function") {
    return originalString.padEnd(maxLength, fillString);
  }

  if (originalString.length >= maxLength) {
    return originalString;
  }

  if (typeof fillString == "undefined") {
    fillString = " ";
  }
  fillString += "";
  while ((fillString + originalString).length < maxLength) {
    originalString += fillString;
  }
  return (
    originalString + fillString.substr(0, maxLength - originalString.length)
  );
}
```

模板字符串是增强版的字符串，用反引号标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中定义变量。

标签模板不是函数，而是函数调用的一种特殊形式。基本使用方式如下：

```js
tag`Welcome ${customerName}`;
```

换成正常调用方式，是像如下这种：

```js
function tag(literals, ...values) {}
```

其中变量`literals`是一个数组，是将上面模板字符串以占位符为分隔符分割后的文本数组，而后面的 reset 数组，表示模板字符串中的占位符里的变量。
