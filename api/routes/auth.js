const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// 登录页面
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

// 处理登录请求
router.post('/login', passport.authenticate('local', {
  successRedirect: '/homework',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

// 注册页面
router.get('/register', (req, res) => {
  res.render('register', { error: req.flash('error') });
});

// 处理注册请求
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    await User.register(user, password);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/homework');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/auth/register');
  }
});

// 退出登录
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;