// router.js 路由模块
const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer'); //导入可接收formdata的中间件

var storage = multer.diskStorage({ //终于配置好了  哭哭   上面那个属性控制文件保存路径，下面那个控制文件名
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.png')
    }
})

const upload = multer({
        storage: storage,
        dest: path.join(__dirname, '../uploads')
    })
    // 导入业务处理模块
const ctrl = require('../constroler/controler.js')


// sorry的路由函数
router.get('/sorry', ctrl.getSorry)

router.post('/form', ctrl.getform)

// 获取所有列表
router.get('/getList', ctrl.getList)

//储存用户投稿的路由函数
router.post('/contribute', upload.single('cover_img'), ctrl.getContribute)

//把指定索引号的投稿发布出去的路由函数
router.post('/Pub', ctrl.getPublish)

//获取用户投稿的路由函数
router.get('/getContribute', ctrl.getConlist)

//获取用户留言的路由函数
router.get('/getAdvice', ctrl.getAdvice)

//把指定索引号的投稿删除的路由函数
router.post('/Del', ctrl.getDel)

//把指定索引号的留言删除的路由函数
router.post('/delAdvice', ctrl.delAdvice)

//把指定索引号的数据内容删除的路由函数
router.post('/delData', ctrl.delData);

//两个路由函数，addVisitor：新增一访客；  addAdvice：更新当前留言数量
router.get('/addVisitor', ctrl.addVisitor);
router.get('/addAdvice', ctrl.addAdvice);

//数据的修改功能
router.post('/edit', ctrl.editData);
// 导出路由模块
module.exports = router