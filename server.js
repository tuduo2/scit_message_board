import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors({
   origin:'*',
    methods:'GET,PUT,POST'
}));
app.use(express.json());

// 创建数据库连接
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 连接到数据库
db.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err.stack);
        return;
    }
    console.log('成功连接到数据库');
});

// 创建留言表
db.query(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) throw err;
    console.log('留言表已创建或已存在');
});

// 创建评论表
db.query(`CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id INT,
    username VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id)
)`, (err) => {
    if (err) throw err;
    console.log('评论表已创建或已存在');
});

// 创建留言
app.post('/api/messages', (req, res) => {
    const { username, content } = req.body;
    const query = 'INSERT INTO messages (username, content) VALUES (?, ?)';
    db.query(query, [username, content], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, username, content });
    });
});

// 获取所有留言
app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 创建评论
app.post('/api/comments', (req, res) => {
    const { message_id, username, content } = req.body;
    const query = 'INSERT INTO comments (message_id, username, content) VALUES (?, ?, ?)';
    db.query(query, [message_id, username, content], (err, results) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: results.insertId, message_id, username, content });
    });
});

// 获取某个留言及其评论
app.get('/api/messages/:id', (req, res) => {
    const messageId = req.params.id;
    const query = `
        SELECT m.*, c.username AS comment_user, c.content AS comment_content, c.created_at AS comment_created_at
        FROM messages m
        LEFT JOIN comments c ON m.id = c.message_id
        WHERE m.id = ?`;

    db.query(query, [messageId], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ error: "Message not found." });
        }

        // 提取留言数据
        const messageData = {
            id: results[0].id,
            username: results[0].username,
            content: results[0].content,
            created_at: results[0].created_at,
            comments: []
        };

        // 提取评论数据
        results.forEach(row => {
            if (row.comment_user) { // 确保有评论数据
                messageData.comments.push({
                    username: row.comment_user,
                    content: row.comment_content,
                    created_at: row.comment_created_at
                });
            }
        });

        // 返回结构
        res.json({ message: messageData });
    });
});
// 通过关键字查找留言，返回前 x 条留言
app.get('/api/messages/search', (req, res) => {
    const { keyword } = req.query;
    const limit = parseInt(req.query.limit) || 10; // 默认返回 10 条留言

    const query = 'SELECT * FROM messages WHERE content LIKE ? ORDER BY created_at DESC LIMIT ?';
    db.query(query, [`%${keyword}%`, limit], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// 随机抽取 x 条留言
app.get('/api/messages/random', (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // 默认获取 5 条随机留言
    const query = 'SELECT * FROM messages ORDER BY RAND() LIMIT ?';

    db.query(query, [limit], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 获取最新的 x 条留言
app.get('/api/messages/latest', (req, res) => {
    const limit = parseInt(req.query.limit) || 5; // 默认获取 5 条最新留言
    const query = 'SELECT * FROM messages ORDER BY created_at DESC LIMIT ?';

    db.query(query, [limit], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// 获取留言下的部分评论
app.get('/api/messages/:id/comments', (req, res) => {
    const messageId = req.params.id;
    const limit = parseInt(req.query.limit) || 5; // 默认获取 5 条评论
    const query = 'SELECT * FROM comments WHERE message_id = ? ORDER BY created_at DESC LIMIT ?';
    
    db.query(query, [messageId, limit], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});
// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});