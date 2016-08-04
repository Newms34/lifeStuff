//TO DO:
//implement species (or at least trophic levels)!
/*PLAN:
Each organism will have:
x: x position
y: y position
z: z position
dx,dy,dz: movement in each direction
hp: current health
type: carnivore, omnivore, herbivore, producer (carni, omni, herbi, prod)
spec: species
eats: [array], except for plants
targ: current target
sex: gender
mate: function, takes targ if male or just sets 'receptive' if female
pred: function, attack target, attempt to kill. Onkill, gain all target's HP up to max of this org
fight: function, for inter/intraspecific non-predation-based competition. if target is same species, much lower chance to kill
isDef: number. If target is defended, preds have much lower chance to kill (and higher chance to die themselves)
matureTime: When young creature is created, it takes time before it can use any of the fns above.
mode: pred, mate, none, plant

WHAT NEEDS TO HAPPEN EACH ROUND:
1: kill off orgs with hp==0
2: change mode of orgs that have attempted a mating or predation or fight (i.e., that have mode==none) AND coolDown==0 AND matureTime==0;
    a: if matureTime and/or coolDown > 0, subtract 1
3: pick new relevant target
4: add 1 to hunger, 1 to lastMate for all orgs
    a: if hunger or lastMate>100, dont add 1. If hunger==100, subtract 1 from HP
5: check position of target and adjust org.vel to head towards targ
6: check boundaries and reverse if @ boundary.
7: if @ target and pred, pred fn.
8: if @ target and mate, mate fn.; produce babeh if successful.
9: if @ target and wander, fight fn.

MAY NEED TO TIME FIRST ROUND FOR SPEED!
*/
//Params
var maxNum = 100;
var orgs = [],
    w = $(window).width() - 10,
    h = $(window).height() - 10,
    d = w,
    timeDelta,
    itNum = 0; //all orgs

//constructor
var orgConst = function(x, y, z, spec, type, sex) {
    this.pos = {
        x: x,
        y: type == 'prod' ? h : y,
        z:  z
    };
    this.vel = {
        dx: 1,
        dy: type == 'prod' ? 0 : 1,
        dz:1
    };
    this.hp = 300;
    this.id = Math.floor(Math.random() * 9999999999999).toString(32); //generate a random id for this org for tracking
    this.type = type;
    this.spec = spec;
    this.eats = fl[this.spec];
    this.sex = sex; //1 = male, 2 = female
    this.vis = 10; //may make this dynamic later. Basically, the distance within which an org must be befroe it can see (and thus use a fn on) its target
    this.targ = null; //stored as array pos of target
    this.isDef = 50;
    this.matureTime = orgStats[this.spec].timeToMature;
    this.mode = 'none';
    this.coolDown = 0; //set to 100 after pred or mate event. Forces org to wait before another 'activity'. when it reaches 0, choose mode pred or mode mate.
    this.lastMate = 0;
    this.scareTimer = null;
    this.targetters = {};//who's targetting this? Used for mating, but more for predation and the 'flee' function
    this.mateTimerMax = orgStats[this.spec].gestation; //this will be made dynamic later (for R-selection vs. K-selection). It determines the period between matings (max)
    this.hunger = 0; //if this reaches 100, it no longer increases (can be lowered obvsly), but instead subtracts 0.5 from HP per turn (due to starvation)
};
orgConst.prototype.pred = function() {
    console.log('STUFF:', getDist(this, orgs[this.targ]), this.eats.indexOf(orgs[this.targ].spec));
    if (getDist(this, orgs[this.targ]) < this.vis && this.eats.indexOf(orgs[this.targ].spec) != -1 && this.hp) {
        //organism is close enough to target, and target is something that this org eats
        var rollChance = orgs[this.targ].isDef ? 10 : 3; //if target is being defended, only get a 1 in 10 chance. Otherwise, get a 1 in 3 chance.
        if (Math.floor(Math.random() * rollChance) < 1) {
            //kill!
            //first, grab the current HP of targ, and add to pred
            this.hp += orgs[this.targ].hp;
            if (this.hp > 100) {
                this.hp = 100;
            }
            console.log(this.spec, this.id, 'preyed on', orgs[this.targ].spec, orgs[this.targ].id, 'successfully!');
            orgs[this.targ].hp = 0; //set target hp to 0
        } else {
            //no kill! roll for pred dmg
            rollChance = orgs[this.targ].isDef ? 3 : 20; //if org is defended, 1 in 3 chance of injury. Else, 1 in 20.
            if (Math.floor(Math.random() * rollChance) < 1 && orgs[this.targ].type != 'prod') {
                //attack backfired! Remove 18pts of hp.
                //note that plants cannot defend
                this.hp -= 18;
            }
            console.log(this.spec, this.id, 'attempted to prey on', orgs[this.targ].spec, orgs[this.targ].id, 'but failed!');
        }
    }
    this.coolDown = 100;
    this.pickNewTarg();
};
orgConst.prototype.mate = function() {
    if (Math.random() > 0.1 && getDist(this, orgs[this.targ]) < this.vis && this.hp && this.sex == 1 && orgs[this.targ].mode == 'mate' && orgs[this.targ].sex == 2 && orgs[this.targ].hp && orgs[this.targ].spec == this.spec) {
        //close enough, this and targ are alive, this and targ are same species, both are in mate mode, this is male, and targ is female
        //the math.rand part above introduces a random failure factor
        console.log(this.spec, this.id, 'mated with', orgs[this.targ].spec, orgs[this.targ].id);
        birth(this, orgs[this.targ]);
        return 'b';
    }
    this.coolDown = 100;
    this.pickNewTarg();
};
orgConst.prototype.fleeCheck = function(){
    //fly, you fools!
    //check for flees?
    var chaserInRange=false;//false if no chaser in range. Otherwise, this is the id of the chaser.
    var closest=Number.POSITIVE_INFINITY;
    var chaseIds = Object.keys(this.targetters);
    for(var i=0;i<chaseIds.length;i++){
        var preda = findOrgById(chaseIds[i]),
        distToPred = getDist(this,pred);
        if (preda.mode=='pred' && distToPred<closest && distToPred<this.vis){
            //targetter is a predator and is the closest predator and is in 'visible' range
            chaserInRange=pred.id;
            closest = distToPred;
        }
    }
    if (chaserInRange && !this.scareTimer){
        this.scareTimer = 100;
        this.mode='flee';
    }
    else if (chaserInRange){
        if(this.pos.x>pred.pos.x){
            this.vel.dx=1;
        }else{
            this.vel.dx=-1;
        }
        if(this.pos.y>pred.pos.y){
            this.vel.dy=1;
        }else{
            this.vel.dy=-1;
        }
        if(this.pos.z>pred.pos.z){
            this.vel.dz=1;
        }else{
            this.vel.dz=-1;
        }
    }
};
orgConst.prototype.fight = function() {
    if (getDist(this, orgs[this.targ]) < this.vis && this.hp) {
        //organism is close enough to target, and is alive (hp>0)
        var rollChance = orgs[this.targ].spec == this.spec ? 15 : 3; //if targ is same species, low chance of dmg. Otherwise, slightly... less low
        var whichWins = Math.floor(Math.random() * 2);
        if (Math.floor(Math.random() * rollChance) < 1) {
            //fight results in an org being damaged 
            if (!whichWins) {
                //this org gets dmged
                console.log(this.spec, this.id, 'fought', orgs[this.targ].spec, orgs[this.targ].id, 'and lost.');
                this.hp -= 10;
            } else {
                //other org gets dmged
                console.log(this.spec, this.id, 'fought', orgs[this.targ].spec, orgs[this.targ].id, 'and won.');
                orgs[this.targ].hp -= 10;
            }
        } else {
            console.log('Fight between', this.spec, this.id, 'and', orgs[this.targ].spec, orgs[this.targ].id, 'with no injuries');
        }
    }
    this.coolDown = 100;
    this.pickNewTarg();
};
orgConst.prototype.pickNewTarg = function() {
    //pick a target
    if(orgs[this.targ] && orgs[this.targ].targetters[this.id]){
        //just interacted, target still exists. remove this from target's list
        delete orgs[this.targ].targetters[this.id];
        //remove this from the list of orgs targetting this organism's old target
    }
    this.targ = Math.floor(Math.random() * orgs.length);
    var validMatch = false;
    var numTries=0;
    if (!orgs.length||orgs.length==1){
        //either no more orgs, or this is the last org. So no more targs!
        this.targ=null;
        return false;
    }
    while (orgs[this.targ].id == this.id || (orgs[this.targ].type == 'prod' && this.type == 'carni') && validMatch) {
        //keep repicking until we have a legitimate match:
        //must not be the same organism (cannot target self), and predators do not interact with plants
        //note that we DONT need to check if the reverse is true (this is plant and target is pred), since plants dont have targets
        if (this.mode == 'pred' && this.eats.indexOf(orgs[this.targ].spec) != -1) {
            //valid prey item
            validMatch = true;
        } else if (this.mode != 'pred') {
            //mode not pred, so valid
            validMatch = true;
        }
        this.targ = Math.floor(Math.random() * orgs.length);
        numTries++;
        if (numTries>orgs.length-1){
            return false;
        }

    }
    this.mode = 'none';
    // console.log(this.spec, this.id, 'picked', orgs[this.targ].spec, orgs[this.targ].id);
    //target selected. Add prop to target obj
    orgs[this.targ].targetter[this.id]='none';
};
orgConst.prototype.pickMode = function() {
    //this method picks the mode of the target, depending on how hungry the organism is and how recently its mated
    //hunger first:
    this.mode = 'wander'; //default to mode 'wander' if nothing else. In this mode, org seeks a random target to fight with it.
    if (!this.matureTime || this.matureTime < 1) {
        //make sure organism is sexually mature
        if ((this.hunger / 100) > (this.lastMate / this.mateTimerMax)) {
            if (Math.random() < this.hunger / 100) {
                //in other words, the hungrier this is, the more likely it is to pick pred mode
                this.mode = 'pred';
            } else if (Math.random() > (this.lastMate / this.mateTimerMax)) {
                this.mode = 'mate';
            }
        } else {
            //mate first
            if (Math.random() > (this.lastMate / this.mateTimerMax)) {
                //in other words, the hungrier this is, the more likely it is to pick pred mode
                this.mode = 'mate';
            } else if (Math.random() > this.hunger / 100) {
                this.mode = 'pred';
            }
        }
    } else if (Math.random() > this.hunger / 100) {
        this.mode = 'pred';
    }
    orgs[this.targ].targetter[this.id]=this.mode;
};
var findOrgById = function(n){
    for (var q=0;q<orgs.length;q++){
        if (orgs[q].id==n){
            return orgs[q];
        }
    }
};
var die = function(n) {
    //kill org. Remove from list of orgs (objs), and element from DOM. Also, run thur other orgs, left-shift ones AFTER this org, and redo targs (so no one is targetting an invalid targ)
    //this function is run for EVERY organism with hp <= 0 at every tick
    console.log(orgs[n], 'died!');
    var creature = orgs[n].sex==1?'male':'female';
    creature += ' '+orgs[n].spec+orgStats[orgs[n].spec].img;
    var theId = orgs[n].id;
    orgs.splice(n, 1);
    var orgDivs = $('.one-org');
    for (var r = 0; r < orgDivs.length; r++) {
        console.log('LOOKING TO DELETE', n);
        if (orgDivs[r].id == theId) {
            $(orgDivs[r]).remove();
            break;
        }
    }
    for (var i = 0; i < orgs.length; i++) {
        console.log('LOOKING TO DELETE', n);
        if (orgs[i].targ == n) {
            //if this organism's target was the old organism, give it a new target
            orgs[i].pickNewTarg();
        } else if (orgs[i].targ > n) {
            //if the number of this org is greater than the organism, left shift them by one (since we've removed one item from the list, it's 1 shorter)
            orgs[i].targ--;
        }
    }
    var scp = angular.element(document.querySelector('#angbit')).scope();
    scp.$apply(function(){
        scp.orgNum = orgs.length;
        scp.orgDelt = -1;
    });
    if(orgs.length<1){
        clearInterval(mainTimer);
        bootbox.alert('Your ecosystem has crashed! The last survivor was a '+creature+'.');
    }
};
var birth = function(f, m) {
    //make a new org from Father and Mother
    var zee = m ? f.z : h; //if mother is not defined, this is a plant, and thus 'lives' only on the bottom of the screen.
    var newBeast = new orgConst(f.x, f.y, zee, f.spec, f.type, Math.floor(Math.random() * 2) + 1);
    orgs.push(newBeast);
    var newOrgDiv = document.createElement('div');
    var gend = newBeast.sex == 1 ? 'SLASHu2642' : 'SLASHu2640';
    newOrgDiv.className = 'one-org';
    newOrgDiv.innerHTML = orgStats[newBeast.spec].img + gend;
    newOrgDiv.style.left = x + 'px';
    newOrgDiv.style.top = y + 'px';
    newOrgDiv.style.transform = 'translateZ(' + z + 'px)';
    newOrgDiv.id = newBeastie.id;
    $('#field').append(newOrgDiv);
    var scp = angular.element(document.querySelector('#angbit')).scope();
    scp.$apply(function(){
        scp.orgNum = orgs.length;
        scp.orgDelt = 1;
    });
};
//get dist btwn two orgs
var getDist = function(o, t) {
    var a = Math.abs(o.pos.x - t.pos.x);
    var b = Math.abs(o.pos.y - t.pos.y);
    var c = Math.abs(o.pos.z - t.pos.z);
    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)+ Math.pow(c, 2)));
};

//TESTING STUFF-------------
// var testP = new orgConst(2, 3, 4, 'monkey', 'omni', 1);
// var testH = new orgConst(3, 2, 4, 'mouse', 'omni', 1);
// testP.targ = 1;
// orgs.push(testP, testH);
// console.log(testP, testH);
//END TESTING STUFF---------

var step = function() {
    //MAIN STEPPER FUNCTION. AAAAAAAAAAAH;
    var numOrgs = orgs.length;
    for (var i = 0; i < numOrgs; i++) {
        //death
        if (orgs[i].hp < 1) {
            die(i);
            numOrgs--;
            i--;
            // continue;
        }
        //mode and target
        if (orgs[i].mode == 'none' && !orgs[i].coolDown && !orgs[i].matureTime) {
            orgs[i].pickMode();
            orgs[i].pickNewTarg();
        } else if (orgs[i].coolDown > 0 || orgs[i].matureTime > 0) {
            if (orgs[i].coolDown && orgs[i].coolDown > 0) {
                orgs[i].coolDown--;
            }
            if (orgs[i].matureTime && orgs[i].matureTime > 0) {
                orgs[i].matureTime--;
            }
        }
        //hunger and lastMate
        if (orgs[i].type!='prod'){
            if (orgs[i].hunger < 100) {
                orgs[i].hunger++;
            } else {
                //starvation!
                orgs[i].hp--;
            }
            if (orgs[i].lastMate < 100) {
                orgs[i].lastMate++;
            }
        }
        //movement!
        if (orgs[i].type != 'prod') {
            if (!orgs[i].targ || getDist(orgs[i], orgs[orgs[i].targ]) > orgs[i].vis) {
                //too far to fight/pred/mate on THIS org's target, so move
                //first, check flee status (fleeing takes precidence over predation/fighting/mating)
                orgs[i].fleeCheck();
                //next, check pos of target.
                if (orgs[i].targ && orgs[i].mode!=='flee') {
                    //has a target
                    if (orgs[i].pos.x > orgs[orgs[i].targ].pos.x) {
                        orgs[i].vel.dx = -1;
                    } else {
                        orgs[i].vel.dx = 1;
                    }

                    if (orgs[i].pos.y > orgs[orgs[i].targ].pos.y) {
                        orgs[i].vel.dy = -1;
                    } else {
                        orgs[i].vel.dy = 1;
                    }

                    if (orgs[i].pos.z > orgs[orgs[i].targ].pos.z) {
                        orgs[i].vel.dz = -1;
                    } else {
                        orgs[i].vel.dz = 1;
                    }
                }else if(orgs[i].mode=='flee'){
                    if(orgs[i].scareTimer && orgs[i].scareTimer>0){
                        orgs[i].scareTimer--;
                    }else{
                        orgs[i].mode='none';//no more fear! set back to default mode
                    }
                }
                //next, boundaries
                if ((orgs[i].pos.x + orgs[i].vel.dx) > w || (orgs[i].pos.x + orgs[i].vel.dx) < 0) {
                    orgs[i].vel.dx = -1 * orgs[i].vel.dx;
                }

                if ((orgs[i].pos.y + orgs[i].vel.dy) > h || (orgs[i].pos.y + orgs[i].vel.dy) < 0) {
                    orgs[i].vel.dy = -1 * orgs[i].vel.dy;
                }

                if ((orgs[i].pos.z + orgs[i].vel.dz) > d || (orgs[i].pos.z + orgs[i].vel.dz) < 0) {
                    orgs[i].vel.dz = -1 * orgs[i].vel.dz;
                }
                orgs[i].pos.x += orgs[i].vel.dx;
                orgs[i].pos.y += orgs[i].vel.dy;
                orgs[i].pos.z += orgs[i].vel.dz;
                //now move the div!
                // console.log($('#'+orgs[i].id))
                $('#' + orgs[i].id).css({
                    'left': orgs[i].pos.x + 'px',
                    'top': orgs[i].pos.y + 'px',
                    'transform': 'translateZ(' + orgs[i].pos.z + 'px)'
                });
                // $('#'+orgs[i].id).html(JSON.stringify(orgs[i]))
            } else {
                //close enough for interaction
                if (orgs[i].mode == 'pred') {
                    orgs[i].pred();
                } else if (orgs[i].mode == 'mate') {
                    var sx = orgs[i].mate();
                    if (sx == 'b') {
                        numOrgs++;
                    }
                } else if (orgs[i].mode == 'wander' && orgs[orgs[i].targ].type != 'prod') {
                    orgs[i].fight();
                }
                //else near a plant, but not 'hungry', so pick new targ
                orgs[i].pickNewTarg();
            }
        } else if (Math.random() > 0.995) {
            //plants have their own behaviors, since they do not target and they do not mate.
            //note that we completely bypass the mating fn here.
            birth(orgs[i], null);
        }
    }
    itNum++;
    console.log(orgs[0].pos);
    // console.log('iteration number:', itNum,'world pop:',orgs.length);
};

var mainTimer; //main timer. Srsly, I'm not mincing variable names here, folks.

//first round is done with a timer to see how long it takes. this is used to prevent one 'round' from overtaking another (i.e., the functions for round 30 starting before the functions for round 29 are finished.)
var startMe = function() {
    var startTime = new Date().getTime();
    step();
    var endTime = new Date().getTime();
    timeDelta = (endTime - startTime) > 50 ? (endTime - startTime) : 50;
    console.log('frame rate: 1 frame every', timeDelta, 'ms.');
    mainTimer = setInterval(function() {
        step();
    }, timeDelta * 1.5);
};

var setupBox = function() {
    var v = 80;
    $('#b-left').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skyside.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateY(90deg) translateZ(-' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-right').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skyside.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateY(90deg) translateZ(' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-top').css({
        'width': w + 'px',
        'height': d + 'px',
        'background-image': 'url("./img/skytop.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateX(90deg) translateZ(' + (d / 2) + 'px) translateY(-' + (d / 2) + 'px)'
    });
    $('#b-back').css({
        'width': w + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skyside.jpg")',
        'background-size': '100% 100%',
        'transform': 'translateZ(-' + (d) + 'px)',
        'transform-style': 'preserve-3d'
    });
    $('#b-bottom').css({
        'width': w + 'px',
        'height': d + 'px',
        'background-image': 'url("./img/dirt.jpg")',
        'transform': 'rotateX(90deg) translateZ(' + (30) + 'px) translateY(-' + (d / 2) + 'px)',
        'overflow': 'hidden'
    });
    //now, the targetting cylinder
};
window.onkeyup = function(e) {
    //emergency stop button: press 's' to stop the iteration timer.
    if (e.which == 83) {
        clearInterval(mainTimer);
    }
};
setupBox();
