const express = require('express');
const router = express.Router();
const Homework = require('../models/homework');

// 中间件：检查用户是否已登录
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

// 作业列表页面
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const homeworks = await Homework.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('homework_list', { homeworks });
  } catch (error) {
    res.status(500).send('服务器错误');
  }
});

// 添加作业页面
router.get('/add', isAuthenticated, (req, res) => {
  res.render('add_homework');
});

// 编辑作业页面
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const homework = await Homework.findOne({ _id: req.params.id, user: req.user._id });
    if (!homework) {
      return res.status(404).send('作业不存在');
    }
    res.render('edit_homework', { homework });
  } catch (error) {
    res.status(500).send('加载作业失败');
  }
});

// 处理编辑作业请求
router.post('/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const homework = await Homework.findOne({ _id: req.params.id, user: req.user._id });
    if (!homework) {
      return res.status(404).send('作业不存在');
    }

    // 调整日期时区
    const adjustedDate = dueDate ? new Date(new Date(dueDate).getTime() + 24 * 60 * 60 * 1000) : null;

    homework.title = title;
    homework.description = description;
    homework.dueDate = adjustedDate;

    await homework.save();
    res.redirect('/homework');
  } catch (error) {
    res.status(500).send('更新作业失败');
  }
});

// 切换作业完成状态
router.post('/:id/toggle', isAuthenticated, async (req, res) => {
  try {
    const homework = await Homework.findOne({ _id: req.params.id, user: req.user._id });
    if (!homework) {
      return res.status(404).send('作业不存在');
    }
    homework.completed = !homework.completed;
    await homework.save();
    res.redirect('/homework');
  } catch (error) {
    res.status(500).send('更新失败');
  }
});

// 修改添加作业的时区处理
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    // 调整日期时区
    const adjustedDate = dueDate ? new Date(new Date(dueDate).getTime() + 24 * 60 * 60 * 1000) : null;

    const homework = new Homework({
      title,
      description,
      dueDate: adjustedDate,
      user: req.user._id
    });
    await homework.save();
    res.redirect('/homework');
  } catch (error) {
    res.status(500).send('添加作业失败');
  }
});

// 删除作业
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await Homework.deleteOne({ _id: req.params.id, user: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: '作业不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除失败' });
  }
});

module.exports = router;