const {timings, SBS_LINES, SENGKANG_PUNGGOL_LINES} = require('../constants/timings.js')
const {genericPublicHolidays, publicHolidays, dayDict} = require('../constants/publicHolidays.js')
const {stations_dict} = require("../constants/stations.js")
const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime, editTime, differenceTime} = require("./utils.js")

function getCategories(stationsDictKey, type = 'Last') {
    /*
    stationsDictKey - 'sbs_times', 'smrt_times'
    type - 'Firts', 'Last'
    */
    const stns = Object.keys(timings)
    let relevantTimings = []
    for (const stn of stns) {
        const timing = timings[stn][stationsDictKey]
        const timingKeys = Object.keys(timing)
        for (const timingKey of timingKeys) {
            const headers = timing[timingKey]
            const headerKeys = Object.keys(headers)
            for (const headerKey of headerKeys) {
                if (headerKey.includes(type) && !relevantTimings.includes(headerKey)) relevantTimings.push(headerKey)
            }
        }
    }
    return relevantTimings
}

const categoriesNEL = getCategories('sbs_times')
const categoriesSMRT = getCategories('smrt_times')

/*
[
  'Last Trains',
  'Last Trains | Weekdays',
  'Last Trains | Weekends/Public Holidays'
]
[
  'Last Train | Monday - Thursday',
  'Last Train | Friday',
  'Last Train | Saturday',
  'Last Train | Sunday',
  'Last Train | Public Holidays',
  'Last Train | Sundays'
]
*/

// console.log(categoriesNEL)
// console.log(categoriesSMRT)

function dayChecker(type) {
    /* 
    type - 'smrt_times' or 'sbs_times'
    returns array of all possible entries for timings
    */
    const categories = type === 'smrt_times' ? categoriesSMRT : categoriesNEL

    const now = new Date()
    //const now = new Date("July 27, 2024 11:13:00")
    //console.log(now)
    const yesterday = new Date(Date.now() - 86400000) //24 * 60 * 60 * 1000

    const hour = now.getHours()
    // go to day before if its past midnight
    const date = hour < 3 ? yesterday : now 

    //obtain today's day (1 to 7) based on time when checking for last train
    const dayOfWeek = date.getDay()
    //const dayOfWeek = 6

    const year = date.getFullYear()
    const month = date.getMonth() + 1 //returns 0 to 11 so add 1
    const day = date.getDate()
    
    const formatDay = day < 10 ? ('0' + day.toString()) : day.toString()
    const formatMonth = month < 10 ? ('0' + month.toString()) : month.toString()
    const formatDate = formatDay + '/' + formatMonth
    // const formatDate = '28/07'
    const formatDateYear = formatDate + '/' + year.toString()

    const isPubHol = (genericPublicHolidays.includes(formatDate) || publicHolidays.includes(formatDateYear))

    if (isPubHol) { //return key immediately if day is public holiday
        for (const key of categories) {
            if (key.includes('Public Holiday')) return [key]
        }
    }

    let relevantEntries = []

    for (const cat of categories) {
        if (!cat.includes('|')) {
            relevantEntries.push(cat) //only 1 timing regardless of day
        } else if (cat.includes('-')) { //has range of applicable days
            const [startDay, endDay] = cat.split(' | ')[1].split(' - ')
            const [startDayNo, endDayNo] = [dayDict[startDay], dayDict[endDay]]
            if (startDayNo <= dayOfWeek && dayOfWeek <= endDayNo) {
                relevantEntries.push(cat) //dayOfWeek must be in range
            }
        } else {
            const dayNo = dayDict[cat.split(' | ')[1].trim()]
            if (dayOfWeek === dayNo) relevantEntries.push(cat) //single day

            //'weekday' or 'weekend', multiple possible days
            else if (dayNo.length >= 2) if (dayNo.includes(dayOfWeek)) relevantEntries.push(cat)
        }
    }

    return relevantEntries
}

function directPathTimings(path) {
    let relevantTimings = []
    let lastTrainObjects = []

    const startStation = path.names[0]
    const startCode = path.codes[0]
    const startLine = startCode.slice(0,2)

    const endStation = path.names[path.names.length - 1]
    const endCode = path.codes[path.codes.length - 1]
    const endLine = endCode.slice(0,2)

    const START_MRT_TYPE = SBS_LINES.includes(startLine) ? 'sbs_times' : 'smrt_times'
    //const END_MRT_TYPE = SBS_LINES.includes(endLine) ? 'sbs_times' : 'smrt_times'

    const startTimings = timings[startStation][START_MRT_TYPE]
    const startTimingKeys = Object.keys(startTimings)
    // console.log(startTimings)
    for (const key of startTimingKeys) {
        if (key.includes(startLine)) {
            // console.log(key)
            //check if second station in path has lower or higher station no
            //add key to a list
        }
    }

    const startCodeNo = parseInt(startCode.slice(2,))
    const endCodeNo = parseInt(endCode.slice(2,))
    const ascending = startCodeNo < endCodeNo //check for direction of travel

    /*
    Sengkang punggol - just use last train timing at STC/PTC depending on loop

    BP -

    SMRT/SBS - split at ' | ' thing and get day/day range. If corroborate with current date get corresponding time. This time will be used
    */

    if (!startCodeNo || arrayStringsInText(SENGKANG_PUNGGOL_LINES, startCode)) {
        //Sengkang or Punggol LRT
        //special case, return stuff in here
        console.log('Sengkang Punggol LRT')
        console.log(startTimingKeys)
        return

    } else if (startCode.includes('BP')) { //BP LRT
        //special case, return stuff in here
        console.log('BP LRT')
        return

    } else if (START_MRT_TYPE === 'smrt_times') { //check for keys for smrt          
        /*
        WHAT COUNTS AS RELEVANT TIMINGS:
        - same line as stated in codes
        - if ascending, push if:
            - startCodeNo < timingCodeNo and endCodeNo <= timingCodeNo
        - if descending, push if:
            - startCodeNo > timingCodeNo and endCodeNo >= timingCodeNo
        */
        for (const key of startTimingKeys) {
            if (key.includes(startLine)) {
                let timingCodeNo = key.split(startLine)[1].slice(0,2).trim()
                if ((ascending && startCodeNo < timingCodeNo && endCodeNo <= timingCodeNo) || (!ascending && startCodeNo > timingCodeNo && endCodeNo >= timingCodeNo)) {
                    relevantTimings.push(key)
                }
            }
        }
    } else if (START_MRT_TYPE === 'sbs_times') { //check for keys for sbs
        for (const key of startTimingKeys) {
            if (key.includes('Towards')) {
                const keyStn = key.split('Towards ')[1].trim()
                const keyCodes = stations_dict[keyStn]
                const relevantKeyCode = textInStringsArray(keyCodes, startCode.slice(0,2))
                if (!relevantKeyCode) continue
                const relevantKeyCodeNo = relevantKeyCode.slice(2,)
                if ((ascending && endCodeNo <= relevantKeyCodeNo) || (!ascending && endCodeNo >= relevantKeyCodeNo)) {
                    relevantTimings.push(key)
                }
            }
        }
    } else {
        //throw error msg
        console.log('Error start code not found')
    }

    const relevantEntries = dayChecker(START_MRT_TYPE)
    let latestTime = '05:00'
    let latestTimeObject = {}
    for (const key of relevantTimings) {
        for (const entry of relevantEntries) {
            const time = startTimings[key][entry]
            if (time) {
                const time24HourFormat = convertTo24hTime(time)
                if (differenceTime(time24HourFormat, latestTime) > 0) {
                    latestTime = time24HourFormat
                    latestTimeObject = {
                        key,
                        entry,
                        latestTime
                    }
                }
            }
        }
    }
    
    let terminateNoStn = latestTimeObject.key.split(startLine)[1]
    let terminate = ''
    if (terminateNoStn) terminate = startLine + terminateNoStn
    else {
        terminateNoStn = latestTimeObject.key.replace('Towards', '').trim()
        for (const code of stations_dict[terminateNoStn]) {
            if (code.includes(startLine)) {
                terminate = code + ' ' + terminateNoStn
                break
            }
        }
    }
    
    const entry = latestTimeObject.entry
    const leaveTime = convertTo24hTime(latestTimeObject.latestTime)
    const eta = editTime(latestTimeObject.latestTime, path.time)
    const lastTrainObject = {
        terminate,
        entry,
        leaveTime,
        eta
    }

    return lastTrainObject
}


module.exports = {
    directPathTimings
}