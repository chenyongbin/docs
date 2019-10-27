# 接口

`typescript`的核心原则就是类型检查关注的是值的结构。在这里，接口负责命名一些类型，定义项目内外的代码协议。

一个简单的示例：

```ts
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

上面的示例代码就表示接口`LabelValue`定义了方法`printLabel`的需要的参数类型。

## 可选属性

通常情况下，接口的属性都是必需的。但也有一些属性是可选的情况，这时可以在接口中定义可选属性，格式如下：

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

## 只读属性

可以在属性名称前添加`readonly`关键字使其成为只读属性，示例如下：

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}
```

如同字面意思所描述的一样，只读属性只可以在声明时赋值，以后再次赋值会报错。

`typescript`自带了一个类似数组的只读类型`ReadonlyArray<T>`，该类型和数组类型不一样的地方是它去掉了所有可修改数据的方法。

_判断是使用 readonly 还是 const 的方法是：属性使用 readonly，变量使用 const。_

## 过度类型检查

看如下的示例：

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

传入方法中的参数，包含了参数接口不包含的属性，在纯 JavaScript 中，这部分代码会悄悄地失败。但是在`typescript`中这会报错。因为 typescript 会对对象字面量做特殊处理。当一个对象字面量赋值给一个接口，会经历*过度属性检查*，即其包含的所有属性必需是目标类型包含的，如果不是就会报错。

绕过这些检查的方法有三种：

```ts
// 使用类型断言
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// 使用索引属性
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}

// 将对象字面量赋值给一个对象变量，然后将对象变量作为参数传入
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

## 函数类型

接口不但能描述属性，还可以描述函数类型。在接口中描述函数类型时，就像声明一个函数一样只包含参数列表和返回类型，示例如下：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

在初始化函数类型时，可以完全按照函数声明写一遍，也可以使用不一样的参数名称，还可以不写参数类型和返回类型。

```ts
// 完全按照声明写一遍
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string): boolean {
  let result = source.search(subString);
  return result > -1;
};

// 使用不同的参数名称
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};

// 不写参数类型和返回类型
let mySearch: SearchFunc;
mySearch = function(src, sub) {
  let result = src.search(sub);
  return result > -1;
};
```

## 索引类型

就像纯 JavaScript 中使用`[]`定义、访问动态属性一样，`typescript`中也有一个类似的属性，那就是*索引属性*。

索引属性需要指定索引类型以及索引返回类型的。示例如下：

```ts
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

索引类型只支持两种：`number`和`string`。有一点要注意的是，`number`的索引返回类型必需是`string`索引返回类型的自类型。因为当使用`number`类型索引时，JavaScript 实际上是将其转换为了`string`类型。

当使用`string`类型索引时，接口的其它属性类型必需匹配`string`类型索引的返回类型。这时因为`obj.property`和`obj["property"]`这两种访问属性的方式的作用是相同的。所以会有下面的示例中的错误：

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok, length is a number
  name: string; // error, the type of 'name' is not a subtype of the indexer
}
```

但是如果`string`类型索引的返回类型是个联合类型，就不会报错了：

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

## 类

就像其它像`C#`和`Java`语言一样，类可以实现接口，示例：

```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

接口只会描述类的公共部分，而不是负责私有部分。

## 扩展接口

和类一样，接口可以相互扩展。一个接口可以扩展多个接口，示例：

```ts
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## 接口扩展类

当接口扩展一个类时，它继承了类的所有成员，但不包括它们的实现。接口也继承了类的私有和保护成员，这就意味着，只有类及类的子类才能实现该接口。

```ts
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
  private state: any;
  select() {}
}

class Location {}
```
