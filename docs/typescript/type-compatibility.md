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

比较两个函数是否兼容的条件，就是比较参数和返回值。

**比较参数**时，只要源函数的所有参数都能在目标参数中找到一一对应参数（只比较参数类型，不关心参数名称），那么就表示参数是兼容的。

```ts
let x = (a: number) => 0;
let y = (a: number, b: string) => 0;
x = y; // 不兼容
y = x; // 兼容
```

**比较返回值**时，只要目标函数返回值所有的参数，都能在源参数中找到一一对应的参数，就表示返回值是兼容的。

```ts
let x = () => ({ name: "Lucy" });
let y = () => ({ name: "Lily", age: 23 });
x = y; // 兼容
y = x; // 不兼容
```

### 函数参数二元性

当比较函数参数时，如果源参数可以赋值给目标参数或反之，赋值就会成功。这种函数是不可靠的，因为会出现函数声明时有一个比较特殊的参数，但调用时传入的是一个不太特殊的参数。实际上，这种错误很少发生，并且允许这种情况能够使很多常见 JavaScript 范式成为可能。

```ts
enum EventType {
  Mouse,
  Keyboard
}

interface Event {
  timestamp: number;
}
interface MouseEvent extends Event {
  x: number;
  y: number;
}
interface KeyEvent extends Event {
  keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}

// 不稳健，但有用且常见
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + "," + e.y));

// 为了稳健性而传入的不太期望的替代参数
listenEvent(EventType.Mouse, (e: Event) =>
  console.log((e as MouseEvent).x + "," + (e as MouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MouseEvent) =>
  console.log(e.x + "," + e.y)) as (e: Event) => void);

// 完全错误、不兼容的参数
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

_注意：上面这些不稳健的写法，在使用`strictFunctionTypes`配置时，编译器会报错。_

### 可选参数和剩余参数

当比较函数兼容性时，可选和必需参数是可互换的。源类型额外的可选参数不是错误，目标类型的可选参数在源类型中没有一一对应参数也不是错误。

当一个函数有剩余参数时，被视为就好像有无限的可选参数。

这种情况从类型系统的角度来看可能是不可靠的，但从运行时的角度来看，可选参数没有被严格执行，因为在那个位置传入`undefined`适用于大多数函数。

### 函数重载

当一个函数有重载时，源类型的每一个重载必须在目标类型中找到一个兼容的重载。这会确保目标函数可以像源函数那样在同样的地方被调用。

## 枚举

枚举和数值相互兼容，但不同的枚举类型之间不兼容。

```ts
enum Color {
  red,
  blue
}

enum Direction {
  up,
  down
}

let c = Color.red; // OK
c = Direction.up; // Error
```

## 类

类的工作方式和对象字面量、接口很相似，但有一点例外：它同时包含静态部分和实例部分。当比较一个类的两个对象时，只会比较实例的成员。静态成员和构造函数不会影响兼容性。

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(numFeet: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

类中的私有和保护成员会影响它们的兼容性。当检查一个类实例的兼容性时，如果目标类型包含一个私有成员，那么源类型必须也包含一个源自相同类的私有成员。同样地，同样规则也适用于保护成员。这会允许一个类型和其父类兼容，但不兼容于来自不同集成层级而有相同结构的类。

## 泛型

因为`TypeScript`是类型结构系统，比较两个泛型兼容性时，不考虑类型参数是否兼容，而是比较赋值了类型参数后，泛型的结果是否兼容。

```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;
x = y; // OK
y = x; // OK
```

上面这个例子中，虽然两个变量的类型参数`T`不兼容，但由于接口没有成员，两个变量实际的结构是相同的，故两个变量相互兼容。但假如上面的接口有一个成员时，那么两个变量就不兼容了。

声明一个泛型变量时，如果没有指定泛型的类型参数，当比较变量时，会为其默认指定类型参数为`any`。

```ts
interface Empty<T> {
  d: T;
}
let x: Empty;
let y: Empty;
x = y; // OK
```

## 高级话题

到目前为止，我们已经使用“可兼容”这一`TypeScript`语言规范中没有定义的说法。实际上，在`TypeScript`中有两类兼容性：**子类**和**赋值**。它们的不同之处仅仅在于赋值用两个规则扩展了子类的兼容性：

- 任何类型的变量都可以和`any`类型的变量相互赋值
- 枚举类型的值可以和对应的数值相互赋值

在`TypeScript`语言中，根据不同的情况在不同的地方使用不同的兼容机制。出于实际目的，类型兼容性由赋值兼容性决定，即使在`implements`和`extends`子句情况下也是如此。
