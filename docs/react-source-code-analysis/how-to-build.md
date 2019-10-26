# 如何编译  

*本节主要阐述如何安装依赖、编译一个可正式发布的版本。*  


## 安装依赖  

```sh
yarn install  
```  

执行完上述命令后，会卡在`Building fresh packages...`，大概是下载`node-sass`依赖失败，具体原因详见[这里](https://www.eliseos.org/en/water/post/208)。  

解决方法是创建`.yarnrc`文件，并将如下配置拷贝进去，然后重试上述命令。  
```sh  
registry "https://registry.npm.taobao.org"

sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver"
```

## 执行编译命令  

```sh
npm run build
```