const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, stringInArrayInArray, convertTo24hTime, editTime, differenceTime} = require("./utils/utils.js")
const {stations_dict} = require("./constants/stations.js")
const {travelTime, walkingTime, specialStations, transferTime} = require("./constants/edges.js")
const { directPathTimings, nonDirectPathTimings } = require("./utils/timingUtils.js")
const {redundantTransfer, getStationFromCode, commonLines, checkDirect, totalTime, convertPathToStations, checkLineInPaths, astar} = require("./utils/solverUtils.js")

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
        if (paths[i].time == paths[0].time || (paths[i].time - paths[0].time < transferTime && paths[i].transfer.length <= paths[0].transfer.length)) {
            toKeep.push(paths[i]) //keep paths that differ by less than transferTime from optimal path
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
        const walkKey = walkTimeKeys.includes(start+','+end) ? start+','+end : end+','+start
        const pathObject = {
            'names': [start, end],
            'time': walkingTime[walkKey][1],
            'walk': [walkingTime[walkKey][0]]
        }
        toKeep.push(pathObject)
        toKeep.sort((a, b) => a.time - b.time) //immediately return output
        return toKeep
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
                        'walk': [walkingTime[pair][0]]
                    }
                    toKeep.push(pathObject)
                }
            }

        }
    }

    //consider case where start and end station in separate pairs of walkingTime
    const startWalkCheck = stringInArrayInArray(walkTimeKeys, start)
    const endWalkCheck = stringInArrayInArray(walkTimeKeys, end)
    if (startWalkCheck[0] && endWalkCheck[0]) {
        const [startStn1, startStn2] = walkTimeKeys[startWalkCheck[1]].split(',')
        const [endStn1, endStn2] = walkTimeKeys[endWalkCheck[1]].split(',')
        const newStart = start == startStn1 ? startStn2 : startStn1
        const newEnd = end == endStn1 ? endStn2 : endStn1

        toKeep.sort((a, b) => a.time - b.time)
        for (const code_start of stations_dict[newStart]) {
            for (const code_end of stations_dict[newEnd]) {
                let path = new astar(code_start, code_end)
                path.time += walkingTime[walkTimeKeys[startWalkCheck[1]]][1] + walkingTime[walkTimeKeys[endWalkCheck[1]]][1]
                path.walk = [walkingTime[walkTimeKeys[startWalkCheck[1]]][0], walkingTime[walkTimeKeys[endWalkCheck[1]]][0]]
                if (path.time != 0 && path.time <= toKeep[0].time && !objectInArray(path, toKeep)) {
                    toKeep.push(path)
                }
                
            }
        }
        toKeep.sort((a, b) => a.time - b.time) //immediately return output
        return toKeep
    } 


    //consider alternate paths for BP/STC/PTC lrt
    let altPaths = []
    for (const path of toKeep) {
        const needWalk = Object.keys(path).length === 5
        let altPairs = []
        
        // const [code_start, code_end] = [path.codes[0], path.codes[path.codes.length - 1]]
        for (const pair of specialStations) {
            // if (path.codes.includes(pair[0]) && path.codes.includes(pair[1])) continue
            // if (path.transfer.length > 0 && sameLine(path.codes)) continue
            if (path.codes.includes(pair[0]) && !altPairs.includes([pair[0], pair[1], 0])) {
                altPairs.push([pair[0], pair[1], 0])
            }
            if (path.codes.includes(pair[1]) && !altPairs.includes([pair[0], pair[1], 1])) {
                altPairs.push([pair[0], pair[1], 1])
            }
        }

        // console.log('altPairs = ', altPairs)
        if (altPairs.length === 1 && !needWalk) {
            for (const code_start of code_start_array) {
                for (const code_end of code_end_array) {
                    let newAltPath = new astar(code_start, code_end, [altPairs[0][altPairs[0][2]]])
                    if (newAltPath.time != 0 && !objectInArray(newAltPath, altPaths) && !objectInArray(newAltPath, toKeep) && !redundantTransfer(newAltPath)) {
                        altPaths.push(newAltPath)
                    }
                }
            }    
        } else if (altPairs.length === 1 && needWalk) { //walking involved
            const walkAtStart = path.walk.includes(path.names[0])
            const newCode = walkAtStart ? path.codes[0] : path.codes[path.codes.length - 1]
            const codeArrayIterate = walkAtStart ? code_end_array : code_start_array
            
            for (const code of codeArrayIterate) {
                let newAltPath = walkAtStart ? new astar(newCode, code, [altPairs[0][altPairs[0][2]]]) : new astar(code, newCode, [altPairs[0][altPairs[0][2]]])
                if (newAltPath.time != 0 && !objectInArray(newAltPath, altPaths) && !objectInArray(newAltPath, toKeep) && !redundantTransfer(newAltPath)) {
                    newAltPath.walk = path.walk
                    newAltPath.time += path.time - totalTime(path.codes)
                    altPaths.push(newAltPath)
                }
            }
            
        } else if (altPairs.length === 2) {
            for (const code_start of code_start_array) {
                for (const code_end of code_end_array) {
                    let newAltPath1 = new astar(code_start, code_end, [altPairs[0][altPairs[0][2]]])
                    let newAltPath2 = new astar(code_start, code_end, [altPairs[1][altPairs[1][2]]])
                    let newAltPath3 = new astar(code_start, code_end, [altPairs[0][altPairs[0][2]], altPairs[1][altPairs[1][2]]])
                    if (newAltPath1.time != 0 && !objectInArray(newAltPath1, altPaths) && !objectInArray(newAltPath1, toKeep) && !redundantTransfer(newAltPath1)) {
                        altPaths.push(newAltPath1)
                    }
                    if (newAltPath2.time != 0 && !objectInArray(newAltPath2, altPaths) && !objectInArray(newAltPath2, toKeep) && !redundantTransfer(newAltPath2)) {
                        altPaths.push(newAltPath2)
                    }
                    if (newAltPath3.time != 0 && !objectInArray(newAltPath3, altPaths) && !objectInArray(newAltPath3, toKeep) && !redundantTransfer(newAltPath3)) {
                        altPaths.push(newAltPath3)
                    }
                }
            }
        }
    }

    if (altPaths.length > 0) for (const path of altPaths) toKeep.push(path)

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
            finalLeaveTime: '-',
            finalETA: '-'
        }
    }

    //start and end stations are walkable, so no train timings required
    if (pathAttributes.length === 3) return timingObject

    let pathWalkTime = 0
    if (pathAttributes.length === 5) { //obtain walking time at start
        if (path.walk[0].includes(path.names[0])) pathWalkTime = parseInt(path.walk.slice(0,1))
    }
    //direct path with no transfers
    if (path.transfer.length === 0) {
        const pathTiming = directPathTimings(path)
        timingObject.lastTrain.terminate.push(pathTiming.terminate)
        timingObject.lastTrain.entry.push(pathTiming.entry)
        timingObject.lastTrain.leaveTime.push(pathTiming.leaveTime)
        timingObject.lastTrain.eta.push(pathTiming.eta)
        timingObject.lastTrain.finalLeaveTime = editTime(pathTiming.leaveTime, -pathWalkTime)
        timingObject.lastTrain.finalETA = editTime(timingObject.lastTrain.finalLeaveTime, path.time)
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