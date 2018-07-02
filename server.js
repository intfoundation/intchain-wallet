'use strict';

var fs = require('fs');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const WalletAccount = require("./api/tools/walletAccount");

var walletAccount = new WalletAccount();

app.use(express.static('public'));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var multer = require('multer');


app.get('/', function(req, res) {
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
    let tag = req.body;
    var result = walletAccount.decodeFromOption(tag);
    res.send(result);
    res.end();
});

app.post('/wallet/account/query/:address', async(req, res) => {
    let result = await walletAccount.getaccount(req.params.address);
    res.send(result);
    res.end();
})

/**
 * from 为发送端的秘钥
 * to为接收端的地址
 * amount为数量
 */
app.post('/wallet/spend/:from/:to/:amount', async(req, res) => {
    let from = req.params.from;
    let to = req.params.to;
    let amount = req.params.amount;
    var outarray = [{ address: to, amount: amount }];
    let result = await walletAccount.spendByAddress(from, outarray);
    res.send(result);
    res.end();
})

/**
 * 获取交易
 * address：地址
 * size：页大小
 * num：页码
 */
app.post('/wallet/transation/:address/:size/:num', async(req, res) => {
    let address = req.params.address;
    var page = { size: req.params.size, num: req.params.num };
    let result = await walletAccount.getTxByAddress(address, page);
    res.send(result);
    res.end();
})


var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})