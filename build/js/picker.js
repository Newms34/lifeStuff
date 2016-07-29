var app  = angular.module('pickerApp',[]).controller('pik-cont',function($scope){
	$scope.orgs = []; 
	$scope.pikActive=true;
	for (var tax in orgStats){
		var newOrg  = {
			name:tax,
			img:orgStats[tax].img,
			gestation:orgStats[tax].gestation,
			timeToMature:orgStats[tax].timeToMature,
			type:orgStats[tax].type,
			eats:fl[tax]||'prod',
			active:false
		}
		$scope.orgs.push(newOrg);
	}
});
app.filter('typeViewer', function() {
	var types = {
		'omni':'Omnivore: Eats both plants an animals',
		'pred':'Predator (carnivore): Eats animals',
		'herbi':'Herbivore: Eats plants',
		'prod':'Producer: Produces energy from sun'
	}
    return function(t) {
  		return types[t];
    };
});