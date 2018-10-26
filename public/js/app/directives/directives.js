app.filter("trustHtml", function($sce) {
    return function(input) {
        return $sce.trustAsHtml(input);
    };
});

app.directive('sliderImg', function($http, FileUploader) {
    return {
        restrict: 'AE',
        scope: {
            imgs: '= imgs'
        },
        template: '<div class="slimg">' +
            '<div class="im" ng-click="pre()"><</div>' +
            '<div class="im r" ng-click="next()">></div>' +
            '<div ng-repeat="item in imgs" >' +
            '<img ng-show="item.show" style="height: 100%; width: 100%;" ng-src="{{item.path}}"/>' +
            '</div>' +
            '</div>',
        link: function(scope, element, attributes) {
            scope.pre = function() {
                var index = 0;
                for (var i = 0; i < scope.imgs.length; i++) {
                    if (scope.imgs[i].show) {
                        index = i - 1;
                    }
                    scope.imgs[i].show = false;
                }
                if (index < 0) {
                    index = scope.imgs.length - 1;
                }
                scope.imgs[index].show = true;
            }
            scope.next = function() {
                var index = 0;
                for (var i = 0; i < scope.imgs.length; i++) {
                    if (scope.imgs[i].show) {
                        index = i + 1;
                    }
                    scope.imgs[i].show = false;
                }
                if (index == scope.imgs.length) {
                    index = 0;
                }
                scope.imgs[index].show = true;
            }
        }
    };
});

app.directive('xrxaddress', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value'
        },
        template: '<div style="border:solid 1px #ddd;width:100%;height:20px;padding-top:5px ;"   ng-click="showaddress()"><span>{{value}}</span></div>' +
            '<div class="la" ng-show="hasshow">' +
            '<div ng-repeat="item in addressnodes" class="ee" style="min-height:30px;cursor:pointer;line-height:30px;" ng-click="showchildren(item)" >' +
            '<span>{{item.name}}</span>' +
            '</div>' +
            '<div class="lct"><span class="t">已选地址：{{seladdress}}</span><div style="float:right;margin-right:10px;margin-top:2px;">' +
            '<input ng-show="!isparenaddressnode" type="button" value="重新选择"  class="btn btn-primary" style="margin-right:10px;" ng-click="sre()">' +
            '<input type="button" value="取消"  class="btn btn-primary" style="margin-right:10px;" ng-click="scancel()">' +
            '<input  type="button" value="确定" ng-click="sok()" class="btn btn-primary"></div></div>' +
            '</div>',
        link: function(scope, element, attributes) {
            scope.isparenaddressnode = true;
            scope.hasshow = false;
            scope.addressmap = [];
            element.toggleClass('achooser');
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
            };
            scope.showaddress = function() {
                if (!scope.hasshow) {
                    if (scope.addressmap.length == 0) {
                        scope.getaddress();
                    } else {
                        scope.hasshow = true;
                        scope.addressnodes = scope.addressmap;
                        scope.isparenaddressnode = true;
                        scope.decrement();
                    }
                } else {
                    scope.isparenaddressnode = true;
                    scope.decrement();
                }
            };
            scope.sre = function() {
                scope.hasshow = true;
                scope.isparenaddressnode = true;
                scope.addressnodes = scope.addressmap;
                scope.decrement();
                scope.seladdress = '';
            };
            scope.scancel = function() {
                scope.seladdress = '';
                scope.hasshow = false;
            };
            scope.sok = function() {
                scope.value = scope.seladdress;
                scope.hasshow = false;
            };
            scope.showchildren = function(item) {
                if (scope.isparenaddressnode == true) {
                    scope.seladdress = item.name;
                    scope.isparenaddressnode = false;
                } else {
                    scope.seladdress += item.name;
                    scope.isparenaddressnode = false;
                }
                scope.addressnodes = item.children;
            }
            scope.getaddress = function() {
                var url = rootpath + '/com/control/address';
                $http.post(url).success(function(data) {
                    if (data.bresult) {
                        scope.addressmap = data.object;
                        scope.hasshow = true;
                        scope.isparenaddressnode = true;
                        scope.addressnodes = scope.addressmap;
                        scope.decrement();
                    }
                }).error(function() {});
            };
        }
    };
});

app.directive('xrxuserinfo', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()"><div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item.username}}</div></div>',
        link: function(scope, element, attributes) {
            element.toggleClass('Chooser');
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/user/dimQueryByName', {
                    tag: scope.value
                }).success(function(data) {
                    if (data.bresult) {
                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(i, item) {
                                item.username = item.username + "(" + item.phone + ")";
                            });
                            scope.hasShow = true;
                        }
                    }
                });
            };
            scope.selUser = function(item) {
                scope.hasShow = false;
                scope.value = item.username;
                scope.key = item.id;
            };
        }
    };
});

app.directive('xrxauserinfo', function($http) {
    return {
        restrict: 'AE',
        scope: {
            user: '=user',
            arctile: '=arctile'
        },
        template: '<input type="text" class="cin" ng-model="user.username" ng-click="decrement()" ng-keyup="decrement()"><div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item.username}}</div></div>',
        link: function(scope, element, attributes) {
            element.toggleClass('Chooser');
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                if (scope.user.username == null) {
                    scope.user.username = '';
                }
                $http.post(rootpath + '/user/dimQueryByName', {
                    tag: scope.user.username
                }).success(function(data) {
                    if (data.bresult) {
                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(i, item) {
                                item.username = item.username;
                            });
                            scope.hasShow = true;
                        }
                    }
                });
            };
            scope.selUser = function(item) {
                scope.hasShow = false;
                //scope.value = item.username;
                //scope.key = item.id;
                scope.user = item;
                scope.arctile.phone = item.phone;
                scope.checkRegistry = "手机已注册";
                scope.arctile.fixedTelephone = item.fixedTelephone;
                scope.arctile.weiXin = item.weiXin;
                scope.arctile.qq = item.qq;
                scope.arctile.usenickName = item.nickName;
                scope.arctile.email = item.email;
                scope.arctile.companyName = item.cname;
                scope.arctile.departmentName = item.department;
                scope.arctile.positionName = item.position;
            };
        }
    };
});

app.directive('sigleauser', function($http) {
    return {
        restrict: 'AE',
        scope: {
            user: '=user',
            arctile: '=arctile'
        },
        template: '<input type="text" ng-show="!showitem" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()">' +
            '<div class="si" ng-show="key"><div class="sn"><div class="ti"><span  class="t">{{value}}</span></div>' +
            '<div class="c" ng-click="deleteuser()"><img class="tc"  src="/xrx_portal/static/images/close.png"></div></div></div>' +
            '<div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item.username}}</div></div>',
        link: function(scope, element, attributes) {
            element.toggleClass('Chooser');
            scope.showitem = false;
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                scope.arctile.user.username = scope.value;
                scope.arctile.userName = scope.value;
                $http.post(rootpath + '/user/dimQueryByName', {
                    tag: scope.value
                }).success(function(data) {
                    if (data.bresult) {

                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(i, item) {
                                item.username = item.username + "(" + item.phone + ")";
                            });
                            scope.hasShow = true;
                        }
                    }
                });
            };
            scope.deleteuser = function() {
                scope.value = '';
                scope.key = '';
                scope.arctile.user = {};
                scope.arctile.usenickName = '';
                scope.arctile.phone = '';
                scope.checkRegistry = "手机已注册";
                scope.checkRegistry = '';
                scope.arctile.fixedTelephone = '';
                scope.arctile.weiXin = '';
                scope.arctile.email = '';
                scope.arctile.qq = '';
                scope.arctile.username = '';
                scope.arctile.companyName = '';
                scope.arctile.departmentName = '';
                scope.arctile.positionName = '';
                scope.showitem = false;
            };
            scope.selUser = function(item) {
                scope.hasShow = false;
                scope.user = item;
                scope.arctile.phone = item.phone;
                scope.arctile.fixedTelephone = item.fixedTelephone;
                scope.arctile.weiXin = item.weiXin;
                scope.arctile.qq = item.qq;
                scope.arctile.usenickName = item.nickName;
                scope.arctile.email = item.email;
                scope.arctile.companyName = item.cname;
                scope.arctile.departmentName = item.department;
                scope.arctile.positionName = item.position;
                scope.value = item.username;
                scope.key = item.id;
                scope.showitem = true;
            };

            scope.$watch('user', function(n, o) {
                if (n != null) {
                    if (n.id != null) {
                        scope.hasShow = false;
                        scope.user = n;
                        console.log(scope.arctile);
                        if (scope.arctile.username != null && scope.arctile.username.length > 0) {
                            scope.value = scope.arctile.username;
                        } else {
                            scope.value = n.username;
                        }
                        scope.key = n.id;
                        scope.showitem = true;
                    }
                }
            });
        }
    };
});

app.directive('xrxuserinfosingle', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" ng-show="!showitem" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()">' +
            '<div class="si" ng-show="key"><div class="sn"><div class="ti"><span  class="t">{{value}}</span></div>' +
            '<div class="c" ng-click="deleteuser()"><img class="tc"  src="/xrx_portal/static/images/close.png"></div></div></div>' +
            '<div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item.username}}</div></div>',
        link: function(scope, element, attributes) {
            element.toggleClass('Chooser');
            scope.showitem = false;
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/user/dimQueryByName', {
                    tag: scope.value
                }).success(function(data) {
                    if (data.bresult) {

                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(i, item) {
                                item.username = item.username + "(" + item.phone + ")";
                            });
                            scope.hasShow = true;
                        }
                    }
                });
            };
            scope.deleteuser = function() {
                scope.value = '';
                scope.key = '';
                scope.showitem = false;
            };
            scope.selUser = function(item) {
                scope.hasShow = false;
                scope.value = item.username;
                scope.key = item.id;
                scope.showitem = true;
            };

            scope.$watch('key', function(n, o) {
                if (n != null) {
                    if (n.length == 0) {
                        scope.deleteuser();
                    }
                }
            });
        }
    };
});

app.directive('xrxuserinfocheckbox', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()" readonly="true"><div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)"> <input type="checkbox" id="{{item.id}}" ng-checked="{{item.checked}}" name="{{item.username}}">{{item.username}}</input></div><input type="button" class="btn-primary" value="确定" style="width: 50px;float: right; margin-right:400px; margin-bottom: 10px;" ng-click="checkOK()"></div>',
        link: function(scope, element, attributes) {
            //element.toggleClass('Chooser');
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                $http.post(rootpath + '/user/dimQueryByName', {
                    tag: ''
                }).success(function(data) {
                    if (data.bresult) {
                        scope.hasShow = true;

                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(j, item) {
                                item.checked = false;
                                for (var i = 0; i < scope.key.length; i++) {
                                    if (scope.key[i] == item.id) {
                                        item.checked = true; // .extend({"checked": true});
                                    }
                                }
                            });
                        }
                    }
                });
            };

            scope.selUser = function(item) {
                scope.key = [];
                scope.value = "";
                var input = document.getElementById(item.id);
                input.checked = !input.checked;
                var list = document.getElementsByTagName("input");
                $.each(list, function(i, put) {
                    if (put.checked) {
                        scope.value += put.name + ",";
                        scope.key.push(put.id);
                    }
                });

            };
            scope.checkOK = function() {
                scope.hasShow = false;
            };
        }
    };
});

app.directive('xrxauthorityinfo', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" ><div class="la" ng-show="hasShow"><ul id="treeAuthority" class="ztree"></ul></div>',
        link: function(scope, element, attributes) {
            var setting = {
                view: {
                    showLine: true,
                    selectedMulti: false,
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "authorityid",
                        pIdKey: "parentid",
                        rootPId: ""
                    },
                    key: {
                        name: 'authorityname'
                    },
                },
                callback: {
                    onClick: onClick
                }
            };

            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getAuthority();
            };
            scope.getAuthority = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/authority/queryenablelist').success(function(data) {
                    if (data.bresult) {

                        scope.Authoritys = data.object;
                        if (scope.Authoritys.length > 0) {
                            scope.hasShow = true;
                            $.fn.zTree.init($("#treeAuthority"), setting, scope.Authoritys);
                        }
                    }
                });
            };

            function onClick(event, treeId, treeNode, clickFlag) {
                scope.hasShow = false;
                scope.value = treeNode.authorityname;
                scope.key = treeNode.authorityid;
                scope.$apply();
            };
        }
    };
});

app.directive('xrxauthorityinfolist', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" readonly="true"><div class="la" ng-show="hasShow"><ul id="treeAuthorityCheck" class="ztree"></ul><input type="button" class="btn-primary" value="确定" style="width: 50px;float: right; margin-right:400px; margin-bottom: 10px;" ng-click="checkOK()"></div>',
        link: function(scope, element, attributes) {
            var setting = {
                view: {
                    showLine: true,
                    selectedMulti: true,
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "authorityid",
                        pIdKey: "parentid",
                        rootPId: ""
                    },
                    key: {
                        name: 'authorityname'
                    },
                },
                callback: {
                    onCheck: onClick
                },
                check: {
                    enable: true,
                    chkStyle: "checkbox",
                    chkboxType: {
                        "Y": "p",
                        "N": "p"
                    },
                    nocheckInherit: false,

                }
            };

            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getAuthority();
            };
            scope.getAuthority = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/authority/queryenablelist').success(function(data) {
                    if (data.bresult) {

                        scope.Authoritys = data.object;
                        if (scope.Authoritys.length > 0) {
                            scope.hasShow = true;
                            for (var i = 0, l = scope.key.length; i < l; i++) {
                                $.each(scope.Authoritys, function(j, item) {
                                    if (item.authorityid == scope.key[i]) {
                                        item.extend({
                                            "checked": true
                                        });
                                    }
                                });
                            }
                            $.fn.zTree.init($("#treeAuthorityCheck"), setting, scope.Authoritys);
                            //$.fn.zTree.getZTreeObj("treeAuthorityCheck").expandAll(true); //展开全部
                        }
                    }
                });
            };

            function onClick(event, treeId, treeNode, clickFlag) {
                scope.key = [];
                scope.value = "";
                var zTree = $.fn.zTree.getZTreeObj("treeAuthorityCheck");
                var checkTree = zTree.getCheckedNodes(true);
                if (checkTree.length > 0) {
                    $.each(checkTree, function(i, item) {
                        scope.value += item.authorityname + ",";
                        scope.key.push(item.authorityid);
                    });
                }
                scope.$apply();
            };
            scope.checkOK = function() {
                scope.hasShow = false;
            };
        }
    };
});

app.directive('xrxgroupinfo', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" ><div class="la" ng-show="hasShow"><ul id="treeGroup" class="ztree"></ul></div>',
        link: function(scope, element, attributes) {

            var setting = {
                view: {
                    showLine: true,
                    selectedMulti: false,
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "rolegroupid",
                        pIdKey: "parentid",
                        rootPId: ""
                    },
                    key: {
                        name: 'rolegroupname'
                    },
                },
                callback: {
                    onClick: onClick
                }
            };

            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getGroup();
            };
            scope.getGroup = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/orgrolegroup/queryenablelist').success(function(data) {
                    if (data.bresult) {

                        scope.Groups = data.object;
                        if (scope.Groups.length > 0) {
                            scope.hasShow = true;
                            $.fn.zTree.init($("#treeGroup"), setting, scope.Groups);
                        }
                    }
                });
            };

            function onClick(event, treeId, treeNode, clickFlag) {
                scope.hasShow = false;
                scope.value = treeNode.rolegroupname;
                scope.key = treeNode.rolegroupid;
                scope.$apply();
            };
        }
    };
});



app.directive('xrxforuminfosingle', function($http) {
    return {
        restrict: 'AE',
        scope: {
            value: '=value',
            key: '=key'
        },
        template: '<input type="text" ng-show="!showitem" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()">' +
            '<div class="si" ng-show="key"><div class="sn"><div class="ti"><span  class="t">{{value}}</span></div>' +
            '<div class="c" ng-click="deleteuser()"><img class="tc"  src="/xrx_portal/static/images/close.png"></div></div></div>' +
            '<div class="la" ng-show="hasShow"><div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item.username}}</div></div>',
        link: function(scope, element, attributes) {
            element.toggleClass('Chooser');
            scope.showitem = false;
            scope.decrement = function() {
                var top = $(element).position().top;
                var left = $(element).position().left;
                var height = $(element).outerHeight(true);
                var width = $(element).outerWidth(true);
                if ($(element).find(".la").length > 0) {
                    $(element).find('.la').css({
                        'width': width,
                        top: top + height + 2,
                        left: left
                    });
                }
                scope.getUser();
            };
            scope.getUser = function() {
                if (scope.value == null) {
                    scope.value = '';
                }
                $http.post(rootpath + '/forum/all', {
                    tag: scope.value
                }).success(function(data) {
                    if (data.bresult) {
                        scope.Users = data.object;
                        if (scope.Users.length > 0) {
                            $.each(scope.Users, function(i, item) {
                                item.username = item.username + "(" + item.phone + ")";
                            });
                            scope.hasShow = true;
                        }
                    }
                });
            };
            scope.deleteuser = function() {
                scope.value = '';
                scope.key = '';
                scope.showitem = false;
            };
            scope.selUser = function(item) {
                scope.hasShow = false;
                scope.value = item.username;
                scope.key = item.id;
                scope.showitem = true;
            };

            scope.$watch('key', function(n, o) {
                if (n != null) {
                    if (n.length == 0) {
                        scope.deleteuser();
                    }
                }
            });
        }
    };
});


$(function() {
    ChooserCheck();
});

function ChooserCheck() {
    $("body").on({
        click: $.proxy(this.ChooserClick, this),
        mousedown: $.proxy(this.DeptClick, this)
    });
}

function ChooserClick(k) {
    var obj = k.target;
    if ($(obj).parent().hasClass('Chooser')) {
        $(obj).parent().find('.la').show();
        return;
    } else if ($(obj).parent().hasClass('la')) {
        return;
    } else {
        $('.Chooser .la').hide();
    }
}