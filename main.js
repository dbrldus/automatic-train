import { calcF1, calcF2, calcForce, endPos, startPos } from "./useful";
import { addVec, distance } from "./vector";

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

const H = canvas.height;
const W = canvas.width;
const PI = Math.PI;

var c1Info = {
  charge: 3,
  coord: {
    x: 10,
    y: 0,
  },
};

var c2Info = {
  charge: 3,
  coord: {
    x: -10,
    y: 0,
  },
};

var mouse = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX - W / 2) / 10;
  mouse.y = (H / 2 - event.clientY) / 10;
  console.log(mouse);
});

function Axis() {
  this.draw = () => {
    ctx.beginPath();
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "grey";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "grey";
    ctx.stroke();
  };
}

function Charge(eCharge, x, y) {
  this.eCharge = eCharge;
  this.x = x;
  this.y = y;

  this.draw = () => {
    ctx.beginPath();
    ctx.arc(this.x * 10 + W / 2, H / 2 - this.y * 10, 10, 0, 2 * PI);
    ctx.fill();
  };
}

function MouseCharge(eCharge, x, y) {
  this.eCharge = eCharge;
  this.x = x;
  this.y = y;

  this.draw = () => {
    ctx.beginPath();
    ctx.arc(this.x * 10 + W / 2, H / 2 - this.y * 10, 10, 0, 2 * PI);
    ctx.fill();
  };

  this.move = () => {
    this.x = mouse.x;
    this.y = mouse.y;
    this.draw();
  };
}

function Arrow(startVec, endVec, color) {
  //variables to be used when creating the arrow
  this.headlen = 10;
  this.startVec = { x: startVec.x * 10 + W / 2, y: H / 2 - startVec.y * 10 };
  this.endVec = { x: endVec.x * 10 + W / 2, y: H / 2 - endVec.y * 10 };
  this.angle = Math.atan2(
    this.endVec.y - this.startVec.y,
    this.endVec.x - this.startVec.x
  );
  this.color = color;

  this.draw = () => {
    ctx.save();
    ctx.strokeStyle = this.color;

    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(this.startVec.x, this.startVec.y);
    ctx.lineTo(this.endVec.x, this.endVec.y);
    ctx.lineWidth = 4;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(this.endVec.x, this.endVec.y);
    ctx.lineTo(
      this.endVec.x - this.headlen * Math.cos(this.angle - Math.PI / 7),
      this.endVec.y - this.headlen * Math.sin(this.angle - Math.PI / 7)
    );

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(
      this.endVec.x - this.headlen * Math.cos(this.angle + Math.PI / 7),
      this.endVec.y - this.headlen * Math.sin(this.angle + Math.PI / 7)
    );

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(this.endVec.x, this.endVec.y);
    ctx.lineTo(
      this.endVec.x - this.headlen * Math.cos(this.angle - Math.PI / 7),
      this.endVec.y - this.headlen * Math.sin(this.angle - Math.PI / 7)
    );

    //draws the paths created above
    ctx.stroke();
    ctx.restore();
  };
}

var axis = new Axis();
var charge1 = new Charge(c1Info.charge, c1Info.coord.x, c1Info.coord.y);
var charge2 = new Charge(c2Info.charge, c2Info.coord.x, c2Info.coord.y);
var mouseCharge = new MouseCharge(1, mouse.x, mouse.y);

var forceArray = [];
function init() {
  axis = new Axis();
  charge1 = new Charge(c1Info.charge, c1Info.coord.x, c1Info.coord.y);
  charge2 = new Charge(c2Info.charge, c2Info.coord.x, c2Info.coord.y);
  mouseCharge = new MouseCharge(1, mouse.x, mouse.y);

  forceArray = [];
  for (var i = -10; i <= 10; i++) {
    for (var j = -5; j <= 5; j++) {
      var qInfo = {
        charge: 1,
        coord: {
          x: 6 * i,
          y: 6 * j,
        },
      };

      var forceVec = calcForce(c1Info, c2Info, qInfo);
      if (distance(forceVec) < 20) {
        var startVec = startPos(qInfo.coord, forceVec);
        var endVec = endPos(qInfo.coord, forceVec);

        forceArray.push(new Arrow(startVec, endVec, "black"));
      }
    }
  }
}
function drawField() {
  axis.draw();
  charge1.draw();
  charge2.draw();

  forceArray.forEach((arrow) => {
    arrow.draw();
  });
}

function drawInteraction() {
  var mChargeInfo = {
    charge: 1,
    coord: {
      x: mouse.x,
      y: mouse.y,
    },
  };
  var f1Vec = calcF1(c1Info, mChargeInfo);
  var f2Vec = calcF2(c2Info, mChargeInfo);
  var forceVec = calcForce(c1Info, c2Info, mChargeInfo);
  var f1Arrow = new Arrow(mouse, addVec(mouse, f1Vec), "red");
  var f2Arrow = new Arrow(mouse, addVec(mouse, f2Vec), "red");
  var forceArrow = new Arrow(mouse, addVec(mouse, forceVec), "red");

  mouseCharge.move();
  f1Arrow.draw();
  f2Arrow.draw();
  forceArrow.draw();
}

function Animate() {
  ctx.clearRect(0, 0, W, H);
  drawField();
  drawInteraction();
  requestAnimationFrame(Animate);
}

init();
Animate();

//Modify HTML Part----------------------------//
var c1X = document.getElementById("c1X");
c1X.addEventListener("change", (event) => {
  c1Info = {
    charge: 5,
    coord: {
      x: event.target.value,
      y: c1Y.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});

var c1Y = document.getElementById("c1Y");
c1Y.addEventListener("change", (event) => {
  c1Info = {
    charge: 5,
    coord: {
      x: c1X.value,
      y: event.target.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});

var c1charge = document.getElementById("c1charge");
c1charge.addEventListener("change", (event) => {
  c1Info = {
    charge: event.target.value,
    coord: {
      x: c1X.value,
      y: c1Y.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});

var c2X = document.getElementById("c2X");
c2X.addEventListener("change", (event) => {
  c2Info = {
    charge: 5,
    coord: {
      x: event.target.value,
      y: c2Y.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});

var c2Y = document.getElementById("c2Y");
c2Y.addEventListener("change", (event) => {
  c2Info = {
    charge: 5,
    coord: {
      x: c2X.value,
      y: event.target.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});

var c2charge = document.getElementById("c2charge");
c2charge.addEventListener("change", (event) => {
  c2Info = {
    charge: event.target.value,
    coord: {
      x: c2X.value,
      y: c2Y.value,
    },
  };
  ctx.clearRect(0, 0, W, H);

  init();
  Animate();
});
