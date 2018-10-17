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
    console.log(3333, $scope.action)
        //钱包信息相关
    $scope.privateKey = ""
    $scope.address = ""
    $scope.balance = 0;
    $scope.vote = 0;
    $scope.toAddress;
    $scope.amount;
    $scope.voteFee;
    $scope.chNum = 0
    $scope.morgageAmount;
    $scope.morgageFee;
    $scope.morgagePass = false;
    $scope.unmorgageAmount;
    $scope.unmorgageFee;
    $scope.unmorgagePass = false;

    $scope.nodes = [
        { node: "sokmnjchuygtfzvdetqlpojdnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpojdnmc2dhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlp2jdnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpojdnmcudhs2zj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetql2ojdnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjc2uygtfzvdetqlpojd2mcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuyg3fzvdetqlpojdnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvd3tqlpojdnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpo3dnmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj3nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpo33nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlp333nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetql3333nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetq33333nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdet333333nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj4nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj5nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj6nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj7nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj8nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpoj9nmcudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpojdn0cudhsbzj", num: 212.31245, ch: false },
        { node: "sokmnjchuygtfzvdetqlpojdnmcudh0bzj", num: 212.31245, ch: false },
    ]
    $scope.$watch('password', function(newValue, oldValue) {
        if ($scope.password.length >= 9) {
            $scope.unlockDisabled = false
        } else {
            $scope.unlockDisabled = true
        }
    });
    $scope.$watch('{chNum:chNum,voteFee:voteFee}', function(v) {
        if (v.chNum && v.voteFee) {
            $scope.votePass = true
        } else {
            $scope.votePass = false
        }
    })
    $scope.$watch('{morgageAmount:morgageAmount,morgageFee:morgageFee}', function(v) {
        if (v.morgageAmount && v.morgageFee) {
            $scope.morgagePass = true
        } else {
            $scope.morgagePass = false
        }
    })
    $scope.$watch('{unmorgageAmount:unmorgageAmount,unmorgageFee:unmorgageFee}', function(v) {
        if (v.unmorgageAmount && v.unmorgageFee) {
            $scope.unmorgagePass = true
        } else {
            $scope.unmorgagePass = false
        }
    })
    $scope.chooseNodes = function(index) {
        let chNum = 0
        $scope.nodes[index].ch = !$scope.nodes[index].ch;
        for (let n of $scope.nodes) {
            if (n.ch) chNum++
        }
        $scope.chNum = chNum;
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
            wal.decodeFromOption(filedata, $scope.password).then(data => {
                $scope.address = filedata.address;
                $scope.privateKey = data;
                $scope.keyStoreUnlockFail = false
                $scope.getbalance()
                $scope.$apply();
            }).catch(e => {
                $scope.keyStoreUnlockFail = true
                $scope.$apply();
            })
        }
        reader.readAsText(file);

    };
    $scope.privateKeyUnlock = function() {
        if ($scope.length != 64) {
            $scope.privateKeyUnlockFail = true
            return
        }
        var wal = require("wal");
        $scope.address = wal.addressFromPrivateKey($scope.privateKey)
        if (!$scope.address) {
            $scope.privateKeyUnlockFail = true
        } else {
            $scope.getbalance()
            $scope.step = 2;
        }
        $scope.$apply();
    }
    $scope.getbalance = function() {
        var wal = require("wal");
        wal.getBalance($scope.address).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
                return;
            }
            $scope.balance = data.balance;
            if ($scope.balance == null) {
                $scope.balance = 0;
            }
            $scope.step = 2;
            $scope.getNodes()
            $scope.getVotes();
            $scope.$apply();
        });
    };
    $scope.refresh = function() {
        let balance = $scope.balance
        let bTimer = setInterval(() => {
            $scope.getbalance()
            let rBanlance = $scope.balance
            if (balance != rBanlance) {
                clearInterval(bTimer)
            }
        })
        let vote = $scope.vote
        let vTimer = setInterval(() => {
            $scope.getbalance()
            let rVote = $scope.balance
            if (balance != rBanlance) {
                clearInterval(vTimer)
            }
        })
    }
    $scope.getNodes = function() {
        var wal = require("wal");
        wal.getNodes().then(nodes => {
            $scope.nodes = nodes;
            $scope.$apply();
        })
    }
    $scope.getVotes = function() {
        var wal = require("wal");
        wal.getVotes($scope.address).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err })
                return;
            }
            $scope.vote = data.stake;
            $scope.$apply();
        });
    }
    $scope.Vote = function() {
        if ($scope.vote <= 0) {
            modal.error({ msg: 'please mortgage first' }, function() {
                $scope.action = 'Mortgage'
                $scope.$apply();
            })
            return
        }
        if (isNaN($scope.voteFee) || $scope.voteFee <= 0) {
            modal.error({ msg: 'Fee is not valid' })
            return
        }
        let candies = [];
        for (let n of $scope.nodes) {
            if (n.ch) {
                candies.push(n.node)
            }
        }
        var wal = require("wal");
        wal.vote(candies, $scope.voteFee, $scope.privateKey).then(
            res => {
                if (res.err) {
                    modal.error({ msg: res.err })
                } else {
                    modal.showInfo(res.info, function() {
                        wal.sendSignedTransaction(res.renderStr).then(r => {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err })
                            } else {
                                modal.success({ msg: r.hash })
                            }
                        })
                    })
                }
            }
        )
    }
    $scope.Morgage = function() {
        if (isNaN($scope.morgageAmount) || $scope.morgageAmount <= 0) {
            modal.error({ msg: 'Amount is not valid' })
            return
        }
        if (isNaN($scope.morgageFee) || $scope.morgageFee <= 0) {
            modal.error({ msg: 'Fee is not valid' })
            return
        }
        var wal = require("wal");
        wal.mortgage($scope.morgageAmount, $scope.morgageFee, $scope.privateKey).then(
            res => {
                if (res.err) {
                    modal.error({ msg: res.err })
                } else {
                    modal.showInfo(res.info, function() {
                        wal.sendSignedTransaction(res.renderStr).then(r => {
                            if (typeof r === 'string') {
                                r = JSON.parse(r)
                            }
                            if (r.err) {
                                modal.error({ msg: r.err })
                            } else {
                                modal.success({ msg: r.hash })
                            }
                        })
                    })
                }
            }
        )
    }
    $scope.Unmorgage = function() {
            if (isNaN($scope.unmorgageAmount) || $scope.unmorgageAmount <= 0) {
                modal.error({ msg: 'Amount is not valid' })
                return
            }
            if (isNaN($scope.unmorgageFee) || $scope.unmorgageFee <= 0) {
                modal.error({ msg: 'Fee is not valid' })
                return
            }
            var wal = require("wal");
            wal.unmortgage($scope.unmorgageAmount, $scope.unmorgageFee, $scope.privateKey).then(
                res => {
                    if (res.err) {
                        modal.error({ msg: res.err })
                    } else {
                        modal.showInfo(res.info, function() {
                            wal.sendSignedTransaction(res.renderStr).then(r => {
                                if (typeof r === 'string') {
                                    r = JSON.parse(r)
                                }
                                if (r.err) {
                                    modal.error({ msg: r.err })
                                } else {
                                    modal.success({ msg: res.hash })
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