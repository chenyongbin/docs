# 兼容性方法集锦  

## Promise.try  

*实际开发中，经常遇到一种情况：不知道或者不想区分，函数`f`是同步函数还是异步函数，但是想用`Promise`处理它。因为这样就可以不管`f`是否包含异步操作，都用`then`来指定下一步流程，用`catch`处理`f`抛出的错误。鉴于这是一个常见的需求，现在有一个[提案](https://github.com/tc39/proposal-promise-try)，提供`Promise.try`方法提供统一的处理机制。*  

*`Promise.try`的提案目前还处于`stage1`阶段，我写了一个兼容性的方法。*  
```javascript  
Promise.try =
  Promise.try ||
  ((...args) => {
    let arg1 = args[0];
    if (arg1 instanceof Promise) {
      return arg1;
    }
    if (typeof arg1 == "function") {
      return (async fn => fn())(arg1);
    }
    return Promise.resolve(arg1);
  });
```