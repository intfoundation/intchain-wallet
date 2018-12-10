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
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
        $scope.title = $scope.doc[$scope.action.toLocaleLowerCase()]
    }

    $scope.$watch('action', function(val) {
        document.title = val + '| INT Chain';

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
        modal.nodeList({
            okText: $scope.doc.confirm,
            time: $scope.voteRecord.time,
            nodes: $scope.voteRecord.candidates
        }, $scope.doc)
    }
    $scope.chooseNodes = function(index) {
        let chNum = 0
        if ($scope.chNum >= 20) {
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
                $scope.address = filedata.address;
                $scope.privateKey = data;
                $scope.keyStoreUnlockFail = false;
                $scope.getbalance();
                $scope.getPrice();
                $scope.getVoteRecord();
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
            $scope.getVoteRecord()
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
            $scope.step = 2;
            $scope.getNodes()
            $scope.getVotes();
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
            $scope.nodes = nodes;
            for (let n of $scope.nodes) {
                n.num = modal.numformat(n.num)
            }
            $scope.$apply();
        })
    }
    $scope.timeGetNodes = function() {
        var wal = require("wal");
        wal.getNodes().then(function(nodes) {
            let flag = false;
            for (let n of $scope.nodes) {
                for (let node of nodes) {
                    if (n.node == node.node && n.num != modal.numformat(node.num)) {
                        n.num = modal.numformat(node.num)
                        flag = true
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
        if ($scope.vote <= 0) {
            modal.error({ msg: $scope.doc.mf, title: $scope.doc.notice, okText: $scope.doc.confirm }, function() {
                $scope.action = 'Mortgage'
                $scope.$apply();
            })
            return
        }
        if (isNaN($scope.voteLimit) || $scope.voteLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.votePrice) || $scope.votePrice <= 0) {
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
                    modal.showInfo(res.info, function() {
                        wal.sendSignedTransaction(res.renderStr).then(function(r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                // modal.success({ msg: r.hash })
                                modal.burnSuccess({ msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })

                                $scope.timeGetNodes()
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
        if (isNaN($scope.morgageAmount) || $scope.morgageAmount <= 0) {
            modal.error({ msg: $scope.doc.anv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.morgageLimit) || $scope.morgageLimit <= 0) {
            modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        if (isNaN($scope.morgagePrice) || $scope.morgagePrice <= 0) {
            modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        var wal = require("wal");
        wal.mortgage($scope.morgageAmount, $scope.morgageLimit, $scope.morgagePrice, $scope.privateKey).then(
            function(res) {
                if (res.err) {
                    modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                } else {
                    modal.showInfo(res.info, function() {
                        wal.sendSignedTransaction(res.renderStr).then(function(r) {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                            } else {
                                //modal.success({ msg: r.hash })
                                modal.burnSuccess({ msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })

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
            if (isNaN($scope.unmorgageAmount) || $scope.unmorgageAmount <= 0) {
                modal.error({ msg: $scope.doc.anv, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return
            }
            if (isNaN($scope.unmorgageLimit) || $scope.unmorgageLimit <= 0) {
                modal.error({ msg: $scope.doc.lnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return
            }
            if (isNaN($scope.unmorgagePrice) || $scope.unmorgagePrice <= 0) {
                modal.error({ msg: $scope.doc.pnv, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return
            }

            var wal = require("wal");
            wal.unmortgage($scope.unmorgageAmount, $scope.unmorgageLimit, $scope.unmorgagePrice, $scope.privateKey).then(
                function(res) {
                    if (res.err) {
                        modal.error({ msg: res.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                    } else {
                        modal.showInfo(res.info, function() {
                            wal.sendSignedTransaction(res.renderStr).then(function(r) {
                                if (typeof r === 'string') {
                                    r = JSON.parse(r)
                                }
                                if (r.err) {
                                    modal.error({ msg: r.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                                } else {
                                    //modal.success({ msg: res.hash })
                                    modal.burnSuccess({ msg: 'https://explorer.intchain.io/#/blockchain/txdetail?hash=' + r.hash })
                                    $scope.timeGetBalance()
                                    $scope.timeGetVote()
                                }
                            })
                        })
                    }
                }
            )
        }
        // $scope.url = "/wallet/unlock";
        // $scope.file = null;
        // $scope.wallet = {};
        // $scope.model = {
        //     password: '',
        //     address: '',
        //     balance: '',
        //     votes: 0,
        //     privateKey: '',
        //     toVoteAmount: '',
        //     toVoteFee: '',
        //     toIntAmount: '',
        //     toIntFee: '',
        //     nodes: [{ node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, ],
        //     chooseNodes: [],
        //     voteFee: ''
        // };
        // $scope.alerting = false;
        //$scope.active = 'vote';
        // $scope.unlock = function() {
        //     if ($scope.file) {
        //         if ($.trim($scope.model.password).length == 0) {
        //             util.alert('Please input your password');
        //             return;
        //         }
        //         var file = $scope.file;
        //         var reader = new FileReader(); //new一个FileReader实例
        //         // if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
        //         reader.onload = function() {
        //             var filedata = JSON.parse(this.result);
        //             var wal = require("wal");
        //             wal.decodeFromOption(filedata, $scope.model.password).then(data => {
        //                 if (data) {
        //                     $scope.model.address = filedata.address;
        //                     $scope.model.privateKey = data;
        //                     $scope.getbalance(true);
        //                     $scope.getVotes(true);
        //                     $scope.getNodes();
        //                 } else {
        //                     util.alert('Password error, unlock fail');
        //                 }
        //
        //             }).catch(res => {
        //                 util.alert('Password error, unlock fail');
        //             })
        //         }
        //         reader.readAsText(file);
        //     } else {
        //         util.alert('Please select wallet file');
        //     }
        // };

    // $scope.getbalance = async function(flag) {
    //     var wal = require("wal");
    //     wal.getBalance($scope.model.address).then(data => {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             if (!$scope.alerting) {
    //                 $scope.alerting = true;
    //                 util.alert(data.err, function() { $scope.alerting = false });
    //             }
    //             return;
    //         }
    //         $scope.model.balance = data.balance;
    //         if ($scope.model.balance == null) {
    //             $scope.model.balance = 0.0;
    //         }
    //         $scope.$apply();
    //         if (!$scope.alerting && flag) {
    //             $scope.alerting = true;
    //             util.alert('Unlock Successfully', function() { $scope.alerting = false });
    //         }
    //     });
    // };
    // $scope.getVotes = async function(flag) {
    //     var wal = require("wal");
    //     wal.getVotes($scope.model.address).then(data => {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             if (!$scope.alerting) {
    //                 $scope.alerting = true;
    //                 util.alert(data.err, function() { $scope.alerting = false });
    //             }
    //             return;
    //         }
    //         $scope.model.votes = data.stoke;
    //         $scope.$apply();
    //         if (!$scope.alerting && flag) {
    //             $scope.alerting = true;
    //             util.alert('Unlock Successfully', function() { $scope.alerting = false });
    //         }
    //     });
    // }

    // $scope.mortgage = function() {
    //     var wal = require("wal");
    //     var { toVoteAmount, toVoteFee, privateKey, balance } = $scope.model;
    //     if (!toVoteAmount) {
    //         util.alert('Please enter the votes');
    //         return;
    //     }
    //
    //     if (toVoteAmount && isNaN(toVoteAmount)) {
    //         util.alert('Votes must be a number');
    //         return;
    //     }
    //
    //     if (toVoteAmount <= 0) {
    //         util.alert('Votes must be greater than 0');
    //         return;
    //     }
    //
    //     if (+toVoteAmount >= +balance) {
    //         util.alert('Votes must be less than your votes');
    //         return;
    //     }
    //     if (!toVoteFee) {
    //         util.alert('Please enter the transaction fee');
    //         return;
    //     }
    //     if (toVoteFee && isNaN(toVoteFee)) {
    //         util.alert('Transaction fee must be a number');
    //         return;
    //     }
    //
    //     if (toVoteFee <= 0) {
    //         util.alert('Transaction fee must be greater than 0');
    //         return;
    //     }
    //     if (+toVoteFee >= +balance) {
    //         util.alert('Transaction fee must be less than your balance');
    //         return;
    //     }
    //
    //     wal.mortgage(toVoteAmount, toVoteFee, privateKey).then(data => {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             util.alert(data.err);
    //         } else {
    //
    //             util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
    //         }
    //     })
    // }
    // $scope.unmortgage = function() {
    //     var wal = require("wal");
    //     var { toIntAmount, toIntFee, privateKey, balance, votes } = $scope.model;
    //     if (!toIntAmount) {
    //         util.alert('Please enter the votes');
    //         return;
    //     }
    //
    //     if (toIntAmount && isNaN(toIntAmount)) {
    //         util.alert('Votes must be a number');
    //         return;
    //     }
    //
    //     if (toIntAmount <= 0) {
    //         util.alert('Votes must be greater than 0');
    //         return;
    //     }
    //
    //     if (+toIntAmount >= +votes) {
    //         util.alert('Votes must be less than the balance');
    //         return;
    //     }
    //     if (!toIntFee) {
    //         util.alert('Please enter the transaction fee');
    //         return;
    //     }
    //     if (toIntFee && isNaN(toIntFee)) {
    //         util.alert('Transaction fee must be a number');
    //         return;
    //     }
    //
    //     if (toIntFee <= 0) {
    //         util.alert('Transaction fee must be greater than 0');
    //         return;
    //     }
    //
    //     if (+toIntFee >= +balance) {
    //         util.alert('Transaction fee must be less than your balance');
    //         return;
    //     }
    //
    //     wal.unmortgage(toIntAmount, toIntFee, privateKey).then(data => {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             util.alert(data.err);
    //         } else {
    //
    //             util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
    //         }
    //     })
    // }
    // $scope.tabChange = function(num) {
    //     $scope.alerting = true
    //     $(`.tabbar-box .item:eq(${num-2})`).addClass("active")
    //     $(`.tabbar-box .item:eq(${num-2})`).siblings().removeClass("active")
    //     $scope.getbalance(false);
    //     $scope.getVotes(false);
    //     $scope.alerting = false
    //     $scope.step = num;
    // }
    // $scope.getNodes = function() {
    //     var wal = require("wal");
    //     wal.getNodes().then(nodes => {
    //         $scope.model.nodes = nodes
    //         $scope.tabChange(2)
    //     })
    // }
    // $scope.chooseNode = function(n) {
    //     let index = $scope.model.chooseNodes.indexOf(n)
    //     if (index >= 0) {
    //         $scope.model.chooseNodes.splice(index, 1)
    //     } else {
    //         $scope.model.chooseNodes.push(n)
    //     }
    // }

    // $scope.vote = function() {
    //     let { balance, votes, voteFee, chooseNodes } = $scope.model
    //     if (!chooseNodes.length) {
    //         util.alert('Please select at least one address');
    //         return;
    //     }
    //     if (votes == 0) {
    //         util.alert('Please mortgage first');
    //         return;
    //     }
    //     if (!voteFee) {
    //         util.alert('Please enter the transaction fee');
    //         return;
    //     }
    //     if (voteFee && isNaN(voteFee)) {
    //         util.alert('Transaction fee must be a number');
    //         return;
    //     }
    //
    //     if (voteFee == 0) {
    //         util.alert('Transaction fee must be greater than 0');
    //         return;
    //     }
    //
    //     if (+voteFee >= +balance) {
    //         util.alert('Transaction fee must be less than your balance');
    //         return;
    //     }
    //     var wal = require("wal");
    //     wal.vote(chooseNodes, voteFee, $scope.model.privateKey).then(
    //         data => {
    //             if (typeof data === 'string') {
    //                 data = JSON.parse(data)
    //             }
    //             if (data.err) {
    //                 util.alert(data.err)
    //             } else {
    //                 util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
    //             }
    //         });
    // }
});


// {
//     "err": 0,
//     "block": {
//         "hash": "268ae6784b683a90eb8cdffb4d3afc1be52727f3ecac3b8ac5ad0328c15f6fe9",
//         "number": 137,
//         "timestamp": 1536047852,
//         "preBlock": "b9429479d80872437396a965a001ea227892322cbca413bd304d65bee971df13",
//         "merkleRoot": "ba6a00e86a0fa024fbada741cdb70b1b161d3c0e94859180571923657868d916",
//         "coinbase": "13CS9dBwmaboedj2hPWx6Dgzt4cowWWoNZ",
//         "creator": "13CS9dBwmaboedj2hPWx6Dgzt4cowWWoNZ",
//         "reward": "1",
//         "fee": "01"
//     },
//     "transactions": [{
//         "hash": "ba6a00e86a0fa024fbada741cdb70b1b161d3c0e94859180571923657868d916",
//         "method": "transferTo",
//         "input": { "to": "1CHpy1NayZHXxLe21LuzpTMLSs32Xk9D1K" },
//         "nonce": 4,
//         "caller": "1CHpy1NayZHXxLe21LuzpTMLSs32Xk9D1K",    from
//          "value": "1",
//         "fee": "1"
//     }]

// }
// }