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
    d = w; //all orgs

//constructor
var orgConst = function(x, y, z, spec, type, sex) {
    this.pos = {
        x: x,
        y: y,
        z: z
    };
    this.vel = {
        dx: 1,
        dy: 1,
        dz: 1,
    };
    this.hp = 100;
    this.id = Math.floor(Math.random() * 9999999999999).toString(32); //generate a random id for this org for tracking
    this.type = type;
    this.spec = spec;
    this.eats = getMenu(spec);
    this.sex = sex; //1 = male, 2 = female
    this.vis = 10; //may make this dynamic later. Basically, the distance within which an org must be befroe it can see (and thus use a fn on) its target
    this.targ = null; //stored as array pos of target
    this.isDef = 50;
    this.matureTime = 100;
    this.mode = 'none';
    this.coolDown = 0; //set to 100 after pred or mate event. Forces org to wait before another 'activity'. when it reaches 0, choose mode pred or mode mate.
    this.lastMate = 0;
    this.mateTimerMax = 100; //this will be made dynamic later (for R-selection vs. K-selection). It determines the period between matings (max)
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
            if (Math.floor(Math.random() * rollChance) < 1) {
                //attack backfired! Remove 18pts of hp.
                this.hp -= 18;
            }
            console.log(this.spec, this.id, 'attempted to prey on', orgs[this.targ].spec, orgs[this.targ].id, 'but failed!');
        }
    }
    this.mode = 'none';
    this.coolDown=100;
    this.pickNewTarg();
};
orgConst.prototype.mate = function() {
    if (Math.random()>.1 && getDist(this, orgs[this.targ]) < this.vis && this.hp && this.sex == 1 && orgs[this.targ].mode == 'mate' && orgs[this.targ].sex == 2 && orgs[this.targ].hp && orgs[this.targ].spec == this.spec) {
        //close enough, this and targ are alive, this and targ are same species, both are in mate mode, this is male, and targ is female
        //the math.rand part above introduces a random failure factor
        console.log(this.spec, this.id, 'mated with', orgs[this.targ].spec, orgs[this.targ].id);
        birth(this, orgs[this.targ]);
    }
    this.mode = 'none';
    this.coolDown=100;
    this.pickNewTarg();
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
    this.mode = 'none';
    this.coolDown=100;
    this.pickNewTarg();
};
orgConst.prototype.pickNewTarg = function() {
    //pick a target
    this.targ = Math.floor(Math.random() * orgs.length);
    var validMatch = false;
    while (orgs[this.targ].id == this.id || (orgs[this.targ].type = 'prod' && this.type == 'carni') && validMatch) {
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
    }
    console.log(this.spec, this.id, 'picked', orgs[this.targ].spec, orgs[this.targ].id);
};
orgConst.prototype.pickMode = function() {
    //this method picks the mode of the target, depending on how hungry the organism is and how recently its mated
    //hunger first:
    this.mode='wander';//default to mode 'wander' if nothing else. In this mode, org seeks a random target to fight with it.
    if ((this.hunger / 100) > (this.lastMate / this.mateTimerMax)) {
        if (Math.random() < this.hunger / 100) {
            //in other words, the hungrier this is, the more likely it is to pick pred mode
            this.mode = 'pred';
        } else if (Math.random() > (this.lastMate / this.mateTimerMax)) {
            this.mode = 'mate';
        }
    }else{
        //mate first
        if (Math.random() > (this.lastMate / this.mateTimerMax)) {
            //in other words, the hungrier this is, the more likely it is to pick pred mode
            this.mode = 'mate';
        } else if (Math.random() > this.hunger/100) {
            this.mode = 'pred';
        }
    }
};
var die = function(n) {
    //kill org. Remove from list of orgs (objs), and element from DOM. Also, run thur other orgs, left-shift ones AFTER this org, and redo targs (so no one is targetting an invalid targ)
    //this function is run for EVERY organism with hp <= 0 at every tick
};
var getMenu = function(s) {
    //get what this org eats
    var specArr = fl[s];
    return specArr;
};
var birth = function(f, m) {
    //make a new org from Father and Mother

    orgs.push(new orgConst(f.x, f.y, f.z, f.spec, f.type, Math.floor(Math.random() * 2) + 1));
};
//get dist btwn two orgs
var getDist = function(o, t) {
    var a = Math.abs(o.pos.x - t.pos.x);
    var b = Math.abs(o.pos.y - t.pos.y);
    var c = Math.abs(o.pos.z - t.pos.z);
    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
};

//TESTING STUFF-------------
var testP = new orgConst(2, 3, 4, 'monkey', 'omni', 1);
var testH = new orgConst(3, 2, 4, 'mouse', 'omni', 1);
testP.targ = 1;
orgs.push(testP, testH);
console.log(testP, testH);
//END TESTING STUFF---------

var step = function (){
    //MAIN STEPPER FUNCTION. AAAAAAAAAAAH;
    for (var i=0;i<orgs.length;i++){
        //death
        if(org[i].hp<1){
            die(i);
            continue;
        }
        //mode and target
        if(org[i].mode=='none' && !org[i].coolDown && !org[i].matureTime){
            org[i].pickMode();
            org[i].pickNewTarg();
        }else if (org[i].coolDown>0 || org[i].matureTime>0){
            if(org[i].coolDown && org[i].coolDown>0){
                org[i].coolDown--;
            }
            if(org[i].matureTime && org[i].matureTime>0){
                org[i].matureTime--;
            }
        }
        //hunger and lastMate
        if(org[i].hunger<100){
            org[i].hunger++;
        }else{
            //starvation!
            org[i].hp--;
        }
        if(org[i].lastMate<100){
            org[i].lastMate++;
        }
        //movement!
        if (getDist(org[i],org[org[i].targ])>org[i].vis){
            //too far to fight/pred/mate, so move
        }
    }
};

var mainTimer;//main timer. Srsly, I'm not mincing variable names here, folks.

var setupBox = function() {
    var v = 80;
    $('#b-left').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skySide.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateY(90deg) translateZ(-' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-right').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skySide.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateY(90deg) translateZ(' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-top').css({
        'width': w + 'px',
        'height': d + 'px',
        'background-image': 'url("./img/skyTop.jpg")',
        'background-size': '100% 100%',
        'transform': 'rotateX(90deg) translateZ(' + (d / 2) + 'px) translateY(-' + (d / 2) + 'px)'
    });
    $('#b-back').css({
        'width': w + 'px',
        'height': h + 'px',
        'background-image': 'url("./img/skySide.jpg")',
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
setupBox();