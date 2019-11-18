# 模块解析

**模块解析**就是编译找出`import`语句指向什么的处理过程。

一次模块解析的步骤大致如下：

- 首先，努力定位到代表该模块的文件
- 如果定位不到且模块的路径是绝对路径，那么就努力定位该模块的外围声明文件
- 如果还找不到，那么久报错`Cannot find module 'moduleA'`

## 相对路径和非相对路径

**相对路径**是使用`/`、`./`和`../`位置符号的路径，主要用来定位内部模块文件。  
**非相对路径**，除相对路径以外的其他路径，都是非相对路径，主要用来定位和引入外部模块文件。

## 模块分析策略

TS 有两个模块分析策略：

- **经典策略**，TS 的默认策略，现在只是做后备兼容使用
- **Node 策略**，TS 模拟了 NodeJS 模块解析的策略

### 经典策略

相对路径时，按照`.ts`和`.d.ts`两种扩展在导入文件所在文件夹内查找。

```ts
// src/moduleA.ts
import { t } from "./moduleB";

// 查找策略
// src/moduleB.ts
// src/moduleB.d.ts
```

非相对路径时，按照`.ts`和`.d.ts`两种扩展从导入文件所在文件夹开始逐级向上查找。

```ts
// src/utils/moduleA.ts
import { t } from "moduleB";

// 查找策略
// src/utils/moduleB.ts
// src/utils/moduleB.d.ts

// src/moduleB.ts
// src/moduleB.d.ts
```

### Node 策略

相对路径时，会按照`.ts`、`.tsx`、`.d.ts`以及`package.json`和`index.ts`、`index.tsx`、`index.d.ts`的方式查找。

```ts
// src/moduleA.ts
import { t } from "./moduleB";

// 查找策略
// src/moduleB.ts
// src/moduleB.tsx
// src/moduleB.d.ts
// src/moduleB/package.json (包含types属性)
// src/moduleB/index.ts
// src/moduleB/index.tsx
// src/moduleB/index.d.ts
```

非相对路径时，会逐级向上查找`node_modules`文件夹内是否有对应格式的文件，该格式和相对路径时一致。

```ts
// src/moduleA.ts
import { t } from "moduleB";

// 查找策略
// src/node_modules/moduleB.ts  
// src/node_modules/moduleB.tsx
// src/node_modules/moduleB.d.ts
// src/node_modules/moduleB/package.json (包含types属性)
// src/node_moduels/@types/moduleB.d.ts
// src/node_moduels/moduleB/index.ts
// src/node_moduels/moduleB/index.tsx
// src/node_moduels/moduleB/index.d.ts
```
