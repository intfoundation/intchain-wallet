app.directive('personFile', function($http) {
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
            password: '=password'
        },
        template: '<div class="is"><div class="lt1"><span>{{name}}</span></div>' +
            '<div class="lt2"><a href="javascript:void(0)"><input type="file">浏览</a></div>' +
            '</div><div ng-show="show"><div class="mi middle">Please type your password</div>' +
            '<div class="is" style="width: 381px;margin: 0 auto"><input type="password" ng-model="password" class="ip"  placeholder="Please type your password"></div></div>',
        link: function(scope, element, attributes) {
            scope.show = false;

            $(element).find(".lt1").on('click', function() {
                $(element).find("input[type=file]").trigger('click');
            })
            $(element).find("input[type=file]").on('change', function() {
                changeFile();
            });
            var changeFile = function() {
                //if( $(element).find("input[type=file]")[0].files==)
                scope.name = $(element).find("input[type=file]")[0].files[0].name;
                scope.file = $(element).find("input[type=file]")[0].files[0];
                scope.show = true;
                scope.$apply();
            }
            scope.name = 'Choose wallet file';
        }
    };
})