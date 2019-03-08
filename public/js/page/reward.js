var app = angular.module("app", ['ui.bootstrap']);
app.controller('voteController', function($scope) {
    $scope.voteRecord = {}
    $scope.vote = 0
    $scope.reward = {}
    $scope.rewardData = [];
    $scope.page = {
        "limit": 10,
        "pageSize": 10,
        "pageNo": 1,
        "totalCount": 0
    };
    $scope.toPage = 1
    $scope.lan = new modal.UrlSearch().lan || 'en'
    $scope.address = new modal.UrlSearch().address
    $scope.doc = lan[$scope.lan]
    $scope.changelan = function(a) {
        $scope.doc = lan[a]
        $scope.lan = a
    }
    $scope.getVoteRecord = function() {
        var wal = require("wal");
        if (!$scope.address || !wal.isValidAddress($scope.address)) {
            return
        }
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
    $scope.getVotes = function() {
        var wal = require("wal");
        if (!$scope.address || !wal.isValidAddress($scope.address)) {
            return
        }
        wal.getVotes($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            if (data.err) {
                modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
                return;
            }
            $scope.getVoteRecord()
            $scope.vote = modal.numformat(data.stake)
            $scope.$apply()
        });
    }
    $scope.getVotes()
    $scope.rewardHistory = function() {
        var wal = require("wal");
        if (!$scope.address || !wal.isValidAddress($scope.address)) {
            modal.error({ msg: $scope.doc.notValidAddress, title: $scope.doc.notice, okText: $scope.doc.confirm })
            return
        }
        wal.rewardHistory($scope.address).then(function(data) {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }
            // for (let d of data.data) {
            //     d.input = JSON.parse(d.input)
            //     console.log(d.input)
            // }
            $scope.reward = data;
            $scope.rewardData = $scope.reward.data.slice($scope.page.pageSize * ($scope.page.pageNo - 1), $scope.page.pageSize * $scope.page.pageNo);
            $scope.page.totalCount = data.data.length
            $scope.$apply();
        })
    }
    $scope.rewardHistory()
    $scope.pageChanged = function() {
        $scope.rewardData = $scope.reward.data.slice($scope.page.pageSize * ($scope.page.pageNo - 1), $scope.page.pageSize * $scope.page.pageNo);
        $scope.toPage = $scope.page.pageNo
    }

    $scope.enterEvent = function(e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                if (!isNaN($scope.toPage)) {
                    var totalPage = Math.ceil($scope.reward.data.length / $scope.page.pageSize);
                    if ($scope.toPage > totalPage) {
                        $scope.toPage = totalPage
                    }
                    if ($scope.toPage <= 0) {
                        $scope.toPage = 1
                    }
                    $scope.page.pageNo = $scope.toPage
                    $scope.rewardData = $scope.reward.data.slice($scope.page.pageSize * ($scope.page.pageNo - 1), $scope.page.pageSize * $scope.page.pageNo);
                }
            }
        }
        // $scope.showRecord = function() {
        //     if ($scope.vote == 0) {
        //         $scope.voteRecord.candidates = [];
        //     }
        //     modal.nodeList({
        //         okText: $scope.doc.confirm,
        //         time: $scope.voteRecord.time,
        //         nodes: $scope.voteRecord.candidates
        //     }, $scope.doc)
        // }






    // $scope.getVoteRecord = function() {
    //     var wal = require("wal");
    //     wal.voteRecord($scope.address).then(function(data) {
    //         if (typeof data === 'string') {
    //             data = JSON.parse(data)
    //         }
    //         if (data.err) {
    //             modal.error({ msg: data.err, title: $scope.doc.notice, okText: $scope.doc.confirm })
    //             return;
    //         }
    //         $scope.voteRecord = data
    //         $scope.$apply();
    //     });
    // }

});