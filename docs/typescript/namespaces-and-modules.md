# 命名空间和模块

**命名空间**可以在逻辑上对代码进行分组和构建，防止命名冲突，还可以将同一个命名空间的代码分割到多个文件。

**模块**与**命名空间**类似，但也有区分，主要区别是模块可以声明依赖。这使得模块可以做到更好的代码复用，更强的代码分离，更便于打包。在大型应用中，模块更适用。

使用命名空间和模块时，有几个陷阱：

- 使用三斜杠指令`///<reference>`引入模块
- 滥用命名空间
