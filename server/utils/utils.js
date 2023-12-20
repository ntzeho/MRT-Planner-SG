function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function objectsEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  if (!arraysEqual(a.codes, b.codes)) return false;
  if (!arraysEqual(a.names, b.names)) return false;

  return true;
}

function objectInArray(obj, arr) {
  for (const objList of arr) {
    if (objectsEqual(obj, objList)) return true
  }
  return false
}

module.exports = {
    arraysEqual,
    objectInArray
}