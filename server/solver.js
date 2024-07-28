const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime, editTime, differenceTime} = require("./utils/utils.js")
const {stations_dict} = require("./constants/stations.js")
const {travelTime, walkingTime, transferTime} = require("./constants/edges.js")
const { directPathTimings, nonDirectPathTimings } = require("./utils/timingUtils.js")
const {getStationFromCode, commonLines, checkDirect, totalTime, convertPathToStations, checkLineInPaths, astar} = require("./utils/solverUtils.js")

function outputJourney(start, end) {
    let paths = []
    let toKeep = []
    let directPaths = false

    const code_start_array = stations_dict[start]
    const code_end_array = stations_dict[end]

    for (const code_start of code_start_array) {
        for (const code_end of code_end_array) {
            let path = new astar(code_start, code_end)
            let reverse_path = new astar(code_end, code_start)

            reverse_path.codes.reverse()
            reverse_path.names.reverse()
            reverse_path.transfer.reverse()

            if (arraysEqual(path.names, reverse_path.names) && !arraysEqual(path.codes, reverse_path.codes)) {
                paths.push(reverse_path) //path is same but can interchange at different station
            } else if (!arraysEqual(path.names, reverse_path.names) && path.time === reverse_path.time) {
                paths.push(reverse_path) //path is different but same travelling time
            }
            if (checkDirect(path.codes)) {
                directPaths = true
            }
            paths.push(path)
        }
    }

    paths.sort((a, b) => a.time - b.time)
    for (let i = 0; i < paths.length; i++) {
        if (paths[i].time == paths[0].time || (paths[i].time - paths[0].time <= 3 && paths[i].transfer.length <= paths[0].transfer.length)) {
            toKeep.push(paths[i]) //keep paths that differ by 3 mins or less from optimal path
        }
    }

    //add a direct path to toKeep if it exists but isn't an optimal path
    const directLines = commonLines(start, end)

    if (directLines.length > 0 && !directPaths) {
        let startCode = ''
        let endCode = ''

        for (const line of directLines) {
            let directPath = []
            for (const code of code_start_array) {
                if (directLines.includes(code.slice(0,2))) {
                    startCode = code
                    break
                }
            }
            for (const code of code_end_array) {
                if (directLines.includes(code.slice(0,2))) {
                    endCode = code
                    break
                }
            }

            const startNo = parseInt(startCode.slice(2,))
            const endNo = parseInt(endCode.slice(2,))

            if (startNo < endNo) {
                for (let i = startNo; i < endNo + 1; i++) {
                    if (getStationFromCode(line + i)) {
                        directPath.push(line + i)
                    }
                }
            } else {
                for (let i = startNo; i > endNo - 1; i--) {
                    if (getStationFromCode(line + i)) {
                        directPath.push(line + i)
                    }
                }
            }

            let pathObject = {
                'codes': directPath,
                'names': convertPathToStations(directPath),
                'transfer': [],
                'time': totalTime(directPath)
            }
            toKeep.push(pathObject)
        }
    }

    //take into account no bp lrt
    if (checkLineInPaths('BP', toKeep)) {
        let newPaths = []
        for (const code_start of code_start_array) {
            for (const code_end of code_end_array) {
                let path = new astar(code_start, code_end, exclude=['BP'])
                if (path.time != 0 && !objectInArray(path, toKeep)) {
                    newPaths.push(path)
                }
            }
        }

        newPaths.sort((a, b) => a.time - b.time)
        for (let i = 0; i < newPaths.length; i++) {
            if (newPaths[i].time == newPaths[0].time || (newPaths[i].time - newPaths[0].time <= 3 && newPaths[i].transfer.length <= newPaths[0].transfer.length)) {
                toKeep.push(newPaths[i])
            }
        }
    }

    //take into account walking time
    const walkTimeKeys = Object.keys(walkingTime)
    if (walkTimeKeys.includes(start+','+end) || walkTimeKeys.includes(end+','+start)) {
        const pathObject = {
            'names': [start, end],
            'time': walkingTime[start+','+end][1],
            'walk': walkingTime[start+','+end][0]
        }
        toKeep.push(pathObject)
    } else {
        for (const pair of walkTimeKeys) {
            let newPaths = []
            let [stn1, stn2] = pair.split(',')
            if (start === stn1 || start === stn2) {
                let stationKey = start === stn1 ? stn2 : stn1
                let new_code_start_array = stations_dict[stationKey]
                for (const code_start of new_code_start_array) {
                    for (const code_end of code_end_array) {
                        let path = new astar(code_start, code_end)
                        newPaths.push(path)
                    }
                }
                
            } else if (end === stn1 || end === stn2) {
                let stationKey = end === stn1 ? stn2 : stn1
                let new_code_end_array = stations_dict[stationKey]
                for (const code_start of code_start_array) {
                    for (const code_end of new_code_end_array) {
                        let path = new astar(code_start, code_end)
                        newPaths.push(path)
                    }
                }
            }
            
            let walkingPaths = []
            newPaths.sort((a, b) => a.time - b.time)
            for (let i = 0; i < newPaths.length; i++) {
                if (newPaths[i].time == newPaths[0].time || (newPaths[i].time - newPaths[0].time <= 3 && newPaths[i].transfer.length <= newPaths[0].transfer.length)) {
                    walkingPaths.push(newPaths[i])
                }
            }

            for (const path of walkingPaths) {
                let totalTime = walkingTime[pair][1] + path.time
                if (totalTime <= toKeep[0].time) {  //.time + path.time <= toKeep[0].time
                    let pathObject = {
                        'codes': path.codes,
                        'names': path.names,
                        'transfer': path.transfer,
                        'time': totalTime,
                        'walk': walkingTime[pair][0]
                    }
                    toKeep.push(pathObject)
                }
            }

        }
    }
    toKeep.sort((a, b) => a.time - b.time)
    return toKeep
}

function getTimings(path) {
    const pathAttributes = Object.keys(path)
    let timingObject = {
        firstTrain: {},
        lastTrain: {
            terminate: [],
            entry: [],
            leaveTime: [],
            eta: [],
            finalLeaveTime: '',
            finalETA: ''
        }
    }

    //start and end stations are walkable, so no train timings required
    if (pathAttributes.length === 3) return timingObject

    let pathWalkTime = 0
    if (pathAttributes.length === 5) {
        if (path.walk.includes(path.names[0])) pathWalkTime = path.time - totalTime(path.codes)
    }
    //direct path with no transfers
    if (path.transfer.length === 0) {
        const pathTiming = directPathTimings(path)
        timingObject.lastTrain.terminate.push(pathTiming.terminate)
        timingObject.lastTrain.entry.push(pathTiming.entry)
        timingObject.lastTrain.leaveTime.push(pathTiming.leaveTime)
        timingObject.lastTrain.eta.push(pathTiming.eta)
        timingObject.lastTrain.finalLeaveTime = editTime(pathTiming.leaveTime, -pathWalkTime)
        timingObject.lastTrain.finalETA = pathTiming.eta
        return timingObject
    }
    
    //non-direct path
    if (pathAttributes.length >= 4) {
        const pathTimings = nonDirectPathTimings(path, pathWalkTime)
        for (const pathTiming of pathTimings) {
            timingObject.lastTrain.terminate.push(pathTiming.terminate)
            timingObject.lastTrain.entry.push(pathTiming.entry)
            timingObject.lastTrain.leaveTime.push(pathTiming.leaveTime)
            timingObject.lastTrain.eta.push(pathTiming.eta)
        }

        const finalLeaveTime = editTime(pathTimings[0].leaveTime, -pathWalkTime)
        timingObject.lastTrain.finalLeaveTime = finalLeaveTime
        timingObject.lastTrain.finalETA = editTime(finalLeaveTime, path.time)
        return timingObject
    }
}


module.exports = {
    outputJourney,
    getTimings
}