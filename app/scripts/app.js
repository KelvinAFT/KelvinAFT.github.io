var app = angular.module('app', ["ngResource"]);

app.controller('appCtrl', ['$scope','dataResource', function ($scope,dataResource) {
	
	var ng = $scope;
	ng.arrayCompras = [];
	ng.arrayItems = [];
	ng.totalPagar = 0.00;
	ng.classRemove = "";
	ng.amount = 1;

	ng.addItem = function (item,amount) {
		var subtotal = 0;
		var exist = false;
		angular.forEach(ng.arrayCompras, function(itemC ) {
			if (itemC.id==item.id) {
				ng.totalPagar += Number((amount * item.price).toFixed(2));
				itemC.amount = itemC.amount + Number(amount);
				exist = true;
			};
		});
		if (!exist) {
			ng.totalPagar += Number((item.amount * item.price).toFixed(2));
			ng.arrayCompras.push(item);
		};
	}
	ng.updateTotal = function () {
		console.log("upd");
		ng.totalPagar = 0;
		angular.forEach(ng.arrayCompras, function(item) {
			ng.totalPagar += Number((item.amount * item.price).toFixed(2));
		});
	}
	ng.removeItem = function (i,index) {
		i.delitem = true;
		ng.arrayCompras.splice(index,1);
		ng.totalPagar = ng.totalPagar - Number((i.amount * i.price).toFixed(2));
		ng.items -= 1;
	}
	ng.listItems = function () {
		ng.arrayItems = dataResource.get();
	}
	ng.listItems();
}]);

app.factory('dataResource', function ($resource) {
	return $resource("/data/data.json",{},{ get: { method: "GET", isArray: true }});
});