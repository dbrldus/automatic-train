//vec는 {x : number, y : number}형식 데이터
export function addVec(vec1, vec2) {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

export function subVec(vec1, vec2) {
  return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

export function multiplyVec(k, vec) {
  return { x: k * vec.x, y: k * vec.y };
}

export function distance(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}
