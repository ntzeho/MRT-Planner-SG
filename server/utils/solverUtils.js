const {heapPush, heapPop} = require("./heapQueue.js")
const {stations_dict} = require("../constants/stations.js")
const {travelTime, walkingTime, specialStations, transferTime} = require("../constants/edges.js")

function sameLine(pathCode) {
    return pathCode[0].slice(0,2) == pathCode[pathCode.length - 1].slice(0,2)
}

function redundantTransfer(path) {
    //return true if path contains a redundant transfer e.g. BP5_a to BP5_b
    const transferLength = path.transfer.length
    if (transferLength === 0) return false
    if (path.names[0] === path.transfer[0] || path.names[path.names.length - 1] === path.transfer[transferLength]) return true

    for (const transferStn of path.transfer) {
        const stnCodes = stations_dict[transferStn]
        if (stnCodes.length === 2 && sameLine(stnCodes)) return true
    }
    return false
}

function getStationFromCode(code) {
    const stationArray = Object.keys(stations_dict)
    for (const station of stationArray) {
        if (stations_dict[station].includes(code)) {
            return station
        }
    }
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


module.exports = {
    redundantTransfer,
    getStationFromCode,
    commonLines,
    checkDirect,
    totalTime,
    convertPathToStations,
    checkLineInPaths,
    astar
}