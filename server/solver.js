const {heappush, heappop} = require("./utils/heapQueue.js")
const {stations_dict} = require("./constants/stations.js")
const {travelTime, walkingTime} = require("./constants/edges.js")

function getStationFromCode(code) {
    const stationArray = Object.keys(stations_dict)
    for (const station of stationArray) {
        if (stations_dict[station].includes(code)) {
            return station
        }
    }
}

function getNeighbours(station, exclude='') {
    var neighbours = [];
    const edges = Object.keys(travelTime)

    for (const edge of edges) {
        let edgeArray = edge.split(',')
        if (edgeArray[0] === station && station.slice(0,2) != exclude) {
            neighbours.push(edgeArray[1])
        } else if (edgeArray[1] === station && station.slice(0,2) != exclude) {
            neighbours.push(edgeArray[0])
        }
    }
    return neighbours
}

function commonLines(stn1, stn2) {
    var lines1 = stations_dict[stn1]
    var lines2 = stations_dict[stn2]
    var cLines = []

    for (let i = 0; i < lines1.length; i++) {
        lines1[i] = lines1[i].slice(0,2)
    }
    for (let i = 0; i < lines2.length; i++) {
        lines2[i] = lines2[i].slice(0,2)
    }
    for (let i = 0; i < lines1.length; i++) {
        if (lines2.includes(lines1[i])) {
            cLines.push(lines1[i])
        }
    }
    return cLines
}

function checkDirect(path) {
    /*
    for i in range(len(path)-1):
        if path[i][:2] != path[i+1][:2]:
            return False
    return True
    */
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

function totalTime(path) {
    /*
    time = 0
    for i in range(len(path)-1):
        try:
            time += travelTime[(path[i], path[i+1])]
        except:
            time += travelTime[(path[i+1], path[i])]
    return time
    */
    var time = 0
    for (let i = 0; i < path.length-1; i++) {
        try {
            time += travelTime[path[i] + ',' + path[i+1]]
        } catch(err) {
            time += travelTime[path[i+1] + ',' + path[i]]
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



function astar(start, end, exclude='') {
    var open_list = []
    var closed_set = new Set()
    var came_from = {}
    var g_score = {}
    var f_score = {}
    const stationArray = Object.keys(stations_dict)

    for (const station of stationArray) {
        var codeArray = stations_dict[station]
        for (const code of codeArray) {
            g_score[code] = Infinity
            f_score[code] = Infinity
        }
    }

    g_score[start] = 0
    f_score[start] = 0

    heappush(open_list, [f_score[start], start])

    while (open_list.length > 0) {
        var [current_f, current] = heappop(open_list)

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

        var neighbors = getNeighbours(current, exclude)
        for (const neighbor of neighbors) {
            var travelKey = current + ',' + neighbor in travelTime ? current + ',' + neighbor : neighbor + ',' + current
            var tentative_g_score = g_score[current] + travelTime[travelKey]

            if (tentative_g_score < g_score[neighbor]) {
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g_score
                f_score[neighbor] = g_score[neighbor]

                if (!closed_set.has(neighbor)) {
                    heappush(open_list, [f_score[neighbor], neighbor])
                }
            }
        }
    }

}

function outputJourney(start, end) {
    /*
    def sortTime(journey):
        return journey[-1]

    paths = [astar(code_start, code_end) for code_start in stations_dict[start] for code_end in stations_dict[end]]
    paths.sort(key=sortTime)

    reverse_paths = [astar(code_end, code_start) for code_start in stations_dict[start] for code_end in stations_dict[end]]
    reverse_paths.sort(key=sortTime)

    toKeep = [paths[i] for i in range(len(paths)) if paths[i][-1] == paths[0][-1] or (paths[i][-1] - paths[0][-1] <= 3 and len(paths[i][2]) <= len(paths[0][2]))]
    toKeepReverse = [reverse_paths[i] for i in range(len(reverse_paths)) if reverse_paths[i][-1] == reverse_paths[0][-1] or (reverse_paths[i][-1] - reverse_paths[0][-1] <= 3 and len(reverse_paths[i][2]) <= len(reverse_paths[0][2]))]

    for path in toKeep:
        for r_path in toKeepReverse:
            path_code, path_name = path[:2]
            r_path_code, r_path_name, r_path_transfer, r_time = r_path[0][::-1], r_path[1][::-1], r_path[2][::-1], r_path[3]

            if r_path_name == path_name and r_path_code != path_code:
                path_transfer_unique = [getStationFromCode(code) for code in path_code if code not in r_path_code]
                r_path_transfer_unique = [getStationFromCode(code) for code in r_path_code if code not in path_code]

                if path_transfer_unique != r_path_transfer_unique:
                    toKeep.append((r_path_code, r_path_name, r_path_transfer, r_time))

    directPaths = [path for path in toKeep if checkDirect(path[0])]
    directLines = commonLines(start, end)

    if directLines != [] and len(directPaths) == 0:
        for line in directLines:
            directPath = []
            for code in stations_dict[start]:
                if code[:2] in directLines:
                    startCode = code
                    break
            
            for code in stations_dict[end]:
                if code[:2] in directLines:
                    endCode = code
                    break

            startNo = int(startCode[2:])
            endNo = int(endCode[2:])
            order = -int((startNo - endNo)/abs(startNo - endNo))

            directPath = [line+str(i) for i in range(startNo, endNo + order, order) if getStationFromCode(line + str(i)) is not None]

            toKeep.append((directPath, convertPathToStations(directPath), [], totalTime(directPath)))


    #take into account no bp lrt
    newPaths = [astar(code_start, code_end, exclude='BP') for code_start in stations_dict[start] for code_end in stations_dict[end]]
    newPaths = [path for path in newPaths if path is not None]
    newPaths.sort(key=sortTime)
    optimalNewPaths = [newPaths[i] for i in range(len(newPaths)) if newPaths[i][-1] == newPaths[0][-1] or (newPaths[i][-1] - newPaths[0][-1] <= 3 and len(newPaths[i][2]) <= len(newPaths[0][2]))]
    for path in optimalNewPaths:
        if path not in toKeep:
            toKeep.append(path)

    toKeep.sort(key=sortTime)

    
    #take into account walking stations
    if (start, end) in walkingTime:
        toKeep.append(tuple(walkingTime[(start, end)]))
    
    elif (end, start) in walkingTime:
        toKeep.append(tuple(walkingTime[(end, start)]))

    else:
        for pair in walkingTime:
            newPaths = []
            if start in pair:
                newPaths = [astar(code_start, code_end) for code_start in stations_dict[pair[pair.index(start) - 1]] for code_end in stations_dict[end]]
            elif end in pair:
                newPaths = [astar(code_start, code_end) for code_start in stations_dict[start] for code_end in stations_dict[pair[pair.index(end) - 1]]]

            newPaths.sort(key=sortTime)
            lst = [newPaths[i] for i in range(len(newPaths)) if newPaths[i][-1] == newPaths[0][-1] or (newPaths[i][-1] - newPaths[0][-1] <= 3 and len(newPaths[i][2]) <= len(newPaths[0][2]))]
            for path in lst:
                if path[-1] + walkingTime[pair][-1] <= toKeep[0][-1]:
                    toKeep.append((walkingTime[pair], path[0], path[1], path[2], path[-1] + walkingTime[pair][-1]))

    toKeep.sort(key=sortTime)
    return toKeep
    */

    
   
}

function getTimings(allPaths) {

}

function testFunction() {
    const toTest = astar('NS26', 'DT17')
    console.log(toTest)
}

testFunction()

module.exports = {
    outputJourney,
    getTimings
}