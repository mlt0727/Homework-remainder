const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // 密码字段将由 passport-local-mongoose 自动处理
});

// 自动添加 username、hash、salt 字段并生成辅助方法
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);