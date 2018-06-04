'use strict';

var fs = require('fs');
// var url = require('url');
// var path = require('path');
// var http = require('http');
// var root = path.resolve(process.argv[2] || '.');

// console.log('Static root dir: ' + root);

// var server = http.createServer(function(request, response) {
//     var pathname = url.parse(request.url).pathname;

//     if (pathname === '/') {
//         pathname += 'index.html';
//     }

//     var filepath = path.join(root, pathname);

//     fs.stat(filepath, function(err, stats) {
//         if (!err && stats.isFile()) {
//             console.log('200 ' + request.url);
//             response.writeHead(200);
//             fs.createReadStream(filepath).pipe(response);
//         } else {
//             console.log('404 ' + request.url);
//             response.writeHead(404);
//             response.end('404 Not Found');
//         }
//     });
// });

// server.listen(8081);
// console.log('nasWallet is running at http://127.0.0.1:8081/');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WalletAccount = require("./api/tools/walletAccount");

app.use(express.static('public'));
//body-parser 解析json格式数据
app.use(bodyParser.json({ limit: '1mb' }));
//此项必须在 bodyParser.json 下面,为参数编码
app.use(bodyParser.urlencoded({ extended: true }));
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var multer = require('multer');


var qr_image = require('qr-image');
app.get('/qrcode/:address', function(req, res) {
    if (req.params) {
        var temp_qrcode = qr_image.image(req.params.address);
        res.type('png');
        temp_qrcode.pipe(res);
    }
})

app.get('/', function(req, res) {
    //res.send('Hello POST');
    res.sendFile(__dirname + '/public/' + "index.html");
});

app.get('/index', function(req, res) {
    res.send('Hello POST');
});

/**
 * 钱包生成
 */
app.post('/wallet/make', async(req, res) => {
    console.log(req.body);
    let tag = req.body;
    if (tag) {
        var walletAccount = new WalletAccount();
        var wallet = walletAccount.makeWalletAccount(tag.pwd);
        var result = JSON.stringify(wallet);
        var fileName = wallet.address + '.json';
        res.set({
            "Content-type": "application/octet-stream",
            "Content-Disposition": "attachment;filename=" + encodeURI(fileName),
            "jsonfilename": encodeURI(fileName)
        });
        var buffer = new Buffer(result, "binary");
        res.write(buffer);
    } else {

    }
    res.end();
});

/**
 * 解锁文件
 */
app.post('/wallet/unlock', async(req, res) => {
    console.log(req.body);
    let tag = req.body;
    var result = new WalletAccount().decodeFromOption(tag);
    res.send(result);
    res.end();
});

app.get('/', function(req, res) {
    res.send('Hello POST');
});

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})