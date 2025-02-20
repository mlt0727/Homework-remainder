const express = require('express');
const router = express.Router();

/* GET 首页 */
router.get('/', function(req, res, next) {
  // 如果已登录则跳转到作业列表，否则跳转到登录页
  if(req.isAuthenticated()){
    res.redirect('/homework');
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;