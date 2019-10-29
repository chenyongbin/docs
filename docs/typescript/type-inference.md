# 类型推断

## 基本

在初始化变量和成员、设置参数默认值，决定函数返回类型时，可以根据值简单推断出类型。

```ts
let x = 3;
function setName(name = "Lucy") {}
function getAge() {
  return 12;
}
```

## 最优常用类型

从几个表达式中推断出类型的原则是，找到一个**最优常用类型**。算法就是考虑每个类型，然后找出能兼容其它所有候选类型的类型。

如果找不到一个能兼容所有候选类型的类型，那么就返回这些类型的联合类型。

```ts
let zoo = [new Rhino(), new Elephant(), new Snake()];
// 如果没有能兼容所有类型的类型，只能返回联合类型
(Rhino | Elephant | Snake)[]
```

## 上下文类型

`TypeScript`还可以所处位置推断出类型。

```ts
window.onmousedown = function(mouseEvent) {
  console.log(mouseEvent.button); //<- OK
  console.log(mouseEvent.kangaroo); //<- Error!
};
```

但是像下面这样，所处位置没有上下文类型时，`TypeScript`就推断不出具体类型，此时参数会有一个默认类型`any`，但是假如你配置了编译选项`--noImplicitAny`，会直接报错。

```ts
const handler = function(uiEvent) {
  console.log(uiEvent.button); //<- OK
};
```

可以直接设置参数为`any`类型，绕过编译检查。

```ts
const handler = function(uiEvent: any) {
  console.log(uiEvent.button); //<- OK
};
```
