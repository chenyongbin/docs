/**
 * 生成导航数据
 */

const fs = require("fs");
const path = require("path");
const { docs } = require("../constants");

const DOCS_FILES = [],
  FILE_NODE = {
    name: "",
    path: "",
    isFile: false,
    isDirectory: false,
    files: null,
  };

const iterateDirectory = (dirPath, restDirPaths = [], results = []) => {
  if (!dirPath) {
    if (!restDirPaths || restDirPaths.length == 0) {
      return results;
    } else {
      const newPath = restDirPaths.pop();
      return iterateDirectory(newPath, restDirPaths, results);
    }
  }

  const dirents = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const dir of dirents) {
    if (dir.isFile()) {
      results.push({ path: dir.name, parent: dirPath });
    } else if (dir.isDirectory()) {
      restDirPaths.push(path.join(dirPath, dir.name));
    }
  }

  if (restDirPaths.length == 0) {
    return results;
  } else {
    const newPath = restDirPaths.pop();
    return iterateDirectory(newPath, restDirPaths, results);
  }
};

try {
  const beginTime = Date.now();
  const results = iterateDirectory(path.join(process.cwd(), "docs"));
  fs.writeFileSync(
    path.join(process.cwd(), "data.json"),
    JSON.stringify(results)
  );
  console.log(`生成导航结束，耗时${Date.now() - beginTime}毫秒`);
} catch (error) {
  console.warn(error);
}
