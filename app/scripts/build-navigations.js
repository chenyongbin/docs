/**
 * 生成导航数据
 */

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { docs } = require("../constants");

const DOCS_FILES = [],
  FILE_NODE = {
    name: "",
    path: "",
    isFile: false,
    isDirectory: false,
    files: null
  };

(async function() {
  console.log("build-navigations start...");

  /** 遍历文件夹结构 */
  await foreachDirectoryRecursively([[process.cwd(), ["docs"]]]);

  /** 逐级遍历文件夹，生成每一层的导航数据 */

  /** 将导航数据写入文件 */

  console.log("build-navigations end...");
})();

function watchDocsDirectory(path) {}

function unwatchDocsDirectory(path) {}

function readLine(fileName) {}

/**
 * 递归遍历文件夹
 * @param {string} dirPath 相对文件夹路径
 */
async function foreachDirectoryRecursively(dirName, dirPath, dirMaps) {
  if (!dirPath) {
    return null;
  }

  try {
    dirMaps = dirMaps || {};
    let dirents = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (let dirent of dirents) {
      if (dirent.isFile()) {
        dirMaps[dirName].files = dirMaps[dirName].files || [];
        dirMaps[dirName].files.push(dirent.name);
      } else if (dirent.isDirectory()) {
        dirMaps[dirName].directories = dirMaps[dirName].directories || [];
        dirMaps[dirName].directories.push(dirent.name);
      }
    }
  } catch (error) {
    console.error(`遍历文件夹(${dirPath}失败`, error);
  }
}
