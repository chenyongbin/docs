const path = require("path");
const express = require("express");
const cors = require("cors");
const { listenPort } = require("../config");

const app = express();

// 启用跨域支持
app.use(cors());

// 设置静态目录
app.use(express.static(path.join(process.cwd(), "docs")));

// 设置fallback
app.use((err, req, res, next) =>
  res.status(404).send("welcome to chenyongbin's docs")
);

app.listen(listenPort || 3000, () =>
  console.log("docs service has served from http://localhost:3000...")
);
