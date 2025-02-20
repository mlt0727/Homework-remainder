const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require('connect-mongo');
const flash = require('express-flash');

// 引入用户模型
const User = require('./models/user');

// 从环境变量获取MongoDB连接URL，如果没有则使用本地连接
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/homework-manager';

// 连接 MongoDB
mongoose.connect(MONGODB_URI, {    
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// 监听MongoDB连接事件
mongoose.connection.on('error', (err) => {
  console.error('MongoDB连接错误:', err);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB连接成功！');
});

const app = express();

// 设置视图目录和模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// 配置 session（使用 MongoStore 将 session 存储到 MongoDB）
app.use(session({
  secret: process.env.SESSION_SECRET || 'homework-manager-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI })
}));

// 初始化 Passport
app.use(passport.initialize());
app.use(passport.session());

// 配置 Passport 使用本地策略
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 导入路由
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const homeworkRouter = require('./routes/homework');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/homework', homeworkRouter);

// 捕获 404 错误
app.use(function(req, res, next) {
  res.status(404).send('404 Not Found');
});

// 错误处理中间件
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动服务器
const port = process.env.PORT || 3000;

// 添加端口检查和错误处理
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`服务器启动成功，访问地址：http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用，请尝试使用其他端口或关闭占用端口的程序。`);
    process.exit(1);
  } else {
    console.error('服务器启动失败:', err);
    process.exit(1);
  }
});

module.exports = app;
