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

function stringInArrayInArray(bigArr, text) {
  //returns index of arr in bigArr
  for (let i = 0; i < bigArr.length; i++) {
    if (bigArr[i].includes(text)) return [true, i]
  }
  return [false]
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
  } else if (time.includes('pm')) {
    const time_24h = time.replace('pm' ,'')
    const [hours, minutes] = time_24h.split('.')
    if (hours == '12') { //12pm
      return time_24h.replace('.', ':')
    }
    return (parseInt(hours) + 12).toString() + ':' + minutes
  }
  return time
}

function formatMinuteHour(minuteHour) {
  if (minuteHour < 10) return '0' + minuteHour.toString()
  return minuteHour.toString()
}

function convertTimeToMinutes(time) {
  //convert 24h time format into total minutes
  //any time between 00:00 and 04:00 is counted as 24+ * 60 mins
  const [hourString, minuteString] = time.split(':')
  const [hour, minute] = [parseInt(hourString), parseInt(minuteString)]
  if (hour > 4) return hour * 60 + minute
  return (hour + 24) * 60 + minute
}

function convertMinutesToTime(givenMinutes) {
  //convert minutes into 24h time format
  //any time between 00:00 and 04:00 is counted as 24+ * 60 mins
  const hour = Math.floor(givenMinutes / 60)
  const minutes = givenMinutes % 60
  if (hour < 24) return formatMinuteHour(hour) + ':' + formatMinuteHour(minutes)
  return formatMinuteHour(hour - 24) + ':' + formatMinuteHour(minutes)
}

function editTime(time, minutes) {
  //add minutes input to time, negative minutes means an earlier time
  if (minutes === 0) return time
  return convertMinutesToTime(convertTimeToMinutes(time) + minutes)
}

function differenceTime(time1, time2) {
  //return difference in minutes between time1 and time2, aka time1 - time2
  if (time1 === time2) return 0
  return convertTimeToMinutes(time1) - convertTimeToMinutes(time2)
}

module.exports = {
    arraysEqual,
    objectInArray,
    arrayStringsInText,
    textInStringsArray,
    stringInArrayInArray,
    convertTo24hTime,
    editTime,
    differenceTime
}