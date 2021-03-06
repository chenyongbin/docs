# 变量声明

`typescript`有三种声明变量的方式，`var`、`let`和`const`，由于`var`有天生的缺陷，常用后两种方式。

## `var`

`var`声明方式有**一次声明，随处可用**的问题。

## `let`

`let`声明方式相比`var`声明方式，有如下优点：

- 只在变量所在的块级作用域或`for`循环内可访问
- 作用域内，变量声明前不可用，称之为*临时性死区*
- 在同一个作用域内，不可以重复声明
- 在内嵌的作用域，可以再次声明同名变量，此时该变量是外部作用域内变量的浅复制

## `const`

`const`声明方式与`let`相同，只是在语义上不一样。`const`声明的变量只在声明时赋值，之后不可以再赋值。

_注意：使用`const`声明的对象的属性是可以重新赋值的。_
