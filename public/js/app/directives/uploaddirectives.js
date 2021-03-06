﻿app.directive('personFile', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '= value',
            show: '=show',
            url: '=url'
        },
        template: '<div id="uploader" single="0"><input type="hidden" id="mainimg">' +
            '<div class="queueList"><div id="dndArea" class="placeholder"><div id="filePicker"></div></div>' +
            '</div><div class="statusBar" style="display: none;">' +
            '<div class="progress"><span class="text">0%</span> <span class="percentage"></span></div><div class="info"></div><div class="btns">' +
            '<div id="filePicker2"></div><div class="uploadBtn">开始上传</div></div></div></div>',
        link: function(scope, element, attributes) {
            scope.$watch('show', function(n, o) {
                if (n != o) {
                    $("#uploader").render(scope.url, scope.value);
                }
            });
        }
    };
});

app.directive('webUpload', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '= value',
            show: '=show'
        },
        template: '<div id="uploader" single="0" ng-if="!show"><input type="hidden" id="mainimg" ng-model="value">' +
            '<div class="queueList"><div id="dndArea" class="placeholder"><div id="filePicker"></div></div>' +
            '</div><div class="statusBar" style="display: none;">' +
            '<div class="progress"><span class="text">0%</span> <span class="percentage"></span></div><div class="info"></div><div class="btns">' +
            '<div id="filePicker2"></div><div class="uploadBtn">开始上传</div></div></div></div>',
        // template: `<div class="is">
        //              <div class="lt1">
        //                    <span>SELECT WALLET FILE{{ch}}</span>
        //              </div>
        //     <div class="lt2"><a href="javascript:void(0)"><input type="file">浏览</a></div>
        //     </div><div ng-show="show" style="display:block;width: 800px;height: 79px"><div class="mi middle">Your wallet is
        //     encrypted.Good! Please
        //     enter the
        //     password</div>
        //     <div class="in-box">
        //         <input ng-show="!pwdView" type="password"
        //                ng-model="password" ng-change="pwdChange()" ng-click="pwdChange()"
        //                placeholder="Enter your wallet password">
        //         <input ng-show="pwdView" type="text"  ng-change="pwdChange()" ng-model="password"
        //                placeholder="Enter your wallet password">
        //         <img ng-click="pwdView=!pwdView" ng-show="pwdView" src="./images/eyeopen.png">
        //         <img ng-click="pwdView=!pwdView" ng-show="!pwdView" src="./images/eyeclose.png">
        //     </div></div>`,
        link: function(scope, element, attributes) {
            scope.$watch('show', function(n, o) {
                if (n != o) {
                    $("#uploader").render(uploadpath, scope.value);
                }
            });
        }
    };
});


app.directive('fileUploader', function($http) {
    return {
        restrict: 'AE',
        scope: {
            url: '=url',
            file: '=file',
            password: '=password',
            doc: '=doc',
            keystorestr: '=keystorestr',
            //balance: '='
            //enterUnlock: '=enterUnlock'
        },
        // template: '<div class="is"><div class="lt1"><span>{{name}}</span></div>' +
        //     '<div class="lt2"><a href="javascript:void(0)"><input type="file">浏览</a></div>' +
        //     '</div><div ng-show="show"><div class="mi middle">Please enter your password</div>' +
        //     '<div class="is" style="width: 381px;margin: 0 auto"><input type="password"  ng-model="password"' +
        // ' class="ip"  placeholder="Please enter your password"></div></div>',


        template: '<div class="is">' +
            '<div class="lt1" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">' +
            ' <span>{{fileName||doc.seStore}} </span>' +
            ' </div>' +
            ' <div class="lt2" style="display:none"><a href="javascript:void(0)"><input type="file">浏览</a></div>' +
            '</div>' +
            '<textarea placeholder="{{doc.eKeyStore}}" ng-model="keystorestr" style="margin-top:40px;border: 1px solid rgba(204, 204, 204, 1);border-radius:4px" rows="10" cols="58"></textarea>' +
            '<div  style="display:block;width: 800px;height: 79px"><div class="mi middle">' +
            '   {{doc.isSelected}}</div>' +
            '   <div class="in-box">' +
            '       <input ng-show="!pwdView" type="password" ng-keyup="enterUnlock($event)" ' +
            '              ng-model="password" ' +
            '              placeholder="{{doc.ep}}">' +
            '        <input ng-show="pwdView" type="text"  ng-keyup="enterUnlock($event)"  ng-model="password"' +
            '              placeholder="{{doc.ep}}">' +
            '       <img ng-click="pwdView=!pwdView" ng-show="pwdView" src="./images/eyeopen.png">' +
            '       <img ng-click="pwdView=!pwdView" ng-show="!pwdView" src="./images/eyeclose.png">' +
            '   </div></div>',
        link: function(scope, element, attributes) {
            scope.show = false;
            scope.fileName = ''
            scope.doc = scope.$parent.doc;
            scope.enterUnlock = function(e) {
                scope.$parent.enterUnlock(e)
            }

            $(element).find(".lt1").on('click', function() {
                $(element).find("input[type=file]").trigger('click');
            })
            $(element).find("input[type=file]").on('change', function() {
                changeFile();
                var reader = new FileReader();
                reader.onload = function() {
                    scope.keystorestr = this.result;
                    scope.$apply();
                }
                reader.readAsText(scope.file);
            });
            var changeFile = function() {
                //if( $(element).find("input[type=file]")[0].files==)
                scope.fileName = $(element).find("input[type=file]")[0].files[0].name;
                scope.file = $(element).find("input[type=file]")[0].files[0];

                scope.show = true;
                scope.$apply();
            }
            scope.name = 'Select wallet file';
        }
    };
})