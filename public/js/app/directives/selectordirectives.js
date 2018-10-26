app.directive('hmSelector', function () {
	return {
		restrict: 'EA',
		scope: {
			hour: '=hour',
			minute: '=minute',
		},
		template: '<div class="dt">' +
		'<span class="s">{{hour}}</span>' +
		'<div class="it up" ng-click="addhour()"></div>' +
		'<div class="it down" ng-click="subhour()"></div>' +
		'</div><span class="sr">时</span>' +
		'<div class="dt">' +
		'<span class="s" >{{minute}}</span>' +
		'<div class="it up" ng-click="addminute()"></div>' +
		'<div class="it down" ng-click="subminute()"></div>' +
		'</div><span class="sr">分</span>',
		link: function (scope, element, attributes) {
			scope.addhour = function () {
				if (scope.hour == 23) {
					scope.hour = 0;
					return;
				}
				scope.hour++;
			};
			scope.subhour = function () {
				if (scope.hour == 0) {
					scope.hour = 23;
					return;
				}
				scope.hour--;
			};
			scope.addminute = function () {
				if (scope.minute == 30) {
					scope.minute = 0;

				} else if (scope.minute == 0) {
					scope.minute = 30;
				}
			};
			scope.subminute = function () {
				if (scope.minute == 30) {
					scope.minute = 0;
				} else if (scope.minute == 0) {
					scope.minute = 30;
				}
			};

		}
	};
});

app.directive('xrxaliasinfo', function ($http) {
	return {
		restrict: 'AE',
		scope: {
			value: '=value'
		},
		template: '<input type="text" class="cin" ng-model="value" ng-click="decrement()" ng-keyup="decrement()">' +
		'<div class="la" ng-show="hasShow">' +
		'<div  ng-class="{true:\'sitem\',false:\'nitem\'}[$index%2==0]" ng-repeat="item in Users" ng-click="selUser(item)">{{item}}</div></div>',
		link: function (scope, element, attributes) {
			element.toggleClass('Chooser');
			scope.decrement = function () {
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
			scope.getUser = function () {
				if (scope.value == null) {
					scope.value = '';
				}
				$http.post(rootpath + '/elements/list/alias/page', {
					alias: scope.value
				}).success(function (data) {
					if (data.bresult) {
						console.log(data);
						scope.Users = data.object;
						if (scope.Users.length > 0) {
							scope.hasShow = true;
						}
					}
				});
			};
			scope.selUser = function (item) {
				scope.hasShow = false;
				scope.value = item;
			};
		}
	};
});
