import { addVec, distance, multiplyVec, subVec } from "./vector";

const k = 500;

export function calcF1(q1, Q) {
  var u1 = subVec(Q.coord, q1.coord);
  var u1d = distance(u1);
  return multiplyVec((k * Q.charge * q1.charge) / (u1d * u1d * u1d), u1);
}

export function calcF2(q2, Q) {
  var u2 = subVec(Q.coord, q2.coord);
  var u2d = distance(u2);
  return multiplyVec((k * Q.charge * q2.charge) / (u2d * u2d * u2d), u2);
}

export function calcForce(q1, q2, Q) {
  var F1 = calcF1(q1, Q);
  var F2 = calcF2(q2, Q);
  return addVec(F1, F2);
}

export function startPos(posVec, forceVec) {
  var half_F = multiplyVec(0.5, forceVec);
  return subVec(posVec, half_F);
}

export function endPos(posVec, forceVec) {
  var half_F = multiplyVec(0.5, forceVec);
  return addVec(posVec, half_F);
}
