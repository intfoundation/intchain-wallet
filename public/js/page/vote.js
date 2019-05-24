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
    $scope.address = ""
    $scope.balance = 0;
    $scope.vote = 0;
    $scope.toAddress;
    $scope.amount;
    $scope.voteLimit;
    $scope.votePrice
    $scope.chNum = 0
    $scope.morgageAmount;
    $scope.morgageLimit;
    $scope.morgagePrice;
    $scope.morgagePass = false;
    $scope.unmorgageAmount;
    $scope.unmorgageLimit;
    $scope.unmorgagePrice;
    $scope.unmorgagePass = false;
    $scope.searchStr = "";
    $scope.nodes = []
    $scope.title = "";
    $scope.voteRecord = {};

    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.doc = lan[$scope.lan]
    document.title = $scope.doc[$scope.action.toLocaleLowerCase()] + '| INT Chain';
    $scope.changelan = function(a) {
        myVue.changeLan(a)
        $scope.doc = lan[a]
        $scope.lan = a
        $scope.title = $scope.doc[$scope.action.toLocaleLowerCase()]
        document.title = $scope.doc[$scope.action.toLocaleLowerCase()] + '| INT Chain';
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
    $scope.$watch('{chNum:chNum,voteLimit:voteLimit,votePrice:votePrice}', function(v) {
        if (v.chNum && v.voteLimit && v.votePrice) {
            $scope.votePass = true
        } else {
            $scope.votePass = false
        }
    })
    $scope.$watch('{morgageAmount:morgageAmount,morgageLimit:morgageLimit,morgagePrice:morgagePrice}', function(v) {
        if (v.morgageAmount && v.morgageLimit && v.morgagePrice) {
            $scope.morgagePass = true
        } else {
            $scope.morgagePass = false
        }
    })
    $scope.$watch('{unmorgageAmount:unmorgageAmount,unmorgageLimit:unmorgageLimit,unmorgagePrice:unmorgagePrice}', function(v) {
        if (v.unmorgageAmount && v.unmorgageLimit && v.unmorgagePrice) {
            $scope.unmorgagePass = true
        } else {
            $scope.unmorgagePass = false
        }
    })
    $scope.showRecord = function() {
        window.open("./reward.html?address=" + $scope.address + "&lan=" + $scope.lan)
            // if ($scope.vote == 0) {
            //     $scope.voteRecord.candidates = [];
            // }
            // modal.nodeList({
            //     okText: $scope.doc.confirm,
            //     time: $scope.voteRecord.time,
            //     nodes: $scope.voteRecord.candidates
            // }, $scope.doc)
    }
    $scope.chooseNodes = function(index) {
        let chNum = 0
        if ($scope.chNum >= 20 && !$scope.nodes[index].ch) {
            modal.error({ msg: $scope.doc.m20, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return;
        }
        $scope.nodes[index].ch = !$scope.nodes[index].ch;
        for (let n of $scope.nodes) {
            if (n.ch) chNum++
        }
        $scope.chNum = chNum;
        $scope.getLimit('vote')
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
                myVue.address = filedata.address
                $scope.privateKey = data;
                myVue.privateKey = data;
                $scope.keyStoreUnlockFail = false;
                $scope.step = 2;
                $scope.getbalance();
                $scope.getVotes();
                //$scope.getPrice();
                //$scope.getVoteRecord();
                $scope.$apply();
            })
        }
        reader.readAsText(file);

    };
    $scope.getLimit = function(method, input) {
        if (method == 'vote') {
            let candies = [];
            for (let n of $scope.nodes) {
                if (n.ch) {
                    candies.push(n.node)
                }
            }
            input = JSON.stringify({ candidates: candies })
        }

        if (method == 'unmortgage' && (!$scope.unmorgageAmount || isNaN($scope.unmorgageAmount))) {
            return
        }
        if (method == 'mortgage' && (!$scope.morgageAmount || isNaN($scope.morgageAmount))) {
            return
        }
        var wal = require("wal");
        wal.getLimit(method, input).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            if (method == 'vote') {
                $scope.voteLimit = data.limit
            } else if (method == 'mortgage') {
                $scope.morgageLimit = data.limit
            } else if (method == 'unmortgage') {
                $scope.unmorgageLimit = data.limit
            }
            $scope.$apply();
        })
    }

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
            $scope.votePrice = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.morgagePrice = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.unmorgagePrice = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            myVue.price = (data.gasPrice / Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
            $scope.$apply();
        })
    }
    $scope.getPrice();
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
            myVue.address = $scope.address;
            myVue.privateKey = $scope.privateKey;
            $scope.getbalance()
            $scope.getVotes();
            //$scope.getPrice()
            //$scope.getVoteRecord()
            $scope.step = 2;
        }
        $scope.$apply();
    }
    $scope.getVoteRecord = function() {
        var wal = require("wal");
        wal.voteRecord($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            //$scope.balance = new Number(data.balance / Math.pow(10, 18)).toLocaleString().replace(/,/g, '');
            $scope.voteRecord = data
            $scope.$apply();
        });
    }
    $scope.timeGetVoteRecord = function() {
        var wal = require("wal");
        wal.voteRecord($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if ($scope.voteRecord.time == data.time) {
                setTimeout(function() {
                    $scope.timeGetVoteRecord()
                }, 300)
            } else {
                $scope.voteRecord = data
                $scope.$apply();
            }
        });
    }
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
            //$scope.balance = new Number(data.balance / Math.pow(10, 18)).toLocaleString().replace(/,/g, '');
            $scope.balance = modal.numformat(data.balance)
            if ($scope.balance == null) {
                $scope.balance = 0;
            }

            //$scope.getNodes()
            //$scope.getVotes();
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
    $scope.getNodes = function() {
        var wal = require("wal");
        wal.getNodes().then(function(nodes) {
            $scope.nodes = nodes.sort(modal.sortNum);
            for (let n of $scope.nodes) {
                n.num = modal.numformat(n.num)
            }

            $scope.$apply();
        })
    }
    $scope.getNodes();
    $scope.timeGetNodes = function() {
        var wal = require("wal");
        wal.getNodes().then(function(nodes) {
            let flag = false;
            for (let n of $scope.nodes) {
                for (let node of nodes) {
                    if (n.node == node.node && n.num != modal.numformat(node.num)) {
                        n.num = modal.numformat(node.num)
                        flag = true;
                        $scope.getVoteRecord();
                        $scope.$apply();
                    }
                }
            }
            if (!flag) {
                setTimeout(function() {
                    $scope.timeGetNodes()
                }, 1000)
            }
        })
    }
    $scope.getVotes = function() {
        var wal = require("wal");
        wal.getVotes($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.vote = modal.numformat(data.stake)
            $scope.$apply()
        });
    }
    $scope.timeGetVote = function() {
        var wal = require("wal");
        wal.getVotes($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if ($scope.vote == modal.numformat(data.stake)) {
                setTimeout(function() {
                    $scope.timeGetVote()
                }, 1000)
            } else {
                $scope.vote = modal.numformat(data.stake)
                $scope.$apply();
            }
        });
    }
    $scope.enterVote = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.votePass) {
            $scope.Vote();
        }
    }
    $scope.Vote = function() {
        if (+$scope.vote <= 0) {
            modal.error({ msg: $scope.doc.mf, title: $scope.doc.notice, okText: $scope.doc.confirm }, function() {
                $scope.action = 'Mortgage'
                $scope.$apply();
            })
            return
        }
        if (isNaN($scope.voteLimit) || +$scope.voteLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.votePrice) || +$scope.votePrice <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        let candies = [];
        for (let n of $scope.nodes) {
            if (n.ch) {
                candies.push(n.node)
            }
        }
        var wal = require("wal");
        wal.vote(candies, $scope.voteLimit, $scope.votePrice, $scope.privateKey).then(
            function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                } else {
                    modal.showInfo(res.info, $scope.doc, function() {
                        wal.sendSignedTransaction(res.renderStr).then(function(r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                // modal.success({ msg: r.hash })
                                modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })
                                $scope.timeGetBalance();
                                $scope.timeGetNodes();
                                $scope.timeGetVoteRecord();
                            }
                        })
                    })
                }
            }
        )
    }

    $scope.enterMorgage = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.morgagePass) {
            $scope.Morgage();
        }
    }
    $scope.Morgage = function() {
        if (isNaN($scope.morgageAmount) || +$scope.morgageAmount <= 0) {
            modal.error({ msg: $scope.doc.anv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        if (isNaN($scope.morgageLimit) || +$scope.morgageLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.morgagePrice) || +$scope.morgagePrice <= 0) {
            modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        if ($scope.balance - $scope.morgageAmount < 0.05) {
            modal.error({ msg: $scope.doc.mortgageTip, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        var wal = require("wal");
        wal.mortgage($scope.morgageAmount, $scope.morgageLimit, $scope.morgagePrice, $scope.privateKey).then(
            function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                } else {
                    modal.showInfo(res.info, $scope.doc, function() {
                        wal.sendSignedTransaction(res.renderStr).then(function(r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                //modal.success({ msg: r.hash })
                                modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })
                                $scope.timeGetNodes();
                                $scope.timeGetBalance()
                                $scope.timeGetVote()
                            }
                        })
                    })
                }
            }
        )
    }
    $scope.enterUnmorgage = function(e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13 && $scope.unmorgagePass) {
            $scope.Unmorgage();
        }
    }
    $scope.Unmorgage = function() {
        if (isNaN($scope.unmorgageAmount) || +$scope.unmorgageAmount <= 0 || +$scope.unmorgageAmount > +$scope.vote) {
            modal.error({ msg: $scope.doc.anv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.unmorgageLimit) || +$scope.unmorgageLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.unmorgagePrice) || +$scope.unmorgagePrice <= 0) {
            modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }

        var wal = require("wal");
        wal.unmortgage($scope.unmorgageAmount, $scope.unmorgageLimit, $scope.unmorgagePrice, $scope.privateKey).then(
            function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                } else {
                    modal.showInfo(res.info, $scope.doc, function() {
                        wal.sendSignedTransaction(res.renderStr).then(function(r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                //modal.success({ msg: res.hash })
                                modal.burnSuccess({ doc: $scope.doc, msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })
                                $scope.timeGetBalance()
                                $scope.timeGetVote()
                                $scope.timeGetNodes();
                            }
                        })
                    })
                }
            }
        )
    }
});