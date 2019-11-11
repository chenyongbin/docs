# JSX

使用 JSX 前，必须做以下两件事：

- 使用`.jsx`扩展名命名文件
- 启用`jsx`配置

`TypeScript`发布了三种 JSX 模式：`preserve`、`react`和`react-native`。这些模式只影响输出阶段，不影响类型检查。

- `preserve`模式，输出文件扩展是`.jsx`，该模式将保持 JSX 为输出的一部分，并进一步被其它的转换步骤消费
- `react`模式，输出文件扩展是`.js`，该模式将会输出`React.createElement`，不会再进一步的做转换
- `react-native`模式，输出文件扩展是`.js`，该模式和`preserve`模式一样保留所有的 JSX

在 JSX 中，由于尖括号有特殊的意义，故`TypeScript`不允许在 JSX 中使用尖括号方式做类型断言，而改为`as`操作符。

## 类型检查

对于 JSX 来说，元素有**内在元素**和**基于值的元素**之分。

- **内在元素**，是指当前环境内内在的元素，像`DOM`环境中的`a`、`h1`等
- **基于值的元素**，是指创建的自定义组件

对于**内在元素**和**基于值的元素**，JSX 有以下亮点处理的不同：

- 对于内在元素，React 会输出`React.createElement('div')`，但是创建的组件不会是这种输出
- 对于内在元素，传入的属性必须是内在的属性，但对于创建的组件，却是要指定它们自己设定的属性

**内在元素**通过接口`JSX.IntrinsicElements`查找。默认情况下，该接口没有指定，所有内在元素都不会参加类型检查。然而，如果该接口存在时，会在该接口中查找与内在元素名称同名的属性，如果找得到，说明该元素正确，若找不到，表示没有该元素。

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

<foo />; // ok
<bar />; // error
```

**基于值的元素**会通过作用域中的标示符简单查找。

```ts
import MyComponent from "./myComponent";

<MyComponent />; // ok
<SomeOtherComponent />; // error
```

**基于值的元素**有两种定义的方式：*函数组件*和*类组件*。

因为这两种定义彼此差异很大，TS 首先会使用重载分辨把表达式解析为函数组件。如果处理成功，TS 将结束解析。如果失败，TS 将会试着解析为类组件，如果仍然失败，TS 会报错。

### 函数组件

正如名称所暗示的，该组件会使用函数定义，第一个参数是`props`。TS 会强制使它的返回类型是`JSX.Element`

```ts
interface FooProp {
  name: string;
  X: number;
  Y: number;
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent name={prop.name} />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>
```

### 类组件

类组件有两个相关术语：*元素类类型*和*元素实例类型*。

如果元素是 ES6 类，元素类类型是指类的构造函数，元素实例类型是指类的实例；如果元素是个工厂函数，那么元素类类型是那个函数，元素实例类型是那个函数的返回值。

```ts
class MyComponent {
  render() {}
}

// use a construct signature
var myComponent = new MyComponent();

// element class type => MyComponent
// element instance type => { render: () => void }

function MyFactoryFunction() {
  return {
    render: () => {}
  };
}

// use a call signature
var myComponent = MyFactoryFunction();

// element class type => MyFactoryFunction
// element instance type => { render: () => void }
```

元素实例类型必须是可赋值给`JSX.ElementClass`，否则会导致一个错误。

### 属性类型检查

属性类型检查的第一步是判断元素的属性类型，内在元素和基于值元素有些许不同。

内在元素的属性类型，是接口`JSX.IntrinsicElements`中属性的类型。

```ts
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

// element attributes type for 'foo' is '{bar?: boolean}'
<foo bar />;
```

基于值元素的属性类型，是由类组件实例的属性类型决定的。具体使用哪个属性由`JSX.ElementAttributesProperty`接口决定。必须单独声明一个属性，还属性然后才可用。截至 TypeScript2.8 版，如果该接口未提供，类元素构造函数和函数组件调用的第一个参数将被使用。

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // specify the property name to use
  }
}

class MyComponent {
  // specify the property on the element instance type
  props: {
    foo?: string;
  };
}

// element attributes type for 'MyComponent' is '{foo?: string}'
<MyComponent foo="bar" />;
```

除此之外，`JSX.IntrinsicAttributes`接口可用于指定 JSX 框架使用的额外属性，这些属性通常不太被组件的 props 和参数使用，如 React 中`key`键。

更专业的话，`JSX.IntrinsicClassAttributes<T>`泛型类型或许也可以指定同一种只用于类组件的额外属性。在这个类型中，泛型参数对应类的实例类型。在 React 中，这允许`Ref<T>`的`ref`属性。通常来讲，所有这些接口的属性都是可选的，除非你想让你 JSX 框架的用户在每个标签上都需要提供一些属性。

### 子元素类型检查

和属性名决定的方式相似，子元素属性名由`JSX.ElementChildrenAttribute`指定。

```ts
declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {}; // specify children name to use
  }
}
```

可以像其它属性一样指定子元素的类型，这会覆盖默认的类型。

```ts
interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return (
      <h2>
        {this.props.children}
      </h2>
    )
  }
}

// OK
<Component name="foo">
  <h1>Hello World</h1>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element
<Component name="bar">
  <h1>Hello World</h1>
  <h2>Hello World</h2>
</Component>

// Error: children is of type JSX.Element not array of JSX.Element or string.
<Component name="baz">
  <h1>Hello</h1>
  World
</Component>

```

## JSX 结果类型

默认情况下，JSX 表达式的结果是`any`类型。你可以通过指定`JSX.Element`接口自定义结果类型。但是不可能通过这个接口查找元素、属性或子元素的信息。

## 嵌入式表达式

JSX 允许使用花括号`{}`环绕表达式，嵌入到标签之间。

```ts
var a = (
  <div>
    {["foo", "bar"].map(i => (
      <span>{i / 2}</span>
    ))}
  </div>
);
```
