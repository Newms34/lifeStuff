var app = angular.module('pickerApp', []).controller('pik-cont', function($scope) {
    $scope.orgs = [];
    $scope.pikActive = true;
    $scope.orgNum = 0;
    for (var tax in orgStats) {
        var newOrg = {
            name: tax,
            img: orgStats[tax].img,
            gestation: orgStats[tax].gestation,
            timeToMature: orgStats[tax].timeToMature,
            type: orgStats[tax].type,
            eats: fl[tax] || 'prod',
            active: false,
            quant: 0,
            warns: {
                pairs: false,
                snaks: false
            }
        };
        $scope.orgs.push(newOrg);
    }
    $scope.checkOrgValid = function(o) {
        o.warns.pairs = false;
        o.warns.snaks = false;
        if (o.type == 'prod') {
            //plants dont have the pairs problem or the eating problem
            return false;
        } else {
            if (o.quant == 1) {
                o.warns.pairs = true;
            }
            //now check food orgs
            for (var t = 0; t < $scope.orgs.length; t++) {
                $scope.orgs[t].warns.snaks = true; //default to true until we turn it off
                if ($scope.orgs[t].type != 'prod' && $scope.orgs[t].quant > 0) {
                    for (var f = 0; f < $scope.orgs[t].eats.length; f++) {
                        for (var n = 0; n < $scope.orgs.length; n++) {
                            if ($scope.orgs[t].eats[f] == $scope.orgs[n].name && $scope.orgs[n].quant > 0) {
                                //found org this is supposed to eat
                                $scope.orgs[t].warns.snaks = false;
                            }
                        }
                    }
                } else if ($scope.orgs[t].quant < 1) {
                    $scope.orgs[t].warns.snaks = false;
                }
            }

        }
    };
    $scope.resetNums = function() {
        for (var t = 0; t < $scope.orgs.length; t++) {
            $scope.orgs[t].quant = 0;
            $scope.orgs[t].warns = {
                pairs: false,
                snaks: false
            };
        }
    };
    $scope.makeWorld = function() {
        var hasOrg = false;
        for (var t = 0; t < $scope.orgs.length; t++) {
            if ($scope.orgs[t].quant && $scope.orgs[t].quant > 1) {
                hasOrg = true;
                break;
            }
        }
        if (!hasOrg) {
            bootbox.confirm('Warning! Your world currently has zero organisms! Are you sure you still want to create it?', function(r) {
                if (r) {
                    $scope.populate();
                }
            });
        } else {
            $scope.populate();
        }
    };
    $scope.populate = function() {
        //and DOM said: let their be OBJS.
        //and He saw the Objs, and that they were truthy.
        for (var t = 0; t < $scope.orgs.length; t++) {
            for (var q = 0; q < $scope.orgs[t].quant; q++) {
                var x = Math.floor(Math.random() * w),
                    y = Math.floor(Math.random() * h),
                    z = Math.floor(Math.random() * d),
                    spec = $scope.orgs[t].name,
                    type = $scope.orgs[t].type,
                    sex = Math.floor(Math.random() * 2) + 1;
                var newBeastie = new orgConst(x, y, z, spec, type, sex);
                orgs.push(newBeastie);
                //now create the div el!
                var newOrgDiv = document.createElement('div');
                var gend = newBeastie.sex == 1 ? 'SLASHu2642' : 'SLASHu2640';
                newOrgDiv.className = 'one-org';
                newOrgDiv.innerHTML = $scope.orgs[t].img + gend;
                newOrgDiv.style.left = x + 'px';
                newOrgDiv.style.top = y + 'px';
                newOrgDiv.style.transform = 'translateZ(' + z + 'px)';
                newOrgDiv.id = newBeastie.id;
                $('#field').append(newOrgDiv);
                $scope.orgNum++
            }
        }
        console.log('ORGS', orgs);
        $scope.pikActive = false;
        if (orgs.length && orgs.length > 0) {
            startMe();
        } else {
            $scope.$digest();
        }
    };
});
app.filter('typeViewer', function() {
    var types = {
        'omni': 'Omnivore: Eats both plants an animals',
        'pred': 'Predator (carnivore): Eats animals',
        'herbi': 'Herbivore: Eats plants',
        'prod': 'Producer: Produces energy from sun'
    };
    return function(t) {
        return types[t];
    };
});