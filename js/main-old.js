//this is the old version, without 'species'. It's basically just a flocking sim.
//not that flocking interesting
var maxDist = 65,
    minDist = 15,
    numPars,
    w = $(window).width() - 10,
    h = $(window).height() - 10,
    d = w,
    parts = [],
    upd,
    m = {
        x: 0,
        y: 0
    },
    isMoving = false,
    cylRes = 30;
var partConst = function(x, y, z, num, hue, unhappy = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = 2 * (Math.floor(Math.random() * 2) - .5);
    this.dy = 2 * (Math.floor(Math.random() * 2) - .5);
    this.dz = 2 * (Math.floor(Math.random() * 2) - .5);
    this.num = num;
    this.hue = hue;
    this.unhappy = unhappy;
    this.intTime = 0;
    this.lastInt = null;
    this.newBornTimer = 30; //
}
var getDist = function(o, t) {
    var a = Math.abs(o.x - t.x);
    var b = Math.abs(o.y - t.y);
    var c = Math.abs(o.z - t.z);
    return Math.floor(Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)));
}
var avg = (minDist + maxDist) / 2;

function createField() {
    numPars = parseInt(prompt('How many particles? Recommend around 30-60!')); //number of particles
    //create all the players.
    for (var i = 0; i < numPars; i++) {
        var x = Math.floor(Math.random() * w) + 5;
        var y = Math.floor(Math.random() * h) + 5;
        var z = Math.floor(Math.random() * d) + 5;
        parts.push(new partConst(x, y, z, i, 120))
        var el = document.createElement('div');
        el.className = 'particle';
        el.id = 'p' + i;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.transform = 'translateZ(-' + z + 'px)'
        el.style.backgroundColor = 'hsl(120,100%,50%)';
        $('#field').append(el);
        var sEl = document.createElement('div');
        sEl.className = 'sparticle';
        sEl.id = 'sp' + i;
        sEl.style.left = x + 'px';
        sEl.style.top = z + 'px';
        $('#b-bottom').append(sEl);
    }
    upd = setInterval(function() {
        var loopLen = parts.length;
        for (var n = 0; n < loopLen; n++) {
            var dist = w > h ? w : h;
            for (var q = 0; q < parts.length; q++) {
                if (getDist(parts[n], parts[q]) < dist && n != q) {
                    dist = getDist(parts[n], parts[q]);
                    parts[n].num = q;
                }
            }
            var hyoo;
            if (dist < minDist || dist > maxDist) {
                hyoo = 0;
            } else {
                //h somewhere btwn green and red, so need to calc;
                var dif = 1 - (Math.abs(avg - dist) / (avg / 2));
                hyoo = Math.floor(120 * dif);
            }

            if (parts[n].unhappy < 1 && (dist < minDist || dist > maxDist)) {
                //set this particle to 'unhappy' (i.e., change dir)
                parts[n].unhappy = 5;
                parts[n].dx = (Math.floor(Math.random() * 21) / 10) - 1;
                parts[n].dy = (Math.floor(Math.random() * 21) / 10) - 1;
                parts[n].dz = (Math.floor(Math.random() * 21) / 10) - 1;
            }
            if (parts[n].unhappy < 1 && getDist(parts[n], m) < minDist * 6 && isMoving) {
                parts[n].unhappy = 30;
                var difX = parts[n].x - m.x,
                    difY = parts[n].y - m.y;
                //notice we do NOT include a dif thing for mouse, since mouse cannot move in z direction!

                if (Math.abs(difX) > Math.abs(difY)) {
                    if (difX > 0) {
                        parts[n].dx = 1;
                    } else {
                        parts[n].dx = -1;
                    }
                } else {
                    if (difY > 0) {
                        parts[n].dy = 1;
                    } else {
                        parts[n].dy = -1;
                    }
                }
            }
            parts[n].hue = parts[n].unhappy > 6 ? 240 : hyoo;
            //borders!
            //x
            if ((parts[n].x + parts[n].dx) > w - 1 || (parts[n].x + parts[n].dx) < 0) {
                parts[n].dx = -1 * parts[n].dx;
            }

            //y
            if ((parts[n].y + parts[n].dy) > h - 1 || (parts[n].y + parts[n].dy) < 0) {
                parts[n].dy = -1 * parts[n].dy;
            }

            //z
            if ((parts[n].z + parts[n].dz) > d - 1 || (parts[n].z + parts[n].dz) < 0) {
                parts[n].dz = -1 * parts[n].dz;
            }
            var death = false;
            var canDie = true;
            //equal chance to create a new particle ('mate') or kill off target ('die')
            if (!parts[n].newBornTimer && parts[n].intTime < 1 && parts[parts[n].num].intTime < 1 && (getDist(parts[n], parts[parts[n].num]) < minDist / 2) && Math.random() > .99) {
                console.log('Birth!')
                loopLen++;
                canDie = false;
                //the 'baby' is created btwn the old parents
                var x = (parts[n].x + parts[parts[n].num].x) / 2;
                var y = (parts[n].y + parts[parts[n].num].y) / 2;
                var z = (parts[n].z + parts[parts[n].num].z) / 2;
                parts.push(new partConst(x, y, z, i, 120, 30))
                var el = document.createElement('div');
                el.className = 'particle';
                el.id = 'p' + (parts.length - 1);
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.transform = 'translateZ(-' + z + 'px)'
                el.style.backgroundColor = 'hsl(120,100%,50%)';
                $('#field').append(el);
                var sEl = document.createElement('div');
                sEl.className = 'sparticle';
                sEl.id = 'sp' + (parts.length - 1);
                sEl.style.left = x + 'px';
                sEl.style.top = z + 'px';
                $('#b-bottom').append(sEl);
                parts[n].intTime = 50;
                parts[parts[n].num].intTime = 50;
                parts[n].lastInt = 'mate';
                parts[parts[n].num].lastInt = 'mate';
            } else if (!parts[n].newBornTimer && canDie && parts[n].intTime < 1 && parts[parts[n].num].intTime < 1 && (getDist(parts[n], parts[parts[n].num]) < minDist / 2) && Math.random() > .99) {
                console.log('Death!')
                parts[n].intTime = 50;
                parts[n].lastInt = 'death';
                death = true;
            }
            if (parts[n].intTime > 0) {
                parts[n].intTime--;
            }
            if (parts[n].newBornTimer) {
                parts[n].newBornTimer--;
            }
            //move!
            parts[n].x += parts[n].dx;
            parts[n].y += parts[n].dy;
            parts[n].z += parts[n].dz;
            try {
                document.querySelector('#p' + n).style.left = parts[n].x + 'px';
            } catch (e) {
                clearInterval(upd);
                console.log('thought it was', n)
                console.log('data', $('#field'))
                console.log('error:', e)
            }
            document.querySelector('#p' + n).style.top = parts[n].y + 'px';
            document.querySelector('#p' + n).style.transform = 'translateZ(-' + parts[n].y + 'px)';
            document.querySelector('#p' + n).style.backgroundColor = 'hsl(' + parts[n].hue + ',100%,50%)';

            document.querySelector('#sp' + n).style.left = parts[n].x + 'px';
            document.querySelector('#sp' + n).style.top = parts[n].z + 'px';
            var gloAmt = 2 + (5 * parts[n].intTime / 50);
            var gloBase = 5;
            if (parts[n].intTime == 50 && parts[n].lastInt == 'death') {
                document.querySelector('#p' + n).style.borderRadius = '0%';
                document.querySelector('#sp' + n).style.borderRadius = '0%';
                document.querySelector('#p' + n).innerHTML = '\uD83D\uDC80';
                gloBase = 0;
            } else if (parts[n].intTime > 1 && parts[n].lastInt == 'death') {
                document.querySelector('#p' + n).style.borderRadius = (50 - parts[n].intTime) + '%';
                document.querySelector('#sp' + n).style.borderRadius = (50 - parts[n].intTime) + '%';
                document.querySelector('#p' + n).innerHTML = '\uD83D\uDC80';
                gloBase = (1 - (parts[n].intTime / 50)) * 5;
            } else if (parts[n].intTime > 1 && parts[n].lastInt == 'mate') {
                document.querySelector('#p' + n).innerHTML = '\u2661';
            } else if(parts[n].newBornTimer){
                document.querySelector('#p' + n).innerHTML = '\uD83D\uDEBC';
            }else {
                document.querySelector('#p' + n).innerHTML = ' ';
                document.querySelector('#p' + n).style.borderRadius = '50%';
                document.querySelector('#sp' + n).style.borderRadius = '50%';
            }
            document.querySelector('#p' + n).style.boxShadow = '0 0 ' + gloBase + 'px ' + gloAmt + 'px hsl(' + parts[n].hue + ',100%,50%)';
            document.querySelector('#sp' + n).style.boxShadow = '0 0 ' + gloBase + 'px ' + gloAmt + 'px #000';
            if (parts[n].unhappy && parts[n].unhappy > 0) {
                parts[n].unhappy--;
            }
            if (death) {
                var numToRemove = parts[n].num;
                parts.splice(numToRemove, 1); //remove from objects
                $('#p' + numToRemove).remove();
                $('#sp' + numToRemove).remove();
                var toRename = $('.particle');
                var toRenameS = $('.sparticle'); //THIS. IS. SPARTICLE
                for (var r = 0; r < toRename.length; r++) {
                    toRename[r].id = 'p' + r;
                    // console.log('SUCCCESSFULLY RENAMED ', $(toRename[r]), 'TO p' + r, 'WHILE DELETING', $('#p' + numToRemove))
                }
                for (var s = 0; s < toRenameS.length; s++) {
                    toRenameS[s].id = 'sp' + s;
                }
                for (var t = 0; t < toRename.length; t++) {
                    if (parts[t].num == numToRemove) {
                        parts[t].num = 0;
                    }
                }
                loopLen--;
            }
        }
    }, 50);
}
document.querySelector('#field').onmousemove = function(e) {
    m.x = e.x || e.clientX;
    m.y = e.y || e.clientY;
    document.querySelector('#mouseTarg').style.left = (m.x - 10) + 'px';
    document.querySelector('#mouseTarg').style.top = (m.y - 10) + 'px';
    document.querySelector('#cyl').style.left = (m.x - 10) + 'px';
    document.querySelector('#cyl').style.top = (m.y - 35) + 'px';
    document.querySelector('#cylShad').style.left = (m.x - 35) + 'px';
    //adjust cyl shadow
    var shadBlurAmt = (h - m.y) / h;
    document.querySelector('#cylShad').style.boxShadow = '0 0 ' + ((shadBlurAmt * 15) + 5) + 'px ' + ((shadBlurAmt * 15) + 5) + 'px #000';
    document.querySelector('#cylShad').style.opacity = 1 - ((shadBlurAmt * .4) + .4);
    isMoving = true;
}
window.onkeyup = function(e) {
    if (e.which == 83) {
        clearInterval(upd);
    }
}
var setupBox = function() {
    var v = 80;
    $('#b-left').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'linear-gradient(hsla(0,0%,' + (Math.floor(Math.random() * 50) + 40) + '%,.5),hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5)), url("./img/wood.jpg")',
        'transform': 'rotateY(90deg) translateZ(-' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-right').css({
        'width': d + 'px',
        'height': h + 'px',
        'background-image': 'linear-gradient(hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5),hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5)), url("./img/wood.jpg")',
        'transform': 'rotateY(90deg) translateZ(' + (d / 2) + 'px) translateX(' + (d / 2) + 'px)'
    });
    $('#b-top').css({
        'width': w + 'px',
        'height': d + 'px',
        'background-image': 'linear-gradient(hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5),hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5)), url("./img/wood.jpg")',
        'transform': 'rotateX(90deg) translateZ(' + (d / 2) + 'px) translateY(-' + (d / 2) + 'px)'
    });
    $('#b-back').css({
        'width': w + 'px',
        'height': h + 'px',
        'background-image': 'linear-gradient(hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5),hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5)), url("./img/wood.jpg")',
        'transform': 'translateZ(-' + (d) + 'px)',
        'transform-style': 'preserve-3d'
    });
    $('#b-bottom').css({
        'width': w + 'px',
        'height': d + 'px',
        'background-image': 'linear-gradient(hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5),hsla(0,0%,' + (Math.floor(Math.random() * 50) + 25) + '%,.5)), url("./img/wood.jpg")',
        'transform': 'rotateX(90deg) translateZ(' + (30) + 'px) translateY(-' + (d / 2) + 'px)',
        'overflow': 'hidden'
    });
    //now, the targetting cylinder
    var cylRot = 360 / cylRes;
    for (var i = 0; i < cylRes; i++) {
        var newCylSeg = document.createElement('div');
        newCylSeg.className = 'mouseCylSeg';
        newCylSeg.style.width = .4 + ((cylRot / 360) * 2 * Math.PI * 25) + 'px';
        newCylSeg.style.transform = 'rotateX(90deg) rotateY(' + (cylRot * i) + 'deg) translateZ(25px) translateY(0px)';
        newCylSeg.style.top = '0px';
        newCylSeg.style.left = '0px';
        newCylSeg.style.height = 100 + 'px';
        var obrite = (Math.sin((i + (cylRes / 4)) / 5) * 15) + 50,
            nbrite = (Math.sin((i + 1 + (cylRes / 4)) / 5) * 15) + 50;
        console.log(obrite, nbrite)
        newCylSeg.style.background = 'linear-gradient(hsl(0,0%,' + obrite + '%),hsl(0,0%,' + nbrite + '%))';
        $('#cyl').append(newCylSeg);
    }
    $('#cyl').css('transform', 'scale3d(1,1,' + d / 40 + ')')
};
setupBox();
createField();
