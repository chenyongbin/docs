# npm 中`package.json`文件介绍

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
    "bin": "",
    "man": "",
    "directories": "",
    "repository": "",
    "scripts": "",
    "config": "",
    "dependencies": "",
    "devDependecies": "",
    "peerDependencies": "",
    "bundledDependencies": "",
    "optionalDependecies": "",
    "engines": "",
    "engineStrict": "",
    "os": "",
    "cpu":"",
    "preferGlobal": "",
    "private": "",
    "publicConfig": "",
}
```

## name

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

## version

版本号，发布时，该字段是必需的，若不发布时是可选的。使用`npm`打包时，该字段的值必须遵循[node-semver](https://docs.npmjs.com/misc/semver)规范。

## description

项目描述字符串

## keywords

项目关键字，是一个字符串数组

## homepage

项目首页地址

## bugs

项目的问题追踪地址或者是报告问题时的邮件地址，可以指定`url`和`email`两个值，也可以只指定一个。

## lisence

开源许可证

## author

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

## contributors

作者信息数组，数组项格式同`author`

## files

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

## main

该字段是用于表示项目开始入口的模块 ID。

## browser

如果你的项目用于使用客户端，那么应该使用`browser`字段而不是`main`，这在提示用户可以依赖一些在`node`中没有的元数据（如`window`）时很有用。

## bin

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

## man

为`man`命令程序指定单个文件或一个文件数组。

如果指定单个文件，结果会执行命令`man <pkgname>`，也就是无视具体文件名称，而以项目名作为参数。

```js
{
    "name": "foo",
    "man": "./man/doc.1"
}

// 结果命令是 man foo
```

如果指定多个文件，且没有以包文件名开头时，会将包名称以前缀形式添加到命令中。

```js
{
    "name": "foo",
    "man": ["./man/foo.1", "./man/bar.1"]
}
// 结果命令是 man foo和 man foo-bar
```

## directories

该字段是`CommonJS`规范用来详细描述包结构的。

- `directories.lib` 描述库文件主体的位置
- `directories.bin` 设置该属性后，该文件夹下的所有文件都会添加。该属性不可以和`bin`同时使用
- `directories.man` 一个有所有`man`命令的文件夹
- `directories.doc` markdown 文件夹
- `directories.example` 示例脚本
- `directories.test` 测试

## repository

代码仓库地址，如果是`Github`地址，使用`npm docs`命令可以直接跳至仓库页面。

## scripts

配置脚本命令，详情点击 [npm-scripts](https://docs.npmjs.com/misc/scripts)

## config

该字段用于设置脚本中跨升级使用的配置参数。如：

```js
{
    "config": {"port": "8080"}
}
// 可以使用process.env.npm_package_config_port的形式获取到该值
```

## dependencies

该字段是一个简单对象，使用包名称和版本号序列映射，指定了项目的依赖。版本序列是一个有一到多个空格分隔符的字符串。

版本号如`[major, minor, patch]`，简要介绍如下：

- `major` 这个版本号变化了表示有了一个不可以和上个版本兼容的大更改
- `minor` 这个版本号变化了表示有了增加了新的功能，并且可以向后兼容
- `patch` 这个版本号变化了表示修复了 bug，并且可以向后兼容

可能的格式如下：

- `version` 精确匹配某个版本
- `>version` 大于某个版本
- `>=version` 大于等于某个版本
- `<version` 小于某个版本
- `<=version` 小于等于某个版本
- `~version` 大约等于某个版本，更新至`patch`的最新版
- `^version` 兼容某个版本，更新至`minor`的最新版
- `1.2.x` 会是 1.2.0、1.2.1 但不是 1.3.0
- `http://...` http 地址
- `*` 匹配任何版本
- 空字符串时，同`*`
- `version1 - version2` 大于等于`version1`，小于等于`version2`
- `range1 || range2` 满足序列 1 或序列 2
- `git...` git 地址
- `user/repo` GitHub 地址
- `tag` 一个指定版本的标签并发布为`tag`
- `path/path/path` 本地路径下的包

### 用 URL 地址做依赖

指定一个 url 地址作为版本序列，在 npm 安装时会将其下载到本地。

### 用 Git URLs 做依赖

Git URLs 格式如下：

```
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
```

示例：

```sh
git+ssh://git@github.com:npm/cli.git#v1.0.27
git+ssh://git@github.com:npm/cli#semver:^5.0
git+https://isaacs@github.com/npm/cli.git
git://github.com/npm/cli.git#v1.0.27
```

### 用 Github URLs 做依赖

格式是`user/repo`，如:

```sh
{
    "express": "expressjs/express",
    "mocha": "mochajs/mocha#4727d357ea",
    "module": "user/repo#feature\/branch"
}
```

### 用本地路径做依赖

可以用`npm install -S`和`npm install --save`保存到本地，使用示例：  
```sh  
../foo/bar
~/foo/bar
./foo/bar
/foo/bar
```  

这些都是`package.json`的相对路径。  


## devDepencies  

如果一些人试图在他们的程序中下载你的项目，但又可能不想安装和编译你使用的外部测试和文档框架。  

此时，可以将这些额外的项目映射放在`devDepencies`对象中。  

可以通过 `npm link` 或 `npm install` 安装这些依赖，并且像其它npm配置参数一样管理。  

## peerDepencies  

某些情况下，你想表达你的包对应的宿主工具或库的兼容性，而不必使用`require`引用该宿主。这个通常称之为插件。尤其是，你的模块或许会暴露一个被宿主文档期待和指定的接口。  

假如你的包配置如下：  
```js  
{
    "name": "tea-latte",
    "version": "1.3.5",
    "peerDepencies": {
        "tea": "2.x"
    }
}
```  
像这种情况，通过命令`npm install tea-latte`安装完包时，会产品如下的依赖图：  
```js  
|--- tea-latte@1.3.5  
|--- tea@2.2.0  
```  

## bundledDepencies  

这个属性定义了一个包名称数组，在发布时用以打包。  

当你将包保留在本地，或是使其以单个文件形式下载时，可以通过在`bundledDependecies`属性中指定包名称，并执行`npm pack`，将其打包进一个tar文件。  

## optionalDependecies  

可选依赖，下载该依赖失败后也不会报错。该属性中的依赖会覆盖`depencies`中的依赖，因此最好只使用一个。  

## engines  

指定`node`和`npm`的版本。  

## engineStrict  

npm3.0以后已移除

## OS  

模块运行系统，可以是白名单或和黑名单形式。操作系统由`process.platform`指定。  

白名单形式如：  
```js  
    "os": ["darwin", "linux"]  
```  

黑名单形式如：  
```js  
    "os": ["!win32"]
```

## cpu  

指定特定的cpu架构，同`os`属性一样也有白名单、黑名单之分。由`process.arch`指定。  

## preferGlobal  

*已废弃*

## private  

确保不会突然发布到npm仓库中的设置。如果该属性设为`true`，npm会拒绝发布。  

## publishConfig  

一系列用于发布时的配置。