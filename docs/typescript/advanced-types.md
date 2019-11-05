# 高级类型

- [交叉类型](#intersection-types)
- [联合类型](#union-types)
- [类型保护和区分类型](#type-guards-and-differentiating-types)
- [可空类型](#nullable-types)
- [类型别名](#type-aliases)
- [字符串字面量类型](#string-literal-types)
- [数值字面量类型](#numberic-literal-types)
- [枚举成员类型](#enum-memeber-types)
- [有区别的并集](#discriminated-unions-types)
- [多态 this 类型](#polymorphic-this-types)
- [索引类型](#index-types)
- [映射类型](#mapped-types)
- [条件类型](#conditional-types)

<h2 id='intersection-types'>交叉类型</h2>

交叉类型，使用符号`&`连接多个类型，从而形成一个新的类型。这个新类型包含连接所有类型的特性。

```ts
interface Loggable {
  log: (message: string) => void;
}

class Student {
  name: string = "";
}

let liLei: Student & Loggable;
lilei = { name: "LiLei" }; // 错误，缺少log方法
```

<h2 id='union-types'>联合类型</h2>

联合类型和交叉类型密切相关，但又有很大的不同。联合类型使用`|`符号分割几个不同的类型，组成新的新类型表示是前面定义的几个类型的其中一个。

```ts
function padLeft(value: string, padding: string | number) {
  // ...
}
```

<h2 id='type-guards-and-differentiating-types'>类型保护和区分类型</h2>

联合类型对于展示值可能接受的所有类型很有用。但是如何知道是否是某个确切的类型呢？一个常用的 JavaScript 习惯用法是通过访问成员是否存在，来检查类型。但是我们只能访问联合类型的公共成员，所以为了确定某个成员是否存在，还必须使用类型断言，将其转换为某个类型后，再检查某成员是否存在。

```ts
interface Bird {
  fly: () => void;
  layEggs: () => void;
}

interface Fish {
  swim: () => void;
  layEggs: () => void;
}

function getSmallPet(): Fish | Bird {
  // ...
  return { fly: () => {}, layEggs: () => {} };
}

let pet = getSmallPet();
pet.layEggs(); // okay
if ((pet as Fish).swim) {
  (pet as Fish).swim();
} // okay
```

## 用户定义的类型保护

注意前面我们使用了几次的类型断言。如果一旦我们执行了类型判断，就能在每个判断分支里知道值的确切类型，会好很多。

**类型保护**是一种执行运行时检查并确定某些作用域中的类型的表达式，下面是四种类型保护的方式。

### 使用类型谓语

类型谓语是定义类型保护的一种方式，格式是`parameterName is Type`，其中`parameterName`必须是当前函数签名中的参数。

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Both calls to 'swim' and 'fly' are now okay.
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

### 使用`in`操作符

`in`操作符现在扮演缩小类型的表达式，格式是`n in x`。其中`n`是个字符串字面量或字符串字面量类型，`u`是个联合类型。

```ts
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

### `typeof`操作符

对于`string`、`number`、`boolean`和`symbol`，可以使用`typeof`操作符判断类型。格式有两种：

- `typeof v === 'typename'`
- `typeof v !== 'typename'`

除了上面的四种基本类型，虽然`TypeScript`不会阻止你比较其它类型，但类型保护不会认出这些类型。

### `instanceof`操作符

同`typeof`操作符类似，`instanceof`操作符是一种使用构造函数缩小类型的表达式。`instanceof`操作符的右边必须是一个构造函数，`TypeScript`会按照下面的顺序缩小类型：

- 如果函数的`prototype`属性类型不是`any`，则类型是`prototype`
- 类型的构造函数签名返回的联合类型

<h2 id='nullable-types'>可空类型</h2>

`TypeScript`有两个特殊的类型`null`和`undefined`。它们有各自的值 null 和 undefined。默认情况下，类型检查器会认为它们可以赋值给任何类型。实际上`null`和`undefined`是每个类型的有效值。那就意味着你不能阻止它们赋值给任何类型，甚至当你想阻止的时候。

但是当你打开`--strictNullCheck`标志的时候，就不会出现上面的问题，也就是说当你声明一个变量，它不再自动包含`null`和`undefined`。

```ts
let s = "foo";
s = null; // error, 'null' is not assignable to 'string'
sn = undefined; // error, 'undefined' is not assignable to 'string'
```

你可以使用联合类型，为其添加`null`和`undefined`的类型。注意，为了`JavaScript`的语义，`TypeScript`视`null`和`undefined`为不同的值。也就是说，`string|null`、`string|undefined`和`string|null|undefined`是不同的类型。

```ts
let s: string | null = "foo";
s = null; // okay
s = undefined; // error
```

### 可选参数和属性

当开启了`--strictNullCheck`标志后，可选参数和属性自动添加`undefined`类型。

### 类型保护和类型断言

既然可空类型可以使用联合类型实现，那么你需要使用类型保护抛弃掉`null`。

```ts
function f(sn: string | null): string {
  return sn || "default";
}
```

<h2 id='type-aliases'>类型别名</h2>

类型别名为一个类型创建了新的名称。类型别名有时和接口相似，但可以为你想要的基本类型、联合类型和元数组以及其它任何类型命名，否则必须手写。

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === "string") {
    return n;
  } else {
    return n();
  }
}
```

类型别名实际上没有创建新的类型，它只是创建了一个指代那个类型的新名称。为基本类型创建别名基本没用，尽管它可以用来作为一种文档的格式。

**类型别名** `VS` **接口**

类型别名和接口有相似的地方，但也有细微的差别。

有一个区别的地方是接口会创建一个到处都可用的新名称，但类型别名不会。举例来说，在编译出错时，把鼠标放在接口名称上，编辑器会显示接口的名称；但是放在类型别名上，却返回对象字面量类型。

接口和类型别名相比，尽量使用接口。

<h2 id='string-literal-types'>字符串字面量类型</h2>

字符串字面量允许你指定一个字符串必须包含的确定值。

```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out";
```

<h2 id='numberic-literal-types'>数值字面量类型</h2>

同字符串字面量类似，显示指定一个数值类型必须包含的所有值。

```ts
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  // ...
}
```

<h2 id='enum-memeber-types'>枚举成员类型</h2>

当枚举成员被使用字面量初始化后，可以作为类型。

<h2 id='discriminated-unions-types'>有区别的并集</h2>

你可以联合单例类型、联合类型、类型保护和类型别名，创建一个成为**有区别的并集**，也称为**标签联合类型**和**代数类型**的高级范式。有区别的并集在函数式编程中很有用。一些语言会自动区分并集，而`TypeScript`是基于今天已经存在的`JavaScript`方式创建。

有区别的并集有三要素：

- 所有类型必须包含一个可以单例类型，即*判别式*
- 使用类型别名联合这些类型，即*联合*
- 在通用类型上使用类型保护

```ts
interface Square {
  kind: "square";
  size: number;
}
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}
interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Rectangle | Circle;
function area(s: Shape) {
  switch (s.kind) {
    case "square":
      return s.size * s.size;
    case "rectangle":
      return s.height * s.width;
    case "circle":
      return Math.PI * s.radius ** 2;
  }
}
```

**穷尽检查**

我们想让编译器知道我们没有包含有区别的并集所有的变体，就像上面的例子，假如我们为`Shape`再添加一个联合类型，我们需要修改`area`方法，否则会报错。

有两种方法可以解决这个问题：

- 开启`--strictNullCheks`标签，并为返回类型增加`undefined`
- 使用`never`类型通过`TypeScript`的穷尽检查

<h2 id='polymorphic-this-types'>多态this类型</h2>

一个多态`this`类型代表包含类和接口的自类型。这被称为方法绑定多态性。这使得接口层级流畅且易于表达。

```ts
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

let v = new BasicCalculator(2)
  .multiply(5)
  .add(1)
  .currentValue();
```

<h2 id='index-types'>索引类型</h2>

利用索引类型，可以通过编译器检查，使用动态属性名称。在`TypeScript`中，可以使用**索引检索符**和**索引访问符**来实现使用动态属性名称访问属性。

- **索引检索符**，格式`keyof T`。对于类型`T`，`keyof T`表示`T`所有已知公共属性的并集
- **索引访问符**，格式`T[K]`。

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map(n => o[n]);
}
```

<h2 id='mapped-types'>映射类型</h2>

根据旧类型，按照一定的方式转换成一个新类型。

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

<h2 id='conditional-types'>条件类型</h2>

`TypeScript`2.8 引入增加了不均匀映射类型能力的*条件类型*。一个条件类型根据条件表达式决定选择两个可能类型中的一个。

```ts
T extends U ? X : Y
```

一个条件类型`T extends U ? X : Y`要么解析为`X`或`Y`类型，要么被延迟解析出结果，因为此时条件依赖一到多个类型变量。当`T`或`U`包含类型变量，是否解析为`X`或`Y`，或延迟解析，是由类型系统是否有足够信息判定`T`是否可赋值给`U`决定的。

下面这个例子的类型会被延迟解析出：

```ts
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number
let x = f(Math.random() < 0.5);
```
