# 函数

有两种声明函数的方式：

```ts
// 具名函数
function add(x, y) {
  return x + y;
}

// 匿名函数
let myAdd = function(x, y) {
  return x + y;
};
```

一个完整的函数类型包含两部分：**参数类型**和**返回类型**。简单示例：

```ts
let myAdd: (baseValue: number, increment: number) => number = function(
  x: number,
  y: number
): number {
  return x + y;
};
```

当定义了函数类型后，函数的实现部分可以不写参数类型和返回类型，因为编译器会根据上下文推断出参数和返回的类型。

```ts
let myAdd: (baseValue: number, increment: number) => number = function(x, y) {
  return x + y;
};
```

## 可选和默认参数

和可选变量声明方式一样，可选参数也是以在参数名称后添加`?`的方式声明。

```ts
function buildName(firstName: string, lastName?: string) {
  if (lastName) return firstName + " " + lastName;
  else return firstName;
}
```

当某个参数未传或传入`undefined`时，可以提供一个值作为该参数的默认值。

```ts
function buildName(firstName: string, lastName = "Smith") {
  return firstName + " " + lastName;
}
```

可选参数必须位于其它必需参数后面，默认参数的位置没有此限制。但是如果默认参数位于必需参数前面，且想使用默认参数值时，必须给这个位置显式地传入`undefined`。

当默认参数位于必需参数后面时，默认和可选参数，共用相同的函数类型。

```ts
// 可选参数
function buildName(firstName: string, lastName?: string) {}
// 默认参数
function buildName(firstName: string, lastName = "Smith") {}
// 上面两种函数都可以使用下面的函数类型声明
type buildName = (firstName: string, lastName?: string) => string;
```

## 剩余参数

不像必需、可选和默认参数，一次只处理一个参数。可以使用扩展运算符将多个参数归为一个变量下。

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

// employeeName will be "Joseph Samuel Lucas MacKinzie"
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

剩余参数可视为无限制的可选参数，在剩余参数位置，可传入无数的变量，也可以不传入变量。

## `this`

在`JavaScript`中，熟悉了`this`的作用好像参加了成人礼一样。

函数中的`this`表示函数执行所在的上下文，要注意函数作为返回值或参数时，`this`所代表的对象可能会有变化。

为了绑定函数所使用的正确上下文环境，可以使用箭头函数的方式定义函数。但是在编译器选项配置成`--noImplicitThis`时，函数中的`this`会变成`any`类型。

为了显示指定`this`的类型，可以使用`this`参数。`this`参数是函数中的第一个参数。

```ts
interface Card {
  suit: string;
  card: number;
}
interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
  suits: ["hearts", "spades", "clubs", "diamonds"],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function(this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52);
      let pickedSuit = Math.floor(pickedCard / 13);

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
    };
  }
};

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

## 重载

`TypeScript`支持同一个函数声明多个类型，称之为函数重载。

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 }
];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```  

编译器会按照函数声明顺序，逐个匹配。所以应按照从特殊到普通声明重载函数。
