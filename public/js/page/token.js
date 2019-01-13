app.controller('voteController', function($scope) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.step = 1;
    $scope.ch = "keyStore"
    $scope.pwdView = false
    $scope.password = ''
    $scope.unlockDisabled = true
    $scope.keyStoreUnlockFail = false
    $scope.privateKeyUnlockFail = false
    $scope.privateKeyView = false
    $scope.votePass = false
    $scope.action = new modal.UrlSearch().action
        //钱包信息相关
    $scope.privateKey = ""
    $scope.name;
    $scope.symbol;
    $scope.tokenid = '';
    $scope.createAmount;
    $scope.createLimit;
    $scope.price;



    $scope.address = ""
    $scope.balance = 0;
    $scope.toAddress = '';
    $scope.transferAmount;
    $scope.transferLimit;
    $scope.tokenBalance = '';

    $scope.title = "";
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    document.title = $scope.doc[$scope.action.toLocaleLowerCase()] + '| INT Chain';
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
        document.title = $scope.doc[$scope.action.toLocaleLowerCase()] + '| INT Chain';
        $scope.title = $scope.doc[$scope.action.toLocaleLowerCase()]
    }

    $scope.$watch('action', function(val) {
        document.title = $scope.doc[$scope.action.toLocaleLowerCase()] + '| INT Chain';

        $scope.title = $scope.doc[val.toLocaleLowerCase()]

    })
    $scope.$watch('password', function(newValue, oldValue) {
        if ($scope.password.length >= 9) {
            $scope.unlockDisabled = false
        } else {
            $scope.unlockDisabled = true
        }
    });
    $scope.getCreateLimit = function() {
        var wal = require("wal"); //{ tokenid: contract, amount: newAmount, name, symbol };
        if (!$scope.createAmount || !$scope.name || !$scope.symbol) {
            return;
        }
        wal.getLimit('createToken', JSON.stringify({
            tokenid: 'INT0000000000000000000000000000000000',
            amount: $scope.createAmount,
            name: $scope.name,
            symbol: $scope.symbol

        })).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.createLimit = data.limit
            $scope.$apply();
        })
    }


    $scope.getTransferLimit = function() {
        var wal = require("wal");
        wal.getLimit('transferTokenTo', JSON.stringify({ tokenid: $scope.tokenid, to: $scope.toAddress, amount: $scope.transferAmount })).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.transferLimit = data.limit
            $scope.$apply();
        })
    }

    $scope.$watch('{t:tokenid,ta:toAddress,a:transferAmount}', function(v) {
        if (v.t && v.ta && !isNaN(v.a) && v.a > 0) {
            $scope.getTransferLimit()
        }
    })

    $scope.$watch('{symbol:symbol,name:name,amount:createAmount,limit:createLimit,price:price}', function(v) {
        if (v.symbol && v.name && v.amount && v.limit && v.price) {
            $scope.createPass = true
        } else {
            $scope.createPass = false
        }
    })

    $scope.$watch('{toAddress:toAddress,amount:transferAmount,limit:transferLimit,price:price,tokenid:tokenid}', function(v) {
        if (v.toAddress && v.amount && v.limit && v.price && v.tokenid) {
            $scope.transferPass = true
        } else {
            $scope.transferPass = false
        }
    })



    $scope.$watch('tokenid', function(val) {
        var wal = require("wal");
        if (wal.isValidAddress(val)) {
            wal.getTokenBalance($scope.tokenid, $scope.address).then(function(data) {
                if (typeof data === 'string') {
                    data = JSON.parse(data)
                }
                if (data.err) {
                    modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    return;
                }
                $scope.tokenBalance = modal.numformat(data.balance)
                if ($scope.tokenBalance == null) {
                    $scope.balance = 0;
                }
            })
        }
    })


    $scope.getbalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.balance = modal.numformat(data.balance)
            if ($scope.balance == null) {
                $scope.balance = 0;
            }
            $scope.step = 2;
            $scope.$apply();
        });
    };


    $scope.timeGetBalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if ($scope.balance == modal.numformat(data.balance)) {
                setTimeout(function() {
                    $scope.timeGetBalance()
                }, 300)
            } else {
                $scope.balance = modal.numformat(data.balance)
                $scope.$apply();
            }
        });
    }
    $scope.transferTokenTo = function() {
        var wal = require("wal");

        if (!wal.isValidAddress($scope.tokenid)) {
            modal.error({ msg: $scope.doc.tnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        if (!wal.isValidAddress($scope.toAddress)) {
            modal.error({ msg: $scope.doc.tanv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.transferAmount) || $scope.transferAmount < 1 / Math.pow(10, 18)) {
            modal.error({ msg: $scope.doc.anv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (+$scope.transferAmount > +$scope.tokenBalance) {
            modal.error({ msg: $scope.doc.amltb, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.transferLimit) || $scope.transferLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.price) || $scope.price <= 0) {
            modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        //tokenid, to, amount, limit, price, secret
        wal.transferTokenTo($scope.tokenid, $scope.toAddress, $scope.transferAmount, $scope.transferLimit, $scope.price, $scope.privateKey)
            .then(function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    return;
                }

                modal.showInfo(res.info, $scope.doc, function() {
                    wal.sendSignedTransaction(res.renderStr).then(function(r) {
                        if (typeof r === 'string') {
                            r = JSON.parse(r)
                        }
                        if (r.err) {
                            modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                        } else {
                            modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })
                            $scope.timeGetBalance()
                        }
                    })
                })
            })
    }

    $scope.createToken = function() {
        var wal = require("wal");
        if (!$scope.name) {
            modal.error({ msg: $scope.doc.tnnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (!$scope.symbol) {
            modal.error({ msg: $scope.doc.tsnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        if (isNaN($scope.createAmount) || $scope.createAmount < Math.pow(10, -18) || $scope.createAmount >= Math.pow(10, 18)) {
            modal.error({ msg: $scope.doc.amountNv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.createLimit) || $scope.createLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.price) || $scope.price <= 0) {
            modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        //amount, limit, price, name, symbol, secret

        wal.createToken($scope.createAmount, $scope.createLimit, $scope.price, $scope.name, $scope.symbol, $scope.privateKey)
            .then(function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    return;
                }

                modal.showInfo(res.info, $scope.doc, function() {
                    wal.sendSignedTransaction(res.renderStr).then(function(r) {
                        if (typeof r === 'string') {
                            r = JSON.parse(r)
                        }
                        if (r.err) {
                            modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                        } else {
                            modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash + '\n tokenid:' + JSON.parse(res.info.Input).tokenid })
                            $scope.timeGetBalance()
                        }
                    })
                })
            })
    }

    $scope.enterUnlock = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && !$scope.unlockDisabled) {
            $scope.unlock();
        }
    }
    $scope.unlock = function() {
        if ($scope.ch === "keyStore") {
            $scope.keyStoreUnlock()
        }
        if ($scope.ch === "privateKey") {
            $scope.privateKeyUnlock()
        }
    }
    $scope.keyStoreUnlock = function() {
        var file = $scope.file;
        var reader = new FileReader();
        reader.onload = function() {
            var filedata = JSON.parse(this.result);
            var wal = require("wal");
            wal.decodeFromOption(filedata, $scope.password).then(function(data) {
                if (data == "error") {
                    $scope.keyStoreUnlockFail = true
                    $scope.$apply();
                    return;
                }
                $scope.address = filedata.address;
                $scope.privateKey = data;
                $scope.keyStoreUnlockFail = false;
                $scope.getbalance();
                $scope.getPrice();
                $scope.$apply();
            })
        }
        reader.readAsText(file);

    };

    $scope.getPrice = function() {
        var wal = require("wal");
        wal.getPrice().then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.price = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.$apply();
        })
    }
    $scope.privateKeyUnlock = function() {
        if ($scope.privateKey.length != 64) {
            $scope.privateKeyUnlockFail = true
            return
        }
        var wal = require("wal");
        $scope.address = wal.addressFromPrivateKey($scope.privateKey)
        if (!$scope.address) {
            $scope.privateKeyUnlockFail = true
        } else {
            $scope.getbalance()
            $scope.getPrice()
            $scope.step = 2;
        }
        $scope.$apply();
    }

    $scope.enterVote = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.votePass) {
            $scope.Vote();
        }
    }

    $scope.enterMorgage = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.morgagePass) {
            $scope.Morgage();
        }
    }

    $scope.enterUnmorgage = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.unmorgagePass) {
            $scope.Unmorgage();
        }
    }

});