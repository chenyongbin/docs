# 实现同时多次调用一个异步方法时只执行一次异步操作

## 背景

最近在做`React Native`项目时，遇到一个异步调用问题。接口请求时需要传入明文 id，但是应用从其它地方同步过来的 id 是加密的，所以在调用接口前需要再调一次解密请求，以获取到明文 id。

问题是，页面初始化后，可能会同时发出多个接口请求。代码逻辑如下：

```js
// 解密id
const decryptId = () => fetch("url").then(response => response.json());

// 接口请求1
const request1 = async () => {
  let decryptedId = await decryptId();
  // ...
};

// 接口请求2
const request2 = async () => {
  let decryptedId = await decryptId();
  // ...
};

// 页面初始化后
request1();
request2();
```

结果是`decryptId`中的异步请求执行了两次，造成了不必要的网络请求开销。

## 思路

既然两次调用都是执行相同的操作，为什么不合二为一只做一次解密请求呢？但是如何把两次请求合成一次呢？理想的情况是：当第一次发起了解密请求后，再想发起第二次请求时，因为知道前面已经发起过一次解密请求，所以就不再发起请求，两次解密调用都使用同一个解密请求。

想好了就要验证一下：

```js
let decryptIdPromise = null;

// 解密id
const decryptId = () => {
  if (!decryptIdPromise) {
    decryptIdPromise = fetch("url").then(response => {
      decryptIdPromise = null;
      return response.json();
    });
  }
  return decryptIdPromise;
};

// 接口请求1
const request1 = async () => {
  let decryptedId = await decryptId();
  // ...
};

// 接口请求2
const request2 = async () => {
  let decryptedId = await decryptId();
  // ...
};

// 页面初始化后
request1();
request2();
```

上面代码中，我使用了一个变量`decryptIdPromise`来保存异步请求，接口请求`request1`调用解密方法`decryptId`时，异步请求变量`decryptIdPromise`还是`null`，此时发起解密请求，并将解密异步请求对象赋值给变量`decryptIdPromise`。等接口请求`request2`调用解密方法时，变量`decryptIdPromise`已不为空，解密方法直接将该变量返回，这样两个接口请求方法消费的就是同一个解密请求了。

结果自然如预期的那样，只执行了一次解密请求。

发散思维思考一下如果把解密后的 id 缓存下来会怎样？答案是，下次再解密 id 时就不用发起网络请求了，直接返回缓存的 id。

改造后的解密 id 方法如下：

```js
let decryptedId = "",
  decryptIdPromise = null;

// 解密id
const decryptId = () => {
  if (decryptedId) {
    return decryptedId;
  }

  if (!decryptIdPromise) {
    decryptIdPromise = fetch("url").then(response => {
      decryptIdPromise = null;
      decryptedId = response.json();
      return decryptedId;
    });
  }
  return decryptIdPromise;
};
```

## 管道方法

项目中还有类似的场景，那么可以把对异步操作的处理逻辑提取出来，封装成一个功能方法。

对解密方法的两次同时调用，得到的都是同一个异步请求对象。形象一点比喻的话，像是在解密请求上架设了一根管道，两次请求连接的都是这条管道。所以，我把这个功能方法也称之为管道方法。

管道方法代码：

```js
const pipeline = (targetFunction, shouldCacheResult = false) => {
  let promiseResult = null,
    startedPromise = null;

  return () => {
    if (shouldCacheResult && promiseResult) {
      return promiseResult;
    }

    if (!startedPromise) {
      startedPromise = targetFunction()
        .then(result => {
          startedPromise = null;
          return result;
        })
        .catch(error => {
          startedPromise = null;
          return error;
        });
    }

    return startedPromise;
  };
};
```

最终上面的解密方法可以改成如下方式：

```js
const decryptId = pipeline(
  () => fetch("url").then(response => response.json()),
  true
);
```

**注意**：在某些应用退出后，资源仍未释放的环境。若想使用缓存异步结果逻辑，不能使用上面这种方式封装异步方法，而应该在`export`关键字后封装。

```js
const decryptId = () => fetch("url").then(response => response.json());

export {
  decryptId: pipeline(decryptId)
}
```

`TypeScript`版管道方法：

```ts
const pipeline = <T>(
  targetFunction: () => Promise<T>,
  shouldCacheResult: boolean = false
) => {
  let promiseResult: T, startedPromise: Promise<T> | undefined;

  return (): Promise<T> => {
    if (shouldCacheResult && promiseResult) {
      return promiseResult;
    }

    if (!startedPromise) {
      startedPromise = targetFunction()
        .then(result => {
          startedPromise = undefined;
          return result;
        })
        .catch(error => {
          startedPromise = undefined;
          return error;
        });
    }

    return startedPromise;
  };
};
```

_细心的朋友，是不是发现还没有考虑参数的问题。我觉得，参数意味着可变，多次调用时，参数若不同，结果也就可能不一样。而此时的管道方法也就无意义，所以，不考虑有参数的问题。_

_但不是说有参数的话，就不能使用这个管道方法了。可以把会被同时调用且传入的相同参数场景，使用管道方法封装成一个单独的无参方法。_

```js
const getData = async (dateFrom, dateTo) => {};
const getYear2018Data = pipeline(async () => {
  let data = await getData("20180101", "20181231");
}, true);

const caller1 = async () => {
  let data = await getYear2018Data();
  // ...
};
const caller2 = async () => {
  let data = await getYear2018Data();
  // ...
};

caller1();
caller2();
```
