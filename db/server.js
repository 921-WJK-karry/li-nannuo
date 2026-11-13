// 作者：李南诺 | 建立时间：2026-11-13 | 使用大模型：DeepSeek-V4.1-Flash | 功能名称：诗歌与作者数据接口服务器
// 启动方式：在 db 目录执行 node server.js
// 接口地址：
//   GET http://127.0.0.1:3004/api/poems    —— 诗歌列表
//   GET http://127.0.0.1:3004/api/authors  —— 作者列表

const express = require('express');
const fs = require('fs');
const path = require('path');

const LNN_app = express();
const LNN_PORT = 3004;
const LNN_DB_FILE = path.join(__dirname, 'db.json');

// 允许跨域，页面无论是从 8333 端口还是直接双击打开都能取到数据
LNN_app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// 读取 db.json 并返回某个字段的数组，字段不存在时返回空数组
function LNN_readList(LNN_key) {
  const LNN_raw = fs.readFileSync(LNN_DB_FILE, 'utf8');
  const LNN_data = JSON.parse(LNN_raw);
  return LNN_data[LNN_key] || [];
}

// 诗歌列表接口
LNN_app.get('/api/poems', function (req, res) {
  try {
    res.json(LNN_readList('poems'));
  } catch (err) {
    res.status(500).json({ error: '读取 db.json poems 失败：' + err.message });
  }
});

// 作者列表接口
LNN_app.get('/api/authors', function (req, res) {
  try {
    res.json(LNN_readList('authors'));
  } catch (err) {
    res.status(500).json({ error: '读取 db.json authors 失败：' + err.message });
  }
});

// 根路径给一句提示，避免直接访问 3004 端口时看到空白
LNN_app.get('/', function (req, res) {
  res.type('text/plain; charset=utf-8').send(
    '诗歌数据服务已启动\n' +
    '  GET /api/poems    —— 诗歌列表\n' +
    '  GET /api/authors  —— 作者列表\n'
  );
});

// 监听 3004 端口
LNN_app.listen(LNN_PORT, function () {
  console.log('数据服务器已启动：http://127.0.0.1:' + LNN_PORT);
});
