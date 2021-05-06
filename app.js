const express = require('express')
const app = express()

// 导入跨域插件
const cors = require('cors');
// 导入路由模块
const router = require('./router/router.js');
//解析表单数据的中间件
//导入body-parser中间件
const bodyParser = require('body-parser');
const { json } = require('express');
//启用body中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
// 启用跨域资源共享
app.use(cors());
// 注册路由模块，让路由模块中的代码能够使用
app.use(router);


app.use('/images', express.static('images')) //=>把服务器端的images图片库挂载到服务器
app.use('/gdata', express.static('gdata')) //=>把服务器端的gdata地理数据挂载到服务器
app.use('/', express.static('../GIS自主学习网')) // => 把GIS前端网站挂载到服务器

app.listen(3001, () => {
    console.log('server running at http://127.0.0.1:3001');
})