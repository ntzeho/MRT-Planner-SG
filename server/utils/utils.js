const { text } = require("express");

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

function arrayStringsInText(arr, text) {
  for (const string of arr) {
    if (text.includes(string)) return true
  }
  return false
}

function textInStringsArray(arr, text) {
  for (const string of arr) {
    if (string.includes(text)) return string 
  }
  return NaN
}

function convertTo24hTime(time) {
  if (time.includes('am')) {
    let time_24h = time.replace('am', '').replace('.', ':')
    if (time_24h.slice(0,2) == '12') { //12am
      return '00' + time_24h.slice(2,)
    } else if (time_24h.slice(2,).includes(':')) { //10am or 11am
      return time_24h
    }
    return '0' + time_24h
  }
  const time_24h = time.replace('pm' ,'')
  const [hours, minutes] = time_24h.split('.')
  if (hours == '12') { //12pm
    return time_24h.replace('.', ':')
  }
  return (parseInt(hours) + 12).toString() + ':' + minutes
}

module.exports = {
    arraysEqual,
    objectInArray,
    arrayStringsInText,
    textInStringsArray,
    convertTo24hTime
}