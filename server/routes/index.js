var express = require('express');
const models = require('../db/models')
var router = express.Router();
const UserModel = models.UserModel
const ChatModel = models.ChatModel
const md5 = require('blueimp-md5')
const filter = { password: 0 }

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function (req, res) {
  const { username, password, type } = req.body
  UserModel.findOne({ username }, function (err, user) {
    if (user) {
      res.send({ code: 1, msg: '此用户已存在' })
    } else {
      new UserModel({ username, type, password: md5(password) }).save(function (err, user) {
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
        const data = { username, type, _id: user._id }
        res.send({ code: 0, data })
      })
    }
  })
})

router.post('/login', function (req, res) {
  const { username, password } = req.body
  UserModel.findOne({ username, password: md5(password) }, filter, function (err, user) {
    if (user) {
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 })
      res.send({ code: 0, data: user })
    } else {
      res.send({ code: 1, msg: '用户名或密码错误' })
    }
  })
})

router.post('/update', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    res.send({ code: 1, msg: '请先登陆' })
  }
  else {
    const user = req.body
    UserModel.findByIdAndUpdate({ _id: userid }, user, function (err, oldUser) {
      if (!oldUser) {
        res.clearCookie('userid')
        res.send({ code: 1, msg: '请先登陆' })
      }
      else {
        const { _id, username, type } = oldUser
        const data = Object.assign(user, { _id, username, type })
        res.send({ code: 0, data })
      }
    })
  }
})
router.get('/user', function (req, res) {
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: '请先登陆' })
  }
  UserModel.findOne({ _id: userid }, filter, function (err, user) {
    res.send({ code: 0, data: user })
  })
})

router.get('/userlist', function (req, res) {
  const { type } = req.query
  UserModel.find({ type }, filter, function (err, users) {
    res.send({ code: 0, data: users })
  })
})

router.get('/msglist', function (req, res) {
  // 获取 cookie 中的 userid 
  const userid = req.cookies.userid
  // 查询得到所有 user 文档数组 
  UserModel.find(function (err, userDocs) { // 用对象存储所有 user 信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象 
    const users = {} // 对象容器 
    userDocs.forEach(doc => {
      users[doc._id] = {
        username: doc.username, header: doc.header
      }
    })
    /*查询 userid 相关的所有聊天信息 参数 1: 查询条件 参数 2: 过滤条件 参数 3: 回调函数 */
    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function (err, chatMsgs) {
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据 
      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})

router.post('/readmsg', function (req, res) { // 得到请求中的 from 和 to 
  const from = req.body.from
  const to = req.cookies.userid
  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function (err, doc) {   
    console.log('/readmsg', doc)
    res.send({ code: 0, data: doc.nModified }) // 更新的数量 
  })
})


module.exports = router;
