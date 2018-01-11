var height = window.innerHeight;
var paddle_height = 150;
var half_paddle_height = paddle_height / 2;
var speed1 = 0;
var pos1 = 460;
var up_check1 = true;
var down_check1 = true;
var speed2 = 0;
var pos2 = 460;
var up_check2 = true;
var down_check2 = true;
var pos3 = 0; // y pos
var pos4 = 0; // x pos
var speed3 = 0; // y speed 
var speed4 = 0; // x speed
var score1 = 0;
var score2 = 0;
function pongBall() {
	console.log("PONGBALL");
	pos3 = window.innerHeight*.48;
	pos4 = window.innerWidth*0.45;
	if (Math.random() < 0.5) {
		var side = 1
	} else {
		var side = -1
	}
	speed3 = Math.random() * -2 - 3;
	speed4 = side * (Math.random() * 2 + 3);
};
var pongList;
function pongStart() {
	pongList = window.setInterval(function pongShow() {
		console.log("PONGSHOW");
		pos1 += speed1;
		pos2 += speed2;
		pos3 += speed3;
		pos4 += speed4;
		if (pos1 <= 150) {
			pos1 = 150;
		};
		if (pos1 >= height - paddle_height) {
			pos1 = height - paddle_height;
		};
		if (pos2 <= 150) {
			pos2 = 150;
		};
		if (pos2 >= height - paddle_height) {
			pos2 = height - paddle_height;
		};
		if (pos3 <= 150 || pos3 >= window.innerHeight - 25 /* ball radius*/) {
			speed3 = -speed3
		}
		if (pos4 <= 10) {
			if (pos3 > pos1 && pos3 < pos1 + paddle_height) {
				speed4 = -speed4;
			} else {
				score2 += 1;
				pongBall();
			}
		}
		if (pos4 >= window.innerWidth - 25 - 10 /* ball radius + paddle width */) {
			if (pos3 > pos2 && pos3 < pos2 + paddle_height) {
				speed4 = -speed4
			} else {
				score1 += 1;
				pongBall();
			}
		}

		document.getElementById("pong-1").style.top = (pos1) + "px";
		document.getElementById("pong-2").style.top = (pos2) + "px";
		document.getElementById('pong-3').style.top = (pos3) + 'px';
		document.getElementById('pong-3').style.left = (pos4) + 'px';
		document.getElementById('pong-score1').innerHTML = score1.toString();
		document.getElementById('pong-score2').innerHTML = score2.toString();
		}, 1000/60);

	document.addEventListener('keydown', pongDown, false);

	document.addEventListener('keyup', pongUp, false);
}
function pongStop() {
	document.removeEventListener('keyup', pongUp);
	document.removeEventListener('keydown', pongDown);
	pos3 = window.innerHeight*.48;
	pos4 = window.innerWidth*0.45;
	// clearInterval(pongList); for some reason not working.
}

function pongUp(e) {
	var acc = 10;
	if (e.keyCode == 87 || e.which == 87) {
		speed1 += acc;
		up_check1 = true;
	}
	if (e.keyCode == 83 || e.which == 83) {
		speed1 -= acc;
		down_check1 = true;
	}
	if (e.keyCode == 38 || e.which == 38) {
		speed2 += acc;
		up_check2 = true;
	}
	if (e.keyCode == 40 || e.which == 40) {
		speed2 -= acc;
		down_check2 = true;
	}
}

function pongDown(e) {
	console.log('pongdown called');
	var acc = 10;
	if (up_check1) {
		if (e.keyCode == 87 || e.which == 87) {
			speed1 -= acc;
			up_check1 = false;
		}
	}
	if (down_check1) {
		if (e.keyCode == 83 || e.which == 83) {
			speed1 += acc;
			down_check1 = false;
		}
	}
	if (up_check2) {
		if (e.keyCode == 38 || e.which == 38) {
			speed2 -= acc;
			up_check2 = false;
		}
	}
	if (down_check2) {
		if (e.keyCode == 40 || e.which == 40) {
			speed2 += acc;
			down_check2 = false;
		}
	}
}