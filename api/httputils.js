const https = require("https");
const http = require('http');
const querystring = require('querystring');

class HttpsUtil {
    constructor() {

    }

    async sendGet(url) {
        return new Promise(function(resolove, reject) {
            var result = '';
            https.get(url, function(res) {
                res.on('data', function(chunk) {
                    result += chunk;
                    console.log(result);
                });
                res.on('end', function() {
                    resolove(result);
                });
            });
        })
    }

    async sendPost(data, hostname, port, path) {
        //发送 http Post 请求  
        var postData = querystring.stringify(data);
        var options = {
            hostname: data,
            port: hostname,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        }
        return new Promise(function(resolove, reject) {
            var req = https.request(options, function(res) {
                console.log('Status:', res.statusCode);
                console.log('headers:', JSON.stringify(res.headers));
                res.setEncoding('utf-8');
                var result = '';
                res.on('data', function(chun) {
                    result += chun;
                });
                res.on('end', function() {
                    resolove(result);
                });
            });
            req.on('error', function(err) {
                console.error(err);
            });
            req.write(postData);
            req.end();

        })
    }
}


class HttpUtil {
    constructor() {

    }

    async sendGet(url) {
        return new Promise(function(resolove, reject) {
            var result = '';
            http.get(url, function(res) {
                res.on('data', function(chunk) {
                    result += chunk;
                    console.log(result);
                });
                res.on('end', function() {
                    resolove(result);
                });
            });
        });
    }

    async sendPost(data, hostname, port, path) {
        //发送 http Post 请求  
        var postData = querystring.stringify(data);
        var options = {
            hostname: data,
            port: hostname,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        }
        return new Promise(function(resolove, reject) {
            var req = http.request(options, function(res) {
                console.log('Status:', res.statusCode);
                console.log('headers:', JSON.stringify(res.headers));
                res.setEncoding('utf-8');
                var result = '';
                res.on('data', function(chun) {
                    result += chun;
                });
                res.on('end', function() {
                    resolove(result);
                });
            });
            req.on('error', function(err) {
                console.error(err);
            });
            req.write(postData);
            req.end();

        })
    }
}


module.exports.HttpsUtil = HttpsUtil;
module.exports.HttpUtil = HttpUtil;