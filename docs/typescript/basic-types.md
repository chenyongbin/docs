# 基本类型

## Boolean

布尔类型，示例：

```ts
let isDone: boolean = false;
```

## Number

数值类型，支持十六进制、十进制，还有二进制和八进制，示例：

```ts
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

## String

字符串类型，可以使用单引号、双引号，也支持模板字符串，示例：

```ts
let color: string = "blue";
```

## Array

数组，表示一组相同类型的数据。有两种定义数组的方式：

```ts
// 方式一
let list1: number[] = [1, 2, 3];
// 方式二
let list2 = Array <number> = [1, 2, 3];
```

## Tuple

元数组，表示一组固定长度、固定类型、且各元素类型不同的数据。示例：

```ts
let x: [string, number] = ["bin", 12];
```

## Enum

枚举类型，类似于`C#`中的枚举，默认情况下，首个成员的值是 0，后面成员的值依次递增。也可以手动设置各个成员的值。示例：

```ts
enum Color {
  Greeen,
  Red,
  Blue
}
```

## Any

任意类型，typescript 中最宽松的一个类型，表示一个未知的类型。在处理动态内容和第三方库时，使用该类型可以退出编译期间的类型检查。示例：

```ts
let list: any:[] = [1,2,'chen'];
```

## Void

空类型，表示没有任何数据

## Null and Undefined

`null`和`undefined`都有各自同名的类型，和`void`类型一样，默认情况下，这三个类型是其它类型的子类型，但是在使用`--strictNullChecks`标志后，这三个类型就只能赋值给`any`类型以及它们各自的类型了。

## Never

永不发生类型，表示永远不会发生的类型。该类型是任何类型的子类型，可以将该类型的值赋值给任何类型，但除了它本身以外的其它任何类型的数值都不能赋值给`never`类型，连`any`类型也不行。

示例：

```ts
// Function returning never must have unreachable end point
function error(message: string): never {
  throw new Error(message);
}

// Inferred return type is never
function fail() {
  return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

## Object

对象类型，代表那些非元数据类型的类型。

## 类型断言

有时候，当你知道某个变量更加具体的类型，可以使用类型类型断言。类型断言就像是其它语言里的类型转换，但没有做任何特殊的检查和数据解构。

类型断言有两种方式，示例：

```ts
// 方式一，尖括号形式
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 方式二：as操作符
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```  

*注意：在使用JSX时，不能使用尖括号方式的类型断言，因为React组件也是使用尖括号的，会造成混淆。*