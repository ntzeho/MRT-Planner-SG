const {heappush, heappop} = require("./utils/heapQueue.js")
const {SMRT_LINES, SBS_LINES, TRANSFER_TIME, EW_NS_I, DT_CE_I, NO_CODE_I, WALKING_TIME,} = require("./constants/constants.js")
const {stations_dict, lines, travelTime} = require("./constants/stations.js")
const TimeModel = require("./timings.js")

function getNeighbours(station) {
    var neighbours = [];


}

function commonLines(stn1, stn2) {
    /*
    lines1 = [code[:2] for code in stations_dict[stn1]]
    lines2 = [code[:2] for code in stations_dict[stn2]]
    return [line for line in lines1 if line in lines2]
    */

}

function checkTransfer(path) {
    if (path.length < 3) {
        return false
    }
    if (path.length === 3) {
        /*
        lines = [commonLines(path[i], path[i+1]) for i in range(2)]

        if len(lines[0]) == len(lines[1]) and len(lines[0]) == 1:
            return lines[0] != lines[1]
        
        if len(lines[0]) > 1 or len(lines[1]) > 1:
            for i in range(len(lines[0])):
                if lines[0][i] in lines[1]:
                    return False

        return True

        */
    }

    /*
    last4 = path[-4:]

    if last4[2:] in [EW_NS_I, EW_NS_I[::-1], DT_CE_I, DT_CE_I[::-1]]:
        return checkTransfer(last4[1:])

    if EW_NS_I[0] in last4 and EW_NS_I[1] in last4:
        return len(commonLines(path[-4], path[-1])) == 0
    
    if DT_CE_I[0] in last4 and DT_CE_I[1] in last4:
        return len(commonLines(path[-4], path[-1])) == 0

    return checkTransfer(path[-3:])

    */
}

function checkDirect(path) {

}

function transferStation(path) {
    if (path.length < 3) {
        return []
    }
    if (path.length === 3 && checkTransfer(path)) {
        return [path[1]]
    }
    if (path.length === 3 && !checkTransfer(path)) {
        return []
    }

    var extraCheck = false
    var transfers = []

    /*
    for i in range(len(path)-2):
        if extraCheck:
            checkPath = path[i-1:i+3]
        else:
            checkPath = path[i:i+3]

        if checkTransfer(checkPath):
            transfers.append(path[i+1])
        elif EW_NS_I[0] in checkPath and EW_NS_I[1] in checkPath:
            extraCheck = True
        elif DT_CE_I[0] in checkPath and DT_CE_I[1] in checkPath:
            extraCheck = True
        else:
            extraCheck = False

    if EW_NS_I[0] in transfers and EW_NS_I[1] in path:
        transfers[transfers.index(EW_NS_I[0])] = EW_NS_I

    elif EW_NS_I[1] in transfers and EW_NS_I[0] in path:
        transfers[transfers.index(EW_NS_I[1])] = EW_NS_I

    elif DT_CE_I[0] in transfers and DT_CE_I[1] in path:
        if path[path.index(DT_CE_I[0])-1] == DT_CE_I[1]:
            transfers[transfers.index(DT_CE_I[0])] = DT_CE_I

    elif DT_CE_I[1] in transfers and DT_CE_I[0] in path:
        transfers[transfers.index(DT_CE_I[1])] = DT_CE_I

    return transfers
    */
}

function reconstructPath(came_from, current) {
    /*
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return path[::-1]
    */
}

function totalTime(path) {
    var time = 0

    /*
    time = 0
    for i in range(len(path)-1):
        try:
            time += travelTime[(path[i],path[i+1])]
        except:
            time += travelTime[(path[i+1],path[i])]
    return time + TRANSFER_TIME*len(transferStation(path))
    */
}

function astar(start, end, weighted=true) {
    
}

function outputJourney(start, end) {
    const shortest_path = astar(start, end)
    const shortest_unweighted = astar(start, end, false)
    
    var allPaths = [[shortest_path, totalTime(shortest_path), transferStation(shortest_path)]]
    if (totalTime(shortest_path) === totalTime(shortest_unweighted) && shortest_unweighted != shortest_path) {
        allPaths.push([shortest_unweighted, allPaths[0][1], transferStation(shortest_unweighted)])
    }

    const directLines = directLines(start, end)

    /*
    if directLines != [] and len(shortest_path) > 3 and not checkDirect(shortest_path):
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

            directPath = []

            for i in range(startNo, endNo + order, order):
                if getStationFromCode(line + str(i)) is not None:
                    directPath.append(getStationFromCode(line + str(i)))

            allPaths.append((directPath, totalTime(directPath), []))

    return allPaths
    */
}

function getTimings(allPaths) {

}

module.exports = {
    outputJourney,
    getTimings
}