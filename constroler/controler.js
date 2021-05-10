// controler.js 业务处理模块
// 导入json数据模块
const { json } = require('express');
const { get } = require('http');
const dataImg = require('../db/data.json')
const dataContribute = require('../db/contribute.json')
const data = require('../db/advice.json')
const num = require('../db/num.json');
const fs = require('fs');
const path = require('path');

// 封装一个函数，把缓存中的数据保存到真实的jaon数据中。用法：输入参数，即保存该内容
function saveJson(data) {
    let url = '';
    switch (data) {
        case dataContribute:
            url = '../db/contribute.json';
            break;
        case data:
            url = '../db/advice.json';
            break;
        case dataImg:
            url = '../db/data.json'
            break;
    };
    //    正式的把数据保存在json文件中
    fs.writeFile(path.join(__dirname, url), JSON.stringify(data), 'utf8', function(err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('okk');
        }
    });
}

/* function saveJson(db) {
    let url = '';
    if (db == 'dataContribute') {
        url = '../db/contribute.json';
    } else if (db == 'data') {
        url = '../db/advice.json';
    } else if (db == 'dataImg') {
        url = '../db/data.json'
    }
    //    正式的把数据保存在json文件中
    fs.writeFile(path.join(__dirname, url), JSON.stringify(db), 'utf8', function(err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('okk');
        }
    });
} */


// 封装函数，通过获取到的type值，判断对应的是哪个文件数组
function getType(type) {
    let key = '';

    switch (type) {
        case '0':
            key = 'college';
            break;
        case '1':
            key = 'note';
            break;
        case '2':
            key = 'video';
            break;
        case '3':
            key = 'book';
            break;
        case '4':
            key = 'data';
            break;
        case '5':
            key = 'job';
            break;
        default:
            key = 'error'
    }
    return key;
}

function saveNum() {
    //写入到数据中
    fs.writeFile(path.join(__dirname, '../db/num.json'), JSON.stringify(num), 'utf8', function(err) {
        if (err) {
            console.log(err.message);
        } else {
            return
        }
    });
}

// ---------------------------------------------------------以上是函数区域，请勿打扰--------------------------------------------------------------



module.exports = {
    //客户端提交投稿的业务逻辑
    getContribute: (req, res) => {

        // console.log(req.body);
        let obj = JSON.parse(JSON.stringify(req.body));
        obj.img = 'http://localhost:3001/uploads/' + req.file.filename;
        obj.info = obj.nickname + ' · 2021年05月8日 · book'

        dataContribute.unshift(obj);
        //    正式的把投稿保存在json文件中
        saveJson(dataContribute);

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
        /*         fs.writeFile(path.join(__dirname, '../db/advice.json'), JSON.stringify(data), 'utf8', function(err) {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log(req.query.name + '新增了留言');
                    }
                }); */
        saveJson(data);
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
        /*         // 加个if判断，如果类目是3，则发布到图书数组中
                if (type == '3') {
                    //把对应索引的投稿数据给到书籍数组最前面
                    dataImg.result.book.unshift(dataContribute[index]);
                } else { //把对应索引的投稿数据给到著名院校数组最前面
                    dataImg.result.college.unshift(dataContribute[index]);
                } */
        let key = getType(type);
        // console.log("123", key);
        // console.log(dataImg.result[key]); //
        // console.log(dataImg.result.book);//ok
        dataImg.result[key].unshift(dataContribute[index]);
        dataContribute.splice(index, 1); //删除投稿列表中该索引号对应的数据
        //    正式的把投稿发布到在json文件中


        // saveJson(dataImg);
        // saveJson(dataContribute);
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
        saveJson(dataContribute);
        res.send('okkk');
    },

    //把指定索引号的数据删除的函数
    delData: (req, res) => {
        const index = req.query.index; //接收到传递过来的索引
        const type = req.query.type; //接收到类目
        const key = getType(type); //解译当前类目所对应的数组
        dataImg.result[key].splice(index, 1); //删除该数组指定索引的数据
        //写入到数据中
        fs.writeFile(path.join(__dirname, '../db/data.json'), JSON.stringify(dataImg), 'utf8', function(err) {
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
        saveJson(data);
        res.send('okkk');
    },

    //每次请求都让访客数量+1
    addVisitor: (req, res) => {
        num.allvisitors++;
        num.newvisitors++;
        saveNum();
        res.send('okk');
    },
    // 每次请求都更新当前留言数量
    addAdvice: (req, res) => {
        num.alladvices = data.length;
        num.newadvices = num.alladvices - 2;
        saveNum();
        res.json(num);
    },



}