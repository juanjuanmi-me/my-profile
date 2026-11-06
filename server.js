const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // 允许解析 JSON 格式的请求
app.use(express.static('public')); // 将 public 文件夹作为静态网页展示

// 接口 1：获取所有留言（按时间倒序，最新的在最上面）
app.get('/api/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages ORDER BY id DESC').all();
  res.json(messages);
});

// 接口 2：提交新留言
app.post('/api/messages', (req, res) => {
  const { name, content } = req.body;
  
  if (!name || !content) {
    return res.status(400).json({ error: '名字和留言内容不能为空哦' });
  }

  // 存入数据库
  const info = db.prepare('INSERT INTO messages (name, content) VALUES (?, ?)').run(name, content);
  
  // 返回刚刚存进去的这条留言给前端
  const newMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
  res.json({ success: true, message: newMessage });
});

// 启动服务器
app.listen(port, () => {
  console.log(`✨ 你的个人网站已启动：http://localhost:${port}`);
});