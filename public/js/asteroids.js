shipPosX = window.innerWidth / 2 - 100;
shipPosY = window.innerHeight / 2 - 200;
shipLength = 15;
shipWidth = 60;
shipSpeedY = 0;
shipSpeedX = 0;
shipUpCheck = true;
shipDownCheck = true;
shipThrust = false;
missileGroup = [];
asteroidGroup = [];
var canvas;
var bod = document.getElementById('aBod');
var myShip;

// turn angle into vector
function angleToVector(ang) {
    return [Math.cos(ang), Math.sin(ang)]
}

// get distance between two arrays
function dist(p, q) {
    return Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2)
}

function Ship(pos, vel, angle) {
    this.pos = [pos[0], pos[1]];
    this.vel = [vel[0], vel[1]];
    this.angle = angle;
    this.rotate = 0;
    this.angle_vel = 0;
    this.acc = 0.1;
    this.thrust = false;
    this.radius = 15;
    this.path = [
        [50, 0],
        [-25, 25],
        [-25, -25],
        [50, 0],
    ];

    this.draw = function(ctx) {
        var deg = this.angle * 180 / Math.PI
        // shipImg.style.top = this.pos[1] + "px";
        // shipImg.style.left = this.pos[0] + "px";
        // shipImg.style.webkitTransform = `rotate(${270 - deg}deg)`;
        ctx.setTransform(Math.cos(this.angle), Math.sin(this.angle),
                         -Math.sin(this.angle), Math.cos(this.angle),
                         this.pos[0], this.pos[1]);
        ctx.beginPath();
        ctx.lineWidth=5;
        ctx.moveTo(this.path[0][0], this.path[0][1]);
        for (i=1; i<this.path.length; i++) {
            ctx.lineTo(this.path[i][0], this.path[i][1]);
        }
        ctx.strokeStyle = '#ABFFFA';
        ctx.stroke();
        ctx.closePath();
    }

    this.checkBounds = function() {
        if (this.pos[0] < 0) {
            this.pos[0] = window.innerWidth - 5;
        }
        this.pos[0] %= window.innerWidth; 
        if (this.pos[1] < 0) {
            this.pos[1] = window.innerHeight - 5;
        }
        this.pos[1] %= window.innerHeight;
    }

    this.update = function() {
        this.vel[0] *= (1 - 0.5*this.acc);
        this.vel[1] *= (1 - 0.5*this.acc);
        this.vector = angleToVector(this.angle);
        if (this.thrust) {
            this.vel[0] += this.vector[0]*7*this.acc;
            this.vel[1] += this.vector[1]*7*this.acc;
        }
        this.angle += this.angle_vel;
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.checkBounds();
    }

    this.getRadius = function() {
        return this.radius;
    }

    this.getPosition = function() {
        return this.pos;
    }

    this.shoot = function() {
        var m_pos = [this.pos[0] + 45*this.vector[0], this.pos[1] + 45*this.vector[1]]
        var m_vel = [this.vel[0] + 10*this.vector[0], this.vel[1] + 10*this.vector[1]]
        missileGroup.push(new Sprite(m_pos, m_vel, 0, 0, true));
    }
}

function Sprite(pos, vel, ang, ang_vel, bullet) {
    // console.log(pos);
    this.pos = [pos[0],pos[1]];
    this.vel = [vel[0],vel[1]];
    this.angle = ang;
    this.angle_vel = ang_vel;
    this.age = 0;
    this.lifespan = bullet ? 50 : Number.MAX_VALUE;
    this.check = false;
    scale = 3;
    this.radius = bullet ? 3 : 14 * scale;
    this.bullet = bullet;
    this.path = bullet ? [
            [0, 0],
            [-4, 0],
        ] : [
            [2*scale, 14],
            [10*scale, 10*scale],
            [14*scale, 2*scale],
            [10*scale, -6*scale],
            [14*scale, -14*scale],
            [6*scale, -18*scale],
            [-2*scale, -10*scale],
            [-8*scale, -4*scale],
            [-16*scale, -2*scale],
            [-18*scale, 6*scale],
            [-10*scale, 10*scale],
            [-2*scale, 6*scale],
            [2*scale, 14*scale]
        ];

    this.draw = function(ctx) {
        // console.log('it is drawing');
        ctx.setTransform(Math.cos(this.angle), Math.sin(this.angle),
                 -Math.sin(this.angle), Math.cos(this.angle),
                 this.pos[0], this.pos[1]);
        ctx.beginPath();
        ctx.lineWidth=10;
        ctx.moveTo(this.path[0][0], this.path[0][1]);
        for (i=1; i<this.path.length; i++) {
            ctx.lineTo(this.path[i][0], this.path[i][1]);
        }
        ctx.strokeStyle = this.bullet ? '#ABFFFA' : '#F4524F';
        ctx.stroke();
        ctx.fillStyle = this.bullet ? '#ABFFFA' : '#F4524F';
        ctx.fill();
        ctx.closePath();
    }

    this.checkBounds = function() {
        if (this.pos[0] < 0) {
            this.pos[0] = window.innerWidth - 5;
        }
        this.pos[0] %= window.innerWidth; 
        if (this.pos[1] < 0) {
            this.pos[1] = window.innerHeight - 5;
        }
        this.pos[1] %= window.innerHeight;
    }

    this.update = function() {
        this.angle += this.angle_vel
        this.pos[0] += this.vel[0]
        this.pos[1] += this.vel[1]
        this.checkBounds();
        this.age += 1
        if (this.age < this.lifespan) {
            return false
        }
        return true
    }

    this.getPosition = function() {
        return this.pos;
    }

    this.getRadius = function() {
        return this.radius;
    }

    this.collide = function(other) {
        objectCenterDistance = dist(this.pos, other.getPosition())
        objectRadiusDistance = this.radius + other.getRadius()
        if (objectCenterDistance <= objectRadiusDistance) {
            return true
        } else {
            return false
        }
    }
}

function drawList(lst, ctx) {
    if (!lst.length) return;
    for (var i = lst.length - 1; i >= 0; i--) {
        if (lst[i].update()) {
            lst.splice(i, 1);
        } else {
            lst[i].draw(ctx);
        }
    }
}

function groupCollide(collidingGroup, material) {
    for (var i = 0; i < collidingGroup.length; i++) {
        var aObject = collidingGroup[i];
        if (aObject.collide(material)) {
            aObject.lifespan = Number.MIN_VALUE;
            return true
        }
    }
    return false
}

function group2GroupCollide(groupOne, groupTwo) {
    number = 0;
    for (var i = 0; i < groupOne.length; i++) {
        anObject = groupOne[i];
        if (groupCollide(groupTwo, anObject)) {
            anObject.lifespan = Number.MIN_VALUE;
            number += 1;
        }
    }
    return number;
}

function generateNewAst(num) {
    for (var i = 0; i < num; i++) {
        asteroidGroup.push(new Sprite([Math.floor(Math.random() * canvas.width),
                                Math.floor(Math.random() * canvas.height)], 
                                [Math.random(),Math.random()],
                                0, 0, false));
    }
}

function asteroidsInit() {
    canvas = document.getElementById('asteroid-canvas')
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 200;
    var ctx = canvas.getContext('2d');
    myShip = new Ship([shipPosX, shipPosY], [0, 0], 0);
    startGame(ctx);
}

var startGame = function(ctx) {
    document.addEventListener('keydown', (e) => {shipDown(e, myShip)});
    document.addEventListener('keyup', (e) => {shipUp(e, myShip)});
    var count = 0;
    asteroidList = window.setInterval(function asteroidShow() {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var addAsts = group2GroupCollide(missileGroup, asteroidGroup);
        drawList(missileGroup, ctx);
        drawList(asteroidGroup, ctx);
        myShip.draw(ctx);
        myShip.update();
        ctx.restore();
        generateNewAst(addAsts);
        if (count % 500 === 0) {
            generateNewAst(1);
        }
        count += 1;
    }, 1000/60);
}

// var shipUp = function(e) {
//     var acc = 10;
//     if (e.keyCode == 38 || e.which == 38) {
//         shipSpeedY += acc;
//         shipUpCheck = true;
//     }
//     if (e.keyCode == 40 || e.which == 40) {
//         shipSpeedY -= acc;
//         shipDownCheck = true;
//     }
// }

var shipDown = function(e, ship) {
    if (true) {
        if (e.keyCode == 38 || e.which == 38) {
            // shipSpeedY -= acc;
            ship.thrust = true;
            shipUpCheck = false;
        }
    }
    if (e.keyCode == 37 || e.which == 37) {
        // shipSpeedY -= acc;
        ship.angle_vel = -ship.acc;
    }
    if (e.keyCode == 39 || e.which == 39) {
        // shipSpeedY -= acc;
        ship.angle_vel = ship.acc;
    }
    if (e.keyCode == 32 || e.which == 32) {
        // shipSpeedY -= acc;
        ship.shoot();
    }
}

var shipUp = function(e, ship) {
    if (true) {
        if (e.keyCode == 38 || e.which == 38) {
            // shipSpeedY -= acc;
            ship.thrust = false;
            shipUpCheck = false;
        }
    }
    if (e.keyCode == 37 || e.which == 37) {
        // shipSpeedY -= acc;
        ship.angle_vel = 0;
    }
    if (e.keyCode == 39 || e.which == 39) {
        // shipSpeedY -= acc;
        ship.angle_vel = 0;
    }
}

var asteroidsStop = function() {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas = null;
}
