const {timings, SBS_LINES, SENGKANG_PUNGGOL_LINES} = require('../constants/timings.js')
const {lrtTimings, routePairs, routeLetterDecider} = require('../constants/lrtTimings.js')
const {genericPublicHolidays, publicHolidays, dayDict} = require('../constants/publicHolidays.js')
const {stations_dict} = require("../constants/stations.js")
const {travelTime, walkingTime, specialStations, transferTime} = require("../constants/edges.js")
const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime, editTime, differenceTime, stringInArrayInArray} = require("./utils.js")
const {getStationFromCode, commonLines, checkDirect, totalTime, checkLineInPaths, astar} = require("./solverUtils.js")

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

    //obtain today's day based on time when checking for last train
    //Sunday is 0, Monday is 1, Tuesday is 2 etc ... Saturday is 6
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

function directPathTimings(inputPath) {
    let path = JSON.parse(JSON.stringify(inputPath))
    if (Object.keys(inputPath).length === 5) {
        if (path.walk.includes(path.names[0])) { //walking is at start
            path.time = totalTime(inputPath.codes)
        }
    }

    let relevantTimings = []

    const startStation = path.names[0]
    const startCode = path.codes[0]
    const startLine = startCode.slice(0,2)

    const endStation = path.names[path.names.length - 1]
    const endCode = path.codes[path.codes.length - 1]
    const endLine = endCode.slice(0,2)

    const START_MRT_TYPE = SBS_LINES.includes(startLine) || SENGKANG_PUNGGOL_LINES.includes(startCode) ? 'sbs_times' : 'smrt_times'
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

    const relevantEntries = dayChecker(START_MRT_TYPE)
    let latestTime = '05:00'
    let latestTimeObject = {}

    /*
    Sengkang punggol - just use last train timing at STC/PTC depending on loop

    BP -

    SMRT/SBS - split at ' | ' thing and get day/day range. If corroborate with current date get corresponding time. This time will be used
    */

    if (!startCodeNo || arrayStringsInText(SENGKANG_PUNGGOL_LINES, startCode)) {
        //Sengkang or Punggol LRT
        //special case, return stuff in here

        let routeLetter = ''
        if (!startCodeNo) { //start stn is sengkang or punggol
            routeLetter = startCode.split('_')[1]
        } else if (!endCodeNo) { //end stn is sengkang or punggol
            routeLetter = routePairs[endCode.split('_')[1]]
        } else { //no sengkang or punggol in path
            routeLetter = routeLetterDecider[startCode.slice(0,2)][ascending]
        }

        const lastTrainTime = convertTo24hTime(lrtTimings[startStation][routeLetter]['Last Trains'])
        const entry = 'Last Trains'
        const terminate = startCode.slice(0,1) + 'TC ' + (startCode.slice(0,1) === 'S' ? 'Sengkang' : 'Punggol')

        // const loopType = startCode.slice(1,2) === 'E' || path.codes[1].slice(1,2) === 'E' ? 'East Loop' : 'West Loop'
        //const extraTime = totalTime(path.codes.slice(0, path.names.indexOf('Bukit Panjang')+1))

        const lastTrainObject = {
            terminate,
            entry,
            'leaveTime': lastTrainTime,
            'eta': editTime(lastTrainTime, path.time)
        }

        return lastTrainObject

    } else if (startCode.includes('BP')) { //BP LRT
        //special case, return stuff in here
        let BP_KEYS = []
        let relevantKey = ''

        //obtain bukit panjang lrt keys
        for (const key of startTimingKeys) if (key.includes('BP6')) BP_KEYS.push(key)
        
        if (path.names[0] === 'Choa Chu Kang') {
            //start station of path is BP1 choa chu kang
            relevantKey = BP_KEYS[0] //both keys are same so doesn't matter
        } else if ([2,3,4,5,6].includes(startCodeNo) && ascending) {
            //start station before loop and is going towards loop
            for (const key of BP_KEYS) if (key.includes('Platform 2')) relevantKey = key
        } else if ([2,3,4,5,6].includes(startCodeNo)) {
            //start station before loop and is going away from loop
            for (const key of BP_KEYS) if (key.includes('Platform 1')) relevantKey = key
        } else if (path.names[path.names.length - 1] === 'Bukit Panjang') {
            //start station in loop, last station is bukit panjang
            const secondLastCodeNo = parseInt(path.codes[path.codes.length - 2].slice(2,))
            if (secondLastCodeNo === 7) { //7 to 6 is platform 2
                for (const key of BP_KEYS) if (key.includes('Platform 2')) relevantKey = key
            } else { //13 to 7 is platform 1
                for (const key of BP_KEYS) if (key.includes('Platform 1')) relevantKey = key
            }
        } else if (path.names.includes('Bukit Panjang')) {
            //bukit panjang is in path but not the final destination
            //must reach bukit panjang by 2330
            //return seperately here
            let bukitPanjangKey = ''
            
            for (const key of BP_KEYS) {
                if (key.includes('BP6') && key.includes('Platform 1')) {
                    bukitPanjangKey = key
                    break
                }
            }

            for (const entry of relevantEntries) {
                const time = timings['Bukit Panjang']['smrt_times'][bukitPanjangKey][entry]
                if (time) {
                    const time24HourFormat = convertTo24hTime(time)
                    if (differenceTime(time24HourFormat, latestTime) > 0) {
                        latestTime = time24HourFormat
                        latestTimeObject = {
                            'key': relevantKey,
                            entry,
                            latestTime
                        }
                    }
                }
            }

            const extraTime = totalTime(path.codes.slice(0, path.names.indexOf('Bukit Panjang')+1))
            const entry = latestTimeObject.entry
            const leaveTime = editTime(convertTo24hTime(latestTimeObject.latestTime), -extraTime)
            const eta = editTime(leaveTime, path.time)
            
            const lastTrainObject = {
                'terminate': 'BP6 Bukit Panjang',
                entry,
                leaveTime,
                eta
            }
    
            return lastTrainObject

        }
        else { //path within loop
            if (ascending) {
                for (const key of BP_KEYS) if (key.includes('Platform 1')) relevantKey = key
            } else {
                for (const key of BP_KEYS) if (key.includes('Platform 2')) relevantKey = key
            }
        }

        // console.log(relevantKey)
        // console.log(relevantKey, startTimings[relevantKey])
        
        for (const entry of relevantEntries) {
            const time = startTimings[relevantKey][entry]
            if (time) {
                const time24HourFormat = convertTo24hTime(time)
                if (differenceTime(time24HourFormat, latestTime) > 0) {
                    latestTime = time24HourFormat
                    latestTimeObject = {
                        'key': relevantKey,
                        entry,
                        latestTime
                    }
                }
            }
        }

        const entry = latestTimeObject.entry
        const leaveTime = convertTo24hTime(latestTimeObject.latestTime)
        const eta = editTime(latestTimeObject.latestTime, path.time)

        const lastTrainObject = {
            'terminate': 'BP6 Bukit Panjang',
            entry,
            leaveTime,
            eta
        }

        return lastTrainObject

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

    // const relevantEntries = dayChecker(START_MRT_TYPE)
    // let latestTime = '05:00'
    // let latestTimeObject = {}
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

function nonDirectPathTimings(path, pathWalkTime) { //no walking inside
    let stationsBeforeTransfer = 0
    let transferPath = JSON.parse(JSON.stringify(path)) //prevent path from being affected
    let pathSubsets = []
    let firstDirectPath = true

    while (transferPath.transfer.length > 0) {
        if (transferPath.transfer.includes(transferPath.names[stationsBeforeTransfer])) {
            const codes = transferPath.codes.slice(0, stationsBeforeTransfer + 1)
            const names = transferPath.names.slice(0, stationsBeforeTransfer + 1)
            const transfer = []
            const time = totalTime(codes)
            let pathSubset = {
                codes,
                names,
                transfer,
                time
            }
            if (firstDirectPath && Object.keys(path).length === 5) {
                pathSubset.walk = path.walk
                firstDirectPath = false
                transferPath.time = transferPath.time - time - transferTime - pathWalkTime
            } else {
                 transferPath.time = transferPath.time - time - transferTime
            }
            pathSubsets.push(pathSubset)

            //remove these stations from transferPath
            transferPath.codes = transferPath.codes.slice(stationsBeforeTransfer + 1,)
            transferPath.names = transferPath.names.slice(stationsBeforeTransfer,)
            transferPath.transfer = transferPath.transfer.slice(1,)

            stationsBeforeTransfer = 0
        } else {
            stationsBeforeTransfer += 1
        }
    }
    pathSubsets.push(transferPath)
    // console.log(pathSubsets)

    let pathTimings = []
    for (const subset of pathSubsets) {
        pathTimings.push(directPathTimings(subset))
    }
    // console.log(pathTimings)
    //start from second last entry, eta + TRANSFER_TIME <= leaveTime
    for (let i = pathTimings.length-2; i > -1; i--) {
        const etaToCompare = pathTimings[i].eta
        const leaveTimeToCompare = pathTimings[i+1].leaveTime
        const timeDiff = differenceTime(leaveTimeToCompare, editTime(etaToCompare, transferTime))
        if (timeDiff < 0) {
            //time difference to be subtracted off eta to be in multiples of transferTime
            //better account for real-world scenario as trains are infrequent nearing closing hours
            const timeToSubtract = -Math.ceil(-timeDiff / transferTime) * transferTime
            pathTimings[i].eta = editTime(etaToCompare, timeToSubtract)
            pathTimings[i].leaveTime = editTime(pathTimings[i].leaveTime, timeToSubtract)

            // pathTimings[i].eta = editTime(etaToCompare, timeDiff)
            // pathTimings[i].leaveTime = editTime(pathTimings[i].leaveTime, timeDiff)
        }
    }

    return pathTimings
}


module.exports = {
    directPathTimings,
    nonDirectPathTimings
}