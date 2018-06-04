app.directive('pageFooter', function () {
	return {
		restrict: 'EA',
		scope: {
			SearchContidion: '=searchcontidion',
			search: '&search'
		},
		replace: true,
		template: '<div class="pagefooter">' +
		'<a ng-show="SearchContidion.page.page-1>0" class="p" ng-click="PagePre()"><上一页</a>&nbsp;' +
		'<a ng-show="SearchContidion.page.page-1>0" ng-repeat="item in ppages" class="p" ng-click="PageClick(item)"><span>{{item}}</span></a>' +
		'<a ng-show="SearchContidion.page.max>0" class="p active" ><span>{{SearchContidion.page.page}}</span></a>' +
		'<a ng-repeat="item in npages" class="p" ng-click="PageClick(item)"><span>{{item}}</span></a>' +
		'<a ng-show="SearchContidion.page.page+1<=SearchContidion.page.size" class="p" ng-click="PageNext()">下一页></a>' +
		'<span style="margin-left:10px;color:#666;">共{{SearchContidion.page.size}}页,{{SearchContidion.page.max}}条</span>' +
		'</div>',
		link: function (scope, element, attributes) {
			scope.TidyPageIndex = function () {
				if (scope.SearchContidion != undefined) {
					if (scope.SearchContidion.page != undefined) {
						if (scope.SearchContidion.page.max != null) {
							scope.SearchContidion.page.size = Math.ceil(scope.SearchContidion.page.max / scope.SearchContidion.page.num);
							if (scope.SearchContidion.page.size > 0) {
								if (scope.SearchContidion.page.size < scope.SearchContidion.page.page) {
									scope.SearchContidion.page.page = scope.SearchContidion.page.size;
									scope.search();
								}
							}
						}
					}
				}
			};
			scope.PageStart = function () {
				scope.SearchContidion.page.page = 1;
				scope.search();
			};
			scope.PageEnd = function () {
				scope.SearchContidion.page.page = scope.SearchContidion.page.size;
				scope.search();
			};

			scope.PageNext = function () {
				if (scope.SearchContidion.page.page + 1 > scope.SearchContidion.page.size) {
					return;
				} else {
					scope.SearchContidion.page.page = scope.SearchContidion.page.page + 1;
					scope.search();
					scope.addnearpage();
				}
			};
			scope.PagePre = function () {
				if (scope.SearchContidion.page.page - 1 === 0) {
					return;
				} else {
					scope.SearchContidion.page.page = scope.SearchContidion.page.page - 1;
					scope.search();
					scope.addnearpage();
				}
			};

			scope.PageClick = function (item) {
				scope.SearchContidion.page.page = item;
				scope.search();
				scope.addnearpage();
			};

			scope.addnearpage = function () {
				scope.PageNextNear();
				scope.PagePreNear();
			};

			scope.PagePreNear = function () {
				scope.ppages = [];
				//默认添加5页
				var cpage = scope.SearchContidion.page.page;
				var cdis = cpage - 1;
				if (cdis >= 5) {
					for (var i = 5; i > 0; i--) {
						scope.ppages.push(cpage - i);
					}
				} else {
					for (var i = cdis; i > 0; i--) {
						scope.ppages.push(cpage - i);
					}
				}
			};

			scope.PageNextNear = function () {
				scope.npages = [];
				//默认添加5页
				var cpagesize = scope.SearchContidion.page.size;
				var cpage = scope.SearchContidion.page.page;
				var cdis = cpagesize - cpage;
				if (cdis >= 5) {
					for (var i = 0; i < 5; i++) {
						scope.npages.push(cpage + 1 + i);
					}
				} else {
					for (var i = 0; i < cdis; i++) {
						scope.npages.push(cpage + 1 + i);
					}
				}
			};
			scope.$watch('SearchContidion.page.max', function (n, o) {
				if (scope.SearchContidion == undefined) {
					return;
				}
				if (scope.SearchContidion.page == undefined) {
					return;
				}
				if (scope.SearchContidion.page.max == undefined) {
					return;
				}
				scope.TidyPageIndex();
				scope.addnearpage();
			});
		}
	};
});

app.directive('spageFooter', function () {
	return {
		restrict: 'EA',
		scope: {
			SearchContidion: '=searchcontidion',
			search: '&search'
		},
		replace: true,
		template: '<div class="spagefooter">' +
		'<a ng-show="SearchContidion.page.page-1>0" class="p" ng-click="PagePre()"><span><上一页</span></a>&nbsp;' +
		'<a ng-repeat="item in ppages" class="p" ng-click="PageClick(item)"><span>{{item}}</span></a>' +
		'<a ng-show="SearchContidion.page.max>0" class="p iactive" ><span>{{SearchContidion.page.page}}</span></a>' +
		'<a ng-repeat="item in npages" class="p" ng-click="PageClick(item)"><span>{{item}}</span></a>' +
		'<a ng-show="SearchContidion.page.page+1<=SearchContidion.page.size" class="p" ng-click="PageNext()"><span>下一页></span></a>' +
		'<span style="margin-left:10px;color:#666;">共{{SearchContidion.page.size}}页,{{SearchContidion.page.max}}条</span>' +
		'</div>',
		link: function (scope, element, attributes) {
			scope.TidyPageIndex = function () {
				if (scope.SearchContidion != undefined) {
					scope.SearchContidion.page.size = Math.ceil(scope.SearchContidion.page.max / scope.SearchContidion.page.num);
					if (scope.SearchContidion.page.size > 0) {
						if (scope.SearchContidion.page.size < scope.SearchContidion.page.page) {
							scope.SearchContidion.page.page = scope.SearchContidion.page.size;
							scope.search();
						}
					}
				}
			};
			scope.PageStart = function () {
				scope.SearchContidion.page.page = 1;
				scope.search();
			};
			scope.PageEnd = function () {
				scope.SearchContidion.page.page = scope.SearchContidion.page.size;
				scope.search();
			};

			scope.PageNext = function () {
				if (scope.SearchContidion.page.page + 1 > scope.SearchContidion.page.size) {
					return;
				} else {
					scope.SearchContidion.page.page = scope.SearchContidion.page.page + 1;
					scope.search();
					scope.addnearpage();
				}
			};
			scope.PagePre = function () {
				if (scope.SearchContidion.page.page - 1 === 0) {
					return;
				} else {
					scope.SearchContidion.page.page = scope.SearchContidion.page.page - 1;
					scope.search();
					scope.addnearpage();
				}
			};

			scope.PageClick = function (item) {
				scope.SearchContidion.page.page = item;
				scope.search();
				scope.addnearpage();
			};

			scope.addnearpage = function () {
				scope.PageNextNear();
				scope.PagePreNear();
			};

			scope.PagePreNear = function () {
				scope.ppages = [];
				//默认添加5页
				var cpage = scope.SearchContidion.page.page;
				var cdis = cpage - 1;
				if (cdis >= 5) {
					for (var i = 5; i > 0; i--) {
						scope.ppages.push(cpage - i);
					}
				} else {
					for (var i = cdis; i > 0; i--) {
						scope.ppages.push(cpage - i);
					}
				}
			};

			scope.PageNextNear = function () {
				scope.npages = [];
				//默认添加5页
				var cpagesize = scope.SearchContidion.page.size;
				var cpage = scope.SearchContidion.page.page;
				var cdis = cpagesize - cpage;
				if (cdis >= 5) {
					for (var i = 0; i < 5; i++) {
						scope.npages.push(cpage + 1 + i);
					}
				} else {
					for (var i = 0; i < cdis; i++) {
						scope.npages.push(cpage + 1 + i);
					}
				}
			};
			scope.$watch('SearchContidion.page.max', function (n, o) {
				if (scope.SearchContidion == undefined) {
					return;
				}
				scope.TidyPageIndex();
				scope.addnearpage();
			});
		}
	};
});
