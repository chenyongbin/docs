# 类

从`ECMAScript 2015`开始，JavaScript 支持面向对象编程中的类了。类的语法和`C#`、`Java`中的一样，下面是个简单例子：

```ts
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

## 继承

在`TypeScript`中，类可以使用关键字`extends`继承其它类。继承的类称之为*子类*，被继承的类称之为*超类*。

需要注意的是，派生类中包含构造函数时，必需调研`super`方法，且必须在构造函数中使用`this`访问属性前调用`super`。

## `Public`、`Private`和`Protected`修饰符

在`TypeScript`中，类的成员默认修饰符是`Public`。

`Private`是私有修饰符，不可以在包含类的外部访问。

`Protected`保护修饰符，和`Private`一样也不可以在包含类外访问，但可以在派生类中访问。

`TypeScript`是结构类型系统，当比较两个类型时，无论它们来自哪里，如果两个类型所有成员都兼容，我们就说这两个类型也兼容。

但是，当比较包含`Private`和`Protected`成员的类型时，处理方式有些不同。当两个类型兼容时，如果其中一个类型包含`Private`成员时，另一个类型必须也包含`Private`成员，且该成员必须源自相同的声明。这种规则也适用于`Protected`成员。

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

类的构造函数可以使用`Protected`修饰符，这表示该类不可以在外面实例化，只能在派生类中实例化。

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee can extend Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // Error: The 'Person' constructor is protected
```

## `Readonly`修饰符

`Readonly`修饰符可以定义只读属性。只读属性必须在声明或构造函数中初始化。

```ts
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;
  constructor(theName: string) {
    this.name = theName;
  }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // error! name is readonly.
```

有一种可以在构造函数中同时声明和初始化参数的方式，称之为*参数属性*。通过这种方式，可以将变量声明和赋值放在一个地方。`Public`、`Private`、`Protected`和`Readonly`都适用这种方式。

```ts
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {
    this.name = "Tom";
  }
}
```

## 存取器

`TypeScript`支持 getter/setter 作为拦截对象成员访问的方式。

```ts
const fullNameMaxLength = 10;

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
  console.log(employee.fullName);
}
```

使用存取器时，有两个注意实现：

- 代码输出目标必须时`ECMAScript5`及以上
- 存取器自动被推断为只读的

## 静态属性

略

## 抽象类

抽象类是一种特殊的类，只声明了属性或者方法，但不能被实例化，只能被继承。

```ts
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
    console.log("roaming the earth...");
  }
}
```

声明抽象类时，必须带有`abstract`关键字，该关键字不仅可以声明类，还可以声明方法。当声明方法时，可以只定义变量签名，但不加具体实现。  

派生类必须实现抽象类中的抽象方法。