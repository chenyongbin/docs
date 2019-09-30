# npm中`package.json`文件介绍

所有配置字段如下：

```javascript
{
    "name": "",
    "version": "",
    "description": "",
    "keywords": ["js", "react"],
    "homepage": "https://github.com/owner/project#readme",
    "bugs": {
        "url": "https://github.com/owner/project/issues",
        "email": "project@hostname.com"
    },
    "license": "",
    "author": {
        "name": "Albin",
        "url": "chenyongbin.github.com",
        "email": ""
    },
    "files": [""],
    "main": "",
    "browser": "",
    "bin": ""
}
```

## `name`

项目名称，发布时，该字段是必需的，若不发布时是可选的。该字段需遵循一些规则：

- 字段长度必须小于等于 214
- 不能以点和下划线开头
- 新的包里一定不能有大写字符
- 由于名称可能是 url、命令行参数或文件夹的一部分，因此不能包含非 url 安全的字符

该字段命名的一些建议：

- 不要和`Node`核心模块一样的名称
- 不要在名称中放置`js`和`node`
- 名称可能会被`reuire()`调用，所以应尽可能短且易于理解
- 如果要发布时，最好先检查一下 npm 库中是否已有该名称的模块

## `version`

版本号，发布时，该字段是必需的，若不发布时是可选的。使用`npm`打包时，该字段的值必须遵循[node-semver](https://docs.npmjs.com/misc/semver)规范。

## `description`

项目描述字符串

## `keywords`

项目关键字，是一个字符串数组

## `homepage`

项目首页地址

## `bugs`

项目的问题追踪地址或者是报告问题时的邮件地址，可以指定`url`和`email`两个值，也可以只指定一个。

## `lisence`

开源许可证

## `author`

作者，可以使用一个对象展示名称、url 和 email

```javascript
{
    "name": "Albin",
    "url": "chenyongbin.github.com",
    "email": "chenyongbin@outlook.com"
}
```

也可以只在一行显示

```
"Albin <chenyongbin.github.com> (chenyongbin@outlook.com)"
```

## `contributors`

作者信息数组，数组项格式同`author`

## `files`

可选字段，当项目被用作依赖时，用于描述包含文件的文件模式。该文件模式遵循类似`.gitignore`的模式。

改字段省略时，默认值是`[*]`，意思是包含所有文件。

还可以在根文件夹和子文件夹内使用`.npmignore`文件阻止文件被包含。在根文件夹内时，该文件不会覆盖`files`字段的内容，但是在子文件夹内会覆盖。`.npmignore`文件工作原理同`.gitignore`。

`files`中的包含的文件不会被`.npmignore`和`.gitignore`文件排除。

以下文件永远被包含，无视规则：

- package.json
- README
- CHANGES / CHANGELOG / HISTORY
- LICENSE / LICENCE
- NOTICE
- `main`字段中的文件

相反地，下面这些文件永远会被忽略：

- .git
- CVS
- .svn
- .hg
- .lock-wscript
- .wafpickle-N
- .\*.swp
- .DS_Store
- .\_\*
- npm-debug.log
- .npmrc
- node_modules
- config.gypi
- \*.orig
- package-lock.json (use shrinkwrap instead)

## `main`

该字段是用于表示项目开始入口的模块 ID。

## `browser`

如果你的项目用于使用客户端，那么应该使用`browser`字段而不是`main`，这在提示用户可以依赖一些在`node`中没有的元数据（如`window`）时很有用。  

## `bin`  

很多包里会有一到多个可能要安装到`PATH`中的可执行文件。可以添加`bin`字段，该字段映射了命令名和它的本地文件名。  

示例如下：  
```js  
{
    "bin": {"myApp", "/cli.js"}
}
```  

若命令名和项目名一致时，可以省略命令名，直接配置命令文件  
```js  
{
    "bin": "./cli.js"
}
```  

## `man`  

为`man`命令程序指定单个文件或一个文件数组。  

如果指定单个文件