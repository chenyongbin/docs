# 我的文档集

_一个使用`markdown`格式书写，利用[Github Pages](https://pages.github.com/)展示的自定义静态笔记博客。_

## WHY

- 想以一种很 cool，但又成本低廉的方式记录笔记
- 借此机会，熟悉`bootstrap`、`sass`、`react`、`node`和`typescript`等一些技术

## HOW

- 基于`React`、`Bootstrap`框架实现前端页面
- 基于`markdown2html`，将`markdown`转换成`html`
- 基于`Github Pages`作为 web 服务器，`docs`作为静态资源文件夹
- 基于`Node`，每次发布前，根据`docs`生成所有笔记文件的导航数据
- 使用`markdown`书写笔记
- 每次新增、删除、重命名了笔记，需要使用`npm run docs`更新文档

## TODOS

- 实现`markdown`到`html`的转换
- 实现遍历`docs`文件夹并生成笔记导航数据

## RULES

- 每个文件夹内必须有一个`README.md`文件，该文件规范如下：
  - 首行是文件夹待展示的名称
  - 使用列表形式记录该文件夹下其它笔记文件的导航路径
- 笔记文件规范如下：
  - 文件名使用英文，多个单词使用横杠分隔
  - 文件内首行必须是文件待展示的名称
