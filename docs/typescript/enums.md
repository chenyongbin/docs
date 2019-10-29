# 枚举

枚举可以用来定义一系列具名的常量，用一种更加友好的方式表达意图。枚举支持**数值**和**字符串**两种类型。

## 数值枚举

数值枚举定义很简单，示例如下：

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

枚举的每个成员都有确定的数值，第一个成员默认初始化为 0，后面的每一个成员，都会在前一个成员值的基础上自动加 1。

当然，也可以显示为每个成员指定不同的数值。

```ts
enum Direction {
  Up = 2,
  Down,
  Left = 34,
  Right
}
```

_注意：同一个枚举中，每个成员的值都是不同，否则会有意外的错误。_

## 字符串枚举

字符串枚举和数值枚举很相似，但不同的是字符串枚举每个成员必须使用字符串字面量或者其它枚举的值初始化。

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}
```

_字符串枚举尽管没有数值枚举自动增加值的特性，但语义更好，且支持运行时序列化。_

## 异质枚举

尽管从技术上讲，枚举中可以存在值为数值和字符串的成员，但尽量不要这么用。

```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES"
}
```

## 计算成员和常量成员

枚举成员的值分为两种：**常量**和**可计算的**。

**常量成员**包括：

- 是第一个成员，且没有初始值，默认会赋值 0
- 没有初始值，且前面的成员是数值常量，该成员的值是前面成员的值加 1
- 使用**常量枚举表达式**初始化

常量枚举表达式表示在编译期间就可以求值的表达式，包含以下情况：

- 一个字面量枚举表达式，基本上是字符串字面量或数值字面量
- 一个已定义枚举常量成员
- 圆括号常量表达式
- 使用了`+`、`-`或`~`一元操作符的常量表达式
- 使用了`+`、`-`、`*`、`/`、`%`、`<<`、`>>`、`>>>`、`&`、`|`、`^`二进制操作符的常量表达式

_注意：常量枚举表达式求值结果是`NaN`或`Inifity`时，编译器会报错。_

**计算成员**包括：
除了上述情况以外的其它情况，都可以成为成员是可计算的。

```ts
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length
}
```

## 联合枚举和枚举成员类型

常量枚举成员中有一个特殊子集：**字面量枚举成员**。所谓字面量枚举成员就是指没有初始值，或者值被初始化为如下的值：

- 任何的字符串字面量，例如`'foo'`
- 任何数值字面量，例如`100`
- 应用了一元减号的数值字面量，例如`-100`

针对**字面量枚举成员**，会有一些特殊的语义：

- 枚举成员的值可以作为类型使用
- 枚举类型自己实际上可以作为联合类型使用

枚举成员作为类型示例：

```ts
enum ShapeKind {
  Circle,
  Square
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square, // Error! Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
  radius: 100
};
```

枚举类型作为联合类型示例：

```ts
enum E {
  Foo,
  Bar
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    //             ~~~~~~~~~~~
    // Error! This condition will always return 'true' since the types 'E.Foo' and 'E.Bar' have no overlap.
  }
}
```

## 运行时的枚举

运行时，枚举是作为真实的对象存在的。

```ts
enum E {
  X,
  Y,
  Z
}
function f(obj: { X: number }) {
  return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

## 编译时的枚举

**数值枚举**类型经编译后，会按照`name` -> `value`和`value` -> `name`的方向定义对象属性。

```ts
// 声明枚举
enum Color {
  Red,
  Blue
}

// 编译后的对象
var Color;
(function(Color) {
  Color[(Color["Red"] = 0)] = "Red";
  Color[(Color["Blue"] = 1)] = "Blue";
})(Color || (Color = {}));
```

所以，可以将**数值枚举**当作对象使用，枚举成员的名称和值都可以作为对象的属性使用。

_注意：字符串枚举编译后，没有上述反向映射。_

## 常量枚举

常量枚举是指成员都是常量枚举表达式，且不会在编译时生成对象的类型。使用示例：

```ts
const enum Enum {
  A = 1,
  B = A * 2
}
```

常量枚举会直接内联到用户使用的地方。

```ts
const enum Directions {
  Up,
  Down,
  Left,
  Right
}

// 声明处
let directions = [
  Directions.Up,
  Directions.Down,
  Directions.Left,
  Directions.Right
];
// 最终生成的代码
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

## 外部枚举

```ts
declare enum Enum {
  A = 1,
  B,
  C = 2
}
```
