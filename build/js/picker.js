var app = angular.module('pickerApp', []).controller('pik-cont', function($scope) {
    $scope.orgs = [];
    $scope.pikActive = true;
    $scope.orgNum = 0;
    $scope.orgDelt = 0;
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
        if (o.type != 'prod') {
            //plants dont have the pairs problem or the eating problem
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
        $scope.doD3Things();
    };
    $scope.doD3Things = function() {
        //first, clear the d3 stuff
        $('#graffSvg').remove();
        var links = [];
        var nodes = {};
        var cols = {
            'ps': '#f00',
            'hp': '#fc0',
            'oh': '#ff0',
            'oo': '#cf0',
            'oc': '#0f0',
            'ch': '#0fc',
            'co': '#0ff',
            'cc': '#0cf'
        };
        for (var i = 0; i < $scope.orgs.length; i++) {
            //for each org, find which of its
            if ($scope.orgs[i].type != 'prod') {
                for (var j = 0; j < $scope.orgs[i].eats.length; j++) {
                    if ($scope.orgs[i].quant && $scope.findOrg($scope.orgs[i].eats[j]).quant) {
                        links.push({
                            source: $scope.orgs[i].name,
                            target: $scope.findOrg($scope.orgs[i].eats[j]).name,
                            num: $scope.orgs[i].quant,
                            type: $scope.orgs[i].type[0] + $scope.findOrg($scope.orgs[i].eats[j]).type[0]
                        });
                    }
                }
            } else {
                if ($scope.orgs[i].quant) {
                    links.push({
                        source: $scope.orgs[i].name,
                        target: 'sun',
                        num: $scope.orgs[i].quant,
                        type: 'ps'
                    });
                }
            }
        }
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {
                name: link.source
            });
            link.target = nodes[link.target] || (nodes[link.target] = {
                name: link.target
            });
        });

        var graffwidth = 0.95 * $('#angbit .panel').width(),
            graffheight = 0.95 * $('#angbit .panel').height(),
            force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([graffwidth, graffheight])
            .linkDistance(260)
            .charge(-100)
            .on("tick", tick)
            .start(),
            svg = d3.select("#graffDiv").append("svg")
            .attr("width", graffwidth)
            .attr("height", graffheight)
            .attr("id", "graffSvg"),
            path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) {
                return 'link';
            })
            .attr("style", function(d) {
                return 'stroke:' + cols[d.type];
            })
            .attr("marker-end", function(d) {
                return "url(#arrow)";
            }),
            circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", function(d) {
                var rad = $scope.findOrg(d.name) && $scope.findOrg(d.name).quant < 40 ? $scope.findOrg(d.name).quant : 40;
                return rad;
            })
            .call(force.drag),
            text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("x", 0)
            .attr("y", ".31em")
            .text(function(d) {
                if (orgStats[d.name]) {
                    return orgStats[d.name].img + d.name;
                }
                return 'SLASHu2600sun';
            });

        function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transGraff);
            text.attr("transform", transGraff);
        }

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transGraff(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }
        console.log(links);
        $scope.pyramid();
    };
    $scope.findOrg = function(n) {
    	//find a particular organism by name and return it
        for (var q = 0; q < $scope.orgs.length; q++) {
            if ($scope.orgs[q].name == n) {
                return $scope.orgs[q];
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
        $('#graffSvg').remove();
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
                $scope.orgNum++;
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
    $scope.prods=0;
    $scope.prim=0;
    $scope.sec=0;
    $scope.tert=0;
    $scope.maxOrgs = 0;
    $scope.pyramid = function() {
        //number of consumers of each (generalized) trophic level
        $scope.prods=0;
    	$scope.prim=0;
    	$scope.sec=0;
    	$scope.tert=0;
    	$scope.maxOrgs = 0;

        //NEED TO REDEFINE SEC AND TERT
        //idealy, each successive number above should be 1/10 of the previous. So, 1000 prods, 100 prims, 10 secs, and 1 tert.
        //defs: producer: plant. prim: only eats herbis. sec: only eats animals that eat herbis. tert: other
        for (var i = 0; i < $scope.orgs.length; i++) {
            if ($scope.orgs[i].type == 'prod') {
                $scope.prods += $scope.orgs[i].quant;
                $scope.maxOrgs = $scope.maxOrgs>$scope.prods? $scope.maxOrgs: $scope.prods;
            } else {
                //not a producer, so we need to determine what this eats.
                var isHerbi = true;
                for (var j = 0; j < $scope.orgs[i].eats.length; j++) {
                    if (orgStats[$scope.orgs[i].eats[j]].type != 'prod') {
                        //eats something other than plants, so NOT a herbivore (primary producer)
                        isHerbi = false;
                        break;
                    }
                }
                if (isHerbi) {
                    $scope.prim += $scope.orgs[i].quant;
                    $scope.maxOrgs = $scope.maxOrgs>$scope.prim? $scope.maxOrgs: $scope.prim;
                } else {
                    //not primary consumer
                    var foundEater = false;
                    var menus = Object.keys(fl);
                    for (j = 0; j < menus.length; j++) {
                        if(menus[j]!=$scope.orgs[i].name && fl[menus[j]].indexOf($scope.orgs[i].name)!=-1){
                        	foundEater=true;
                        	break;
                        	//found something that eats this, so this is NOT an apex pred
                        }
                    }
                    if (foundEater) {
                        $scope.sec += $scope.orgs[i].quant;
                        $scope.maxOrgs = $scope.maxOrgs>$scope.sec? $scope.maxOrgs: $scope.sec;
                    } else {
                        $scope.tert += $scope.orgs[i].quant;
                        $scope.maxOrgs = $scope.maxOrgs>$scope.tert? $scope.maxOrgs: $scope.tert;
                    }

                }
            }
        }
    };
});
app.filter('typeViewer', function() {
    var types = {
        'omni': 'Omnivore: Eats both plants and animals',
        'pred': 'Predator (carnivore): Eats animals',
        'herbi': 'Herbivore: Eats plants',
        'prod': 'Producer: Produces energy from sun'
    };
    return function(t) {
        return types[t];
    };
});
