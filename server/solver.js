const {heapPush, heapPop} = require("./utils/heapQueue.js")
const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime, editTime, differenceTime} = require("./utils/utils.js")
const {stations_dict} = require("./constants/stations.js")
const {travelTime, walkingTime, transferTime} = require("./constants/edges.js")
const { directPathTimings } = require("./utils/solver_utils.js")

function getStationFromCode(code) {
    const stationArray = Object.keys(stations_dict)
    for (const station of stationArray) {
        if (stations_dict[station].includes(code)) {
            return station
        }
    }
}

function editEdges(exclude) {
    //remove excluded edges from travelTime and return new set of edges without
    let newEdges = JSON.parse(JSON.stringify(travelTime))
    for (const toExclude of exclude) delete newEdges[toExclude]
    return newEdges
}

function getNeighbours(station, exclusion=[]) {
    let neighbours = [];
    const edgeKeys = Object.keys(travelTime)

    for (const edge of edgeKeys) {
        let edgeArray = edge.split(',')
        let toPush = true
        for (const exclude of exclusion) {
            if (station.slice(0, exclude.length) == exclude) {
                toPush = false
                break
            }
        }
                
        if (toPush) {
            if (edgeArray[0] === station) neighbours.push(edgeArray[1])
            else if (edgeArray[1] === station) neighbours.push(edgeArray[0])
        }
    }
    return neighbours
}

function commonLines(stn1, stn2) {
    const codes1 = stations_dict[stn1]
    const codes2 = stations_dict[stn2]
    let lines1 = []
    let lines2 = []
    let cLines = []

    for (let i = 0; i < codes1.length; i++) {
        lines1[i] = codes1[i].slice(0,2)
    }
    for (let i = 0; i < codes2.length; i++) {
        lines2[i] = codes2[i].slice(0,2)
    }
    for (let i = 0; i < lines1.length; i++) {
        if (lines2.includes(lines1[i])) {
            cLines.push(lines1[i])
        }
    }
    return cLines
}

function checkDirect(path) {
    for (let i = 0; i < path.length-1; i++) {
        if (path[i].slice(0,2) != path[i+1].slice(0,2)) {
            return false
        }
    }
    return true
}

function transferStation(path) {
    let transfers = []
    for (let i = 0; i < path.length-1; i++) {
        if (getStationFromCode(path[i]) == getStationFromCode(path[i+1])) {
            transfers.push(getStationFromCode(path[i]))
        }
    }
    return transfers
}

function totalTime(pathCode) {
    let time = 0
    const edges = Object.keys(travelTime)
    for (let i = 0; i < pathCode.length-1; i++) {
        if (edges.includes(pathCode[i] + ',' + pathCode[i+1])) {
            time += travelTime[pathCode[i] + ',' + pathCode[i+1]]
        } else {
            time += travelTime[pathCode[i+1] + ',' + pathCode[i]]
        }
    }
    return time
}

function reconstructPath(came_from, current) {
    let path = [current]
    while (current in came_from) {
        current = came_from[current]
        path.push(current)
    }
    path.reverse()
    return path
}

function convertPathToStations(path) {
    let namePath = []
    for (const code of path) {
        let stationName = getStationFromCode(code)
        if (!namePath.includes(stationName)) {
            namePath.push(stationName)
        }
    }
    return namePath
}

function checkLineInPaths(line, paths) {
    for (const path of paths) {
        for (const code of path.codes) {
            if (code.slice(0,2) == line) return true
        }
    }
    return false
}


function astar(start, end, exclude=[]) {
    let open_list = []
    let closed_set = new Set()
    let came_from = {}
    let g_score = {}
    let f_score = {}
    const stationArray = Object.keys(stations_dict)

    for (const station of stationArray) {
        let codeArray = stations_dict[station]
        for (const code of codeArray) {
            g_score[code] = Infinity
            f_score[code] = Infinity
        }
    }

    g_score[start] = 0
    f_score[start] = 0

    heapPush(open_list, [f_score[start], start])

    while (open_list.length > 0) {
        let [current_f, current] = heapPop(open_list)

        if (current == end) {
            const path = reconstructPath(came_from, current)
            const pathObject = {
                'codes' : path,
                'names' : convertPathToStations(path),
                'transfer' : transferStation(path),
                'time' : g_score[current]
            }
            return pathObject
        }

        closed_set.add(current)

        let neighbors = getNeighbours(current, exclude)
        for (const neighbor of neighbors) {
            let travelKey = current + ',' + neighbor in travelTime ? current + ',' + neighbor : neighbor + ',' + current
            let tentative_g_score = g_score[current] + travelTime[travelKey]

            if (tentative_g_score < g_score[neighbor]) {
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor]

                if (!closed_set.has(neighbor)) {
                    heapPush(open_list, [f_score[neighbor], neighbor])
                }
            }
        }
    }
    return {'codes': [], 'names': [], 'transfer': [], 'time': 0}
}

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
    if (walkTimeKeys.includes(start+','+end)) {
        const pathObject = {
            'names': [start, end],
            'time': walkingTime[start+','+end][1],
            'walk': walkingTime[start+','+end][0]
        }
        toKeep.push(pathObject)
    } else if (walkTimeKeys.includes(end+','+start)) {
        const pathObject = {
            'names': [start, end],
            'time': walkingTime[end+','+start][1],
            'walk': walkingTime[end+','+start][0]
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
    pathAttributes = Object.keys(path)
    let timingObject = {
        firstTrain: {},
        lastTrain: {
            terminate: [],
            entry: [],
            leaveTime: [],
            eta: 0
        }
    }

    //start and end stations are walkable, so no train timings required
    if (pathAttributes.length === 3) return timingObject

    //direct path with no transfers
    if (path.transfer.length === 0) {
        const pathTiming = directPathTimings(path)
        timingObject.lastTrain.terminate.push(pathTiming.terminate)
        timingObject.lastTrain.entry.push(pathTiming.entry)
        timingObject.lastTrain.leaveTime = pathTiming.leaveTime
        timingObject.lastTrain.eta = pathTiming.eta
        return timingObject
    }
    
    //non-direct path
    let stationsBeforeTransfer = 0
    let transferPath = JSON.parse(JSON.stringify(path)) //prevent path from being affected
    let pathSubsets = []

    while (transferPath.transfer.length > 0) {
        if (transferPath.transfer.includes(transferPath.names[stationsBeforeTransfer])) {
            const codes = transferPath.codes.slice(0, stationsBeforeTransfer + 1)
            const names = transferPath.names.slice(0, stationsBeforeTransfer + 1)
            const transfer = []
            const time = totalTime(codes)
            const pathSubset = {
                codes,
                names,
                transfer,
                time
            }
            pathSubsets.push(pathSubset)

            //remove these stations from transferPath
            transferPath.codes = transferPath.codes.slice(stationsBeforeTransfer + 1,)
            transferPath.names = transferPath.names.slice(stationsBeforeTransfer,)
            transferPath.transfer = transferPath.transfer.slice(1,)
            transferPath.time = transferPath.time - time - transferTime

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
            pathTimings[i].eta = editTime(etaToCompare, timeDiff)
            pathTimings[i].leaveTime = editTime(pathTimings[i].leaveTime, timeDiff)
        }
    }
    // console.log(' ')
    // console.log(pathTimings)

    for (const pathTiming of pathTimings) {
        timingObject.lastTrain.terminate.push(pathTiming.terminate)
        timingObject.lastTrain.entry.push(pathTiming.entry)
    }

    const finalLeaveTime = pathTimings[0].leaveTime
    timingObject.lastTrain.leaveTime = finalLeaveTime
    timingObject.lastTrain.eta = editTime(finalLeaveTime, path.time)
    return timingObject
}


module.exports = {
    astar,
    outputJourney,
    getTimings
}