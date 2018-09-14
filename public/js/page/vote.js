app.controller('voteController', function($scope) {
    $scope.url = "/wallet/unlock";
    $scope.file = null;
    $scope.wallet = {};
    $scope.model = {
        password: '',
        address: '',
        balance: '',
        votes: '',
        privateKey: '',
        toVoteAmount: '',
        toVoteFee: '',
        toIntAmount: '',
        toIntFee: '',
        nodes: [{ node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, { node: '2222' }, ],
        chooseNodes: [],
        voteFee: ''
    };
    $scope.alerting = false;
    $scope.step = 1;
    $scope.unlock = function() {
        if ($scope.file) {
            if ($.trim($scope.model.password).length == 0) {
                util.alert('Please input your password');
                return;
            }
            var file = $scope.file;
            var reader = new FileReader(); //new一个FileReader实例
            // if (/text+/.test(file.type)) { //判断文件类型，是不是text类型
            reader.onload = function() {
                var filedata = JSON.parse(this.result);
                var wal = require("wal");
                wal.decodeFromOption(filedata, $scope.model.password).then(data => {
                    if (data) {
                        $scope.model.address = filedata.address;
                        $scope.model.privateKey = data;
                        $scope.getbalance(true);
                        $scope.getVotes(true);
                        $scope.getNodes();
                    } else {
                        util.alert('Password error, unlock fail');
                    }

                }).catch(res => {
                    util.alert('Password error, unlock fail');
                })
            }
            reader.readAsText(file);
        } else {
            util.alert('Please select wallet file');
        }
    };

    $scope.getbalance = async function(flag) {
        var wal = require("wal");
        wal.getBalance($scope.model.address).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                if (!$scope.alerting) {
                    $scope.alerting = true;
                    util.alert(data.err, function() { $scope.alerting = false });
                }
                return;
            }
            $scope.model.balance = data.balance;
            if ($scope.model.balance == null) {
                $scope.model.balance = 0.0;
            }
            $scope.$apply();
            if (!$scope.alerting && flag) {
                $scope.alerting = true;
                util.alert('Unlock Successfully', function() { $scope.alerting = false });
            }
        });
    };
    $scope.getVotes = async function(flag) {
        var wal = require("wal");
        wal.getVotes($scope.model.address).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                if (!$scope.alerting) {
                    $scope.alerting = true;
                    util.alert(data.err, function() { $scope.alerting = false });
                }
                return;
            }
            $scope.model.votes = data.stoke;
            $scope.$apply();
            if (!$scope.alerting && flag) {
                $scope.alerting = true;
                util.alert('Unlock Successfully', function() { $scope.alerting = false });
            }
        });
    }

    $scope.mortgage = function() {
        var wal = require("wal");
        var { toVoteAmount, toVoteFee, privateKey, balance } = $scope.model;
        if (!toVoteAmount) {
            util.alert('Please enter the votes');
            return;
        }

        if (toVoteAmount && isNaN(toVoteAmount)) {
            util.alert('Votes must be a number');
            return;
        }

        if (toVoteAmount <= 0) {
            util.alert('Votes must be greater than 0');
            return;
        }

        if (+toVoteAmount >= +balance) {
            util.alert('Votes must be less than your votes');
            return;
        }
        if (!toVoteFee) {
            util.alert('Please enter the transaction fee');
            return;
        }
        if (toVoteFee && isNaN(toVoteFee)) {
            util.alert('Transaction fee must be a number');
            return;
        }

        if (toVoteFee <= 0) {
            util.alert('Transaction fee must be greater than 0');
            return;
        }
        if (+toVoteFee >= +balance) {
            util.alert('Transaction fee must be less than your balance');
            return;
        }

        wal.mortgage(toVoteAmount, toVoteFee, privateKey).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                util.alert(data.err);
            } else {

                util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
            }
        })
    }
    $scope.unmortgage = function() {
        var wal = require("wal");
        var { toIntAmount, toIntFee, privateKey, balance, votes } = $scope.model;
        if (!toIntAmount) {
            util.alert('Please enter the votes');
            return;
        }

        if (toIntAmount && isNaN(toIntAmount)) {
            util.alert('Votes must be a number');
            return;
        }

        if (toIntAmount <= 0) {
            util.alert('Votes must be greater than 0');
            return;
        }

        if (+toIntAmount >= +votes) {
            util.alert('Votes must be less than the balance');
            return;
        }
        if (!toIntFee) {
            util.alert('Please enter the transaction fee');
            return;
        }
        if (toIntFee && isNaN(toIntFee)) {
            util.alert('Transaction fee must be a number');
            return;
        }

        if (toIntFee <= 0) {
            util.alert('Transaction fee must be greater than 0');
            return;
        }

        if (+toIntFee >= +balance) {
            util.alert('Transaction fee must be less than your balance');
            return;
        }

        wal.unmortgage(toIntAmount, toIntFee, privateKey).then(data => {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                util.alert(data.err);
            } else {

                util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
            }
        })
    }
    $scope.tabChange = function(num) {
        $scope.alerting = true
        $(`.tab-box .item:eq(${num-2})`).addClass("active")
        $(`.tab-box .item:eq(${num-2})`).siblings().removeClass("active")
        $scope.getbalance(false);
        $scope.getVotes(false);
        $scope.alerting = false
        $scope.step = num;
    }
    $scope.getNodes = function() {
        var wal = require("wal");
        wal.getNodes().then(nodes => {
            $scope.model.nodes = nodes
            $scope.tabChange(2)
        })
    }
    $scope.chooseNode = function(n) {
        let index = $scope.model.chooseNodes.indexOf(n)
        if (index >= 0) {
            $scope.model.chooseNodes.splice(index, 1)
        } else {
            $scope.model.chooseNodes.push(n)
        }
    }

    $scope.vote = function() {
        let { balance, votes, voteFee, chooseNodes } = $scope.model
        if (!chooseNodes.length) {
            util.alert('Please select at least one address');
            return;
        }
        if (votes == 0) {
            util.alert('Please mortgage first');
            return;
        }
        if (!voteFee) {
            util.alert('Please enter the transaction fee');
            return;
        }
        if (voteFee && isNaN(voteFee)) {
            util.alert('Transaction fee must be a number');
            return;
        }

        if (voteFee == 0) {
            util.alert('Transaction fee must be greater than 0');
            return;
        }

        if (+voteFee >= +balance) {
            util.alert('Transaction fee must be less than your balance');
            return;
        }
        var wal = require("wal");
        wal.vote(chooseNodes, voteFee, $scope.model.privateKey).then(
            data => {
                if (typeof data === 'string') {
                    data = JSON.parse(data)
                }
                if (data.err) {
                    util.alert(data.err)
                } else {
                    util.alertwithtile("Transaction Hash", "Transaction Hash:" + data.hash + "<br\> You can use the transaction hash to query the transaction in the explorer.");
                }
            });
    }
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