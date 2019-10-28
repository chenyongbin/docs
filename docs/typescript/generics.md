# 泛型

泛型是一种可以抽象参数类型的声明方式，简单示例如下：

```ts
// 原函数
function identity(arg: number): number {
  return arg;
}
// 泛型处理后的函数
function identity<T>(arg: T): T {
  return arg;
}
```

调用上述泛型函数时，有两种方式：一是完全按照函数声明传入所有参数，包括泛型类型，二是只传入参数值，因为编译器会根据传入值推断出泛型变量的类型。但是在复杂项目中，还是使用第一种方式为好。

```ts
// 传入所有参数
let output = identity<string>("myString"); // type of output will be 'string'
// 只传入参数值
let output = identity("myString"); // type of output will be 'string'
```

## 使用泛型类型

当使用泛型时，编译器会强制认为针对泛型的操作适用于任何类型。

## 泛型类型

泛型函数类型的声明方式同普通函数的声明方式差不多，只是多了一个尖括号的泛型类型变量声明。

```ts
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: <T>(arg: T) => T = identity;
```

接口中也可以使用泛型，声明方式如下：

```ts
interface GenericIdentityFn {
  <T>(arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: GenericIdentityFn = identity;
```

使用泛型声明了的接口，接口中所有成员都可以使用该泛型类型。

## 泛型类

同泛型接口一样，也可以使用泛型声明类。同样地，使用泛型声明过的类，所有成员都可以使用该泛型类型。

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};
```

_注意：泛型类中泛型只应用在类的实例成员，类的静态成员不能使用。_

## 泛型约束

泛型可以设置约束条件，表示泛型类型只能做某些事情，以便精确定位泛型类型。

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}

loggingIdentity(3); // Error, number doesn't have a .length property
loggingIdentity({ length: 10, value: 3 }); // ok
```

假如声明中有多个泛型类型，泛型类型之间可以相互指定约束。

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```
