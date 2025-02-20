const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("express-flash");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 解析 JSON 数据
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Express Session
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

// Passport 认证
app.use(passport.initialize());
app.use(passport.session());

// 闪存消息
app.use(flash());

// **主页路由**
app.get("/", (req, res) => {
  res.send("✅ Server is running on Vercel!");
});

// 监听端口（Vercel 会自动分配）
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// **导出 app，确保 Vercel 识别**
module.exports = app;
