// controler.js 业务处理模块
// 导入json数据模块
const { json } = require('express');
const { get } = require('http');
const dataImg = require('../db/data.json')
const dataContribute = require('../db/contribute.json')
const data = require('../db/advice.json')
const fs = require('fs');
const path = require('path');
module.exports = {
    //获取投稿的业务逻辑
    getContribute: (req, res) => {

        // console.log(req.body);
        let obj = {}
        Object.assign(obj, req.body);
        obj.img = 'http://localhost:3001/uploads/' + req.file.filename;
        obj.info = obj.nickname + ' · 2021年05月8日 · book'
        dataContribute.unshift(obj);
        //    正式的把投稿保存在json文件中
        fs.writeFile(path.join(__dirname, '../db/contribute.json'), JSON.stringify(dataContribute), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(req.body.nickname + '投稿了');
            }
        });
    },
    // 请求根目录业务逻辑
    getSorry: (req, res) => {
        res.send('亲爱的giser，抱歉！本站该资源暂未更新，这位亲可以先浏览别的资源哦~')
    },
    //获取留言的业务逻辑
    getform: (req, res) => {

        //req.query获取到的是js对象，要把他转换为json格式对象
        const time = new Date();
        const y = getZero(time.getFullYear());
        const m = getZero(time.getMonth() + 1);
        const d = getZero(time.getDate());
        const hh = getZero(time.getHours());
        const mm = getZero(time.getMinutes());
        const ss = getZero(time.getSeconds());
        // const advice = y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss + '   ' + req.query.name + '  ' + req.query.tel + '    ' + req.query.content.replace(/<p>/g, '').replace(/<\/p>/g, '');
        const advice = {};
        advice.date = y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss;
        advice.name = req.query.name;
        advice.tel = req.query.tel;
        advice.content = req.query.content;

        data.unshift(advice); //把搞定好的对象保存在advice.json中   但是此时只是保存了缓存

        //补零函数
        function getZero(num) {
            return num > 9 ? num : '0' + num;
        }

        //    正式的把留言保存在json文件中
        fs.writeFile(path.join(__dirname, '../db/advice.json'), JSON.stringify(data), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(req.query.name + '新增了留言');
            }
        });
    },
    // 获取全部逻辑接口
    // http://127.0.0.1:3001/getAllCourse
    getList: (req, res) => {
        res.json(dataImg);
    },

    //获取投稿内容
    getConlist: (req, res) => {
        res.json(dataContribute);
    },

    //把指定索引的投稿发布出去
    getPublish: (req, res) => {
        //此时接收到一个通过查询字符串传过来的索引号，这里用req.query接收
        const index = req.query.index; //接收到传递过来的索引
        const type = req.query.type; //接收到类目
        // 加个if判断，如果类目是3，则发布到图书数组中
        if (type == '3') {
            //把对应索引的投稿数据给到书籍数组最前面
            dataImg.result.book.unshift(dataContribute[index]);
        } else { //把对应索引的投稿数据给到著名院校数组最前面
            dataImg.result.college.unshift(dataContribute[index]);
        }

        dataContribute.splice(index, 1); //该索引号对应的数据
        //    正式的把投稿发布到在json文件中
        fs.writeFile(path.join(__dirname, '../db/data.json'), JSON.stringify(dataImg), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                return
            }
        });
        fs.writeFile(path.join(__dirname, '../db/contribute.json'), JSON.stringify(dataContribute), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                return
            }
        });
        res.send('okkk');
    },

    //把指定索引号的投稿删除的函数
    getDel: (req, res) => {
        const index = req.query.index; //接收到传递过来的索引
        dataContribute.splice(index, 1); //该索引号对应的数据
        fs.writeFile(path.join(__dirname, '../db/contribute.json'), JSON.stringify(dataContribute), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                return
            }
        });
        res.send('okkk');
    },
    //获取所有留言的函数
    getAdvice: (req, res) => {
        res.json(data)
    },
    //删除指定索引号的留言的函数
    delAdvice: (req, res) => {
        const index = req.query.index;
        data.splice(index, 1); //删除该索引所对应的数组
        fs.writeFile(path.join(__dirname, '../db/advice.json'), JSON.stringify(data), 'utf8', function(err) {
            if (err) {
                console.log(err.message);
            } else {
                return
            }
        });
        res.send('okkk');
    }

}