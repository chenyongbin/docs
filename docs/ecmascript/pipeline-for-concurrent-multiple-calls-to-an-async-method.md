# 同时多次调用一个异步方法的管道处理器

有这样一种情况：异步方法 `A` 是方法 `B`、`C` 和 `D` 的依赖，`B`、`C` 和 `D` 有可能同时调用 `A`。此时 `A` 中的异步操作会被执行 3 次。假如方法 `A` 返回的结果对时间没有那么敏感的话，`B`、`C` 和 `D` 同时调用 `A` 时得到的结果应该是一致的，所以方法 `A` 中的异步操作只需要调用一次就行了。

那么如何实现在 `B`、`C` 和 `D` 同时调用 `A` 时，`A` 中的异步操作只调用一次呢？答案是在 `A` 中的异步操作第一次被执行时，将其异步对象缓存下来。后续其它几个方法调用 `A` 时，判断 `A` 的异步操作对象是否存在，若存在直接返回该异步对象。结果就是 `B`、`C` 和 `D` 同时调用 `A` 后，得到的是同一个异步对象，等异步操作结束，`B`、`C` 和 `D` 会同时得到相同的结果。

根据上面的思路，我们可以声明一个功能方法`pipeline`，参数是一个异步方法。该功能方法可以将异步方法进行封装，使其支持在多次调用时，只执行一次异步操作。对 `A` 的调用就好像是对其架设一个管道，同时多次调用只执行一次异步时，就好像这些调用者使用的是同一个管道，所以我将这个功能方法也称之为管道方法。

管道方法的具体实现很简单：就是创建一个匿名函数，在函数内创建一个表示异步对象的变量，然后返回一个新的异步方法。方法内判断异步对象变量是否存在，不存在时执行异步操作，并将异步操作返回的对象赋值给前面的异步对象变量；存在时，直接返回该异步对象变量。等异步操作结束，返回给调用者异步操作结果后，再销毁异步对象变量。这样一次同时多次调用一个异步方法，只执行一次异步操作的管道方法就实现了。

示例：

```js
const pipeline = function(targetFunction, shouldCacheResult) {
  let startedPromise = null;

  return function() {
    if (!startedPromise) {
      startedPromise = new Promise(function(resolve, reject) {
        targetFunction()
          .then(function(result) {
            resolve(result);
            startedPromise = null;
          })
          .catch(function(error) {
            reject(error);
            startedPromise = null;
          });
      });
    }
    return startedPromise;
  };
};
```

假如方法异步操作结果在应用生命周期内保持不变，可以将其缓存下来，下次调用时直接返回。

有缓存逻辑示例：

```js
const pipeline = function(targetFunction, shouldCacheResult) {
  let promiseResult = null,
    startedPromise = null;

  if (shouldCacheResult && promiseResult) {
    return promiseResult;
  }

  return function() {
    if (!startedPromise) {
      startedPromise = new Promise(function(resolve, reject) {
        targetFunction()
          .then(function(result) {
            shouldCacheResult && (promiseResult = result);
            resolve(result);
            startedPromise = null;
          })
          .catch(function(error) {
            reject(error);
            startedPromise = null;
          });
      });
    }
    return startedPromise;
  };
};
```

**注意**：针对某些退出应用后，但应用资源仍未得到释放的环境。若要使用缓存结果逻辑，必须在`export`该方法时才用该管道方法进行封装。

```js
const asyncMethod = async function(){
    // ...
};

export {
    asyncMethod: pipeline(asyncMethod)
};
```

`TypeScript` 版：

```ts
const pipeline = function<T>(
  targetFunction: () => Promise<T>,
  shouldCacheResult: boolean = false
) {
  let promiseResult: T, startedPromise: Promise<T> | undefined;

  if (shouldCacheResult && promiseResult) {
    return promiseResult;
  }

  return function(): Promise<T> {
    if (!startedPromise) {
      startedPromise = new Promise(function(resolve, reject) {
        targetFunction()
          .then(function(result) {
            shouldCacheResult && (promiseResult = result);
            resolve(result);
            startedPromise = undefined;
          })
          .catch(function(error) {
            reject(error);
            startedPromise = undefined;
          });
      });
    }
    return startedPromise;
  };
};
```
