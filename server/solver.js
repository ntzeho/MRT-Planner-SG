const {heappush, heappop} = require("./utils/heapQueue.js")
const {stations_dict} = require("./constants/stations.js")
const {travelTime, walkingTime} = require("./constants/edges.js")

function getStationFromCode(code) {
    /*
    for station in stations_dict:
        if code in stations_dict[station]:
            return station
    */
    for (const station in stations_dict) {
        if (stations_dict[station].includes(code)) {
            return station
        }
    }
}

function getNeighbours(station, exclude='') {
    var neighbours = [];
    for (let i = 0; i < travelTime.length; i++) {
        if (travelTime[i][0] == station && travelTime[i][0].slice(0,2) != exclude) {
            neighbours.push(travelTime[i][1])
        } else if (travelTime[i][1] == station && travelTime[i][1].slice(0,2) != exclude) {
            neighbours.push(travelTime[i][0])
        } 
    }
    return neighbours
}

function commonLines(stn1, stn2) {
    /*
    lines1 = [code[:2] for code in stations_dict[stn1]]
    lines2 = [code[:2] for code in stations_dict[stn2]]
    return [line for line in lines1 if line in lines2]
    */
    let lines1 = []
    let lines2 = []
    let cLines = []
    for (const code1 in stations_dict[stn1]) {
        lines1.push(code1.slice(0,2))
    }
    for (const code2 in stations_dict[stn2]) {
        lines2.push(code2.slice(0,2))
    }
    for (const line in lines1) {
        if (lines2.includes(line)) {
            cLines.push(line)
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
    //return [getStationFromCode(path[i]) for i in range(len(path)-1) if getStationFromCode(path[i]) == getStationFromCode(path[i+1])]
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
            time += travelTime[(path[i], path[i+1])]
        } catch(err) {
            time += travelTime[(path[i+1], path[i])]
        }
    }
    return time
}

function reconstructPath(came_from, current) {
    /*
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]
    */
    let path = [current]
    while (came_from.includes(current)) {
        current = came_from[current]
        path.push(current)
    }
    path.reverse()
    return path
}

function convertPathToStation(path) {
    /*
    namePath = []
    for code in path:
        stationName = getStationFromCode(code)
        if stationName not in namePath:
            namePath.append(stationName)
    return namePath
    */
    let namePath = []
    for (const code in path) {
        let stationName = getStationFromCode(code)
        if (!namePath.includes(stationName)) {
            namePath.push(stationName)
        }
    }
    return namePath
}



function astar(start, end, exclude='') {
    /*

    */
    let openList = []
    let closed_set = new Set()
    let came_from = {}


}

function outputJourney(start, end) {
    
}

function getTimings(allPaths) {

}

module.exports = {
    outputJourney,
    getTimings
}