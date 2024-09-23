const {outputJourney, getTimings} = require("./solver.js")
const {stations_dict} = require("./constants/stations.js")
const {arraysEqual} = require("./utils/utils.js")

async function solve(req, res) {
    const {start, end} = req.body
    const paths = outputJourney(start, end)

    //remove duplicate journeys
    let pathPairs = []
    for (const path of paths) {
        let pathFinalCode = []
        for (const code of path.codes) pathFinalCode.push(code)
        if (path.codes) {
            for (let i = 0; i < path.codes.length; i++) {
                if (path.codes[i].includes('_')) pathFinalCode[i] = pathFinalCode[i].split('_')[0]
                else if (path.codes[i] === 'CE') pathFinalCode[i] = 'CC4'
                else if (path.codes[i] === 'CG') pathFinalCode[i] = 'EW4'
            }
        }

        let toAddPath = true
        if (pathPairs.length === 0) pathPairs.push([path, pathFinalCode])
        else {
            for (const [currentPath, currentPathFinalCode] of pathPairs) {
                if (arraysEqual(currentPathFinalCode, pathFinalCode)) {
                    toAddPath = false //final codes same means path is same
                    break
                }
            }
            if (toAddPath) pathPairs.push([path, pathFinalCode])
        }
    }

    let fullPathsWithTimings = []
    for (const [pathOriginal, pathFinalCode] of pathPairs) {
        const timings = getTimings(pathOriginal)
        let path = pathOriginal
        path.codes = pathFinalCode
        fullPathsWithTimings.push({path, timings})
    }

    return res.status(200).json(fullPathsWithTimings)
}

async function getStations(req, res) {
    let stationsList = Object.keys(stations_dict)
    for (let i = 0; i < stationsList.length; i++) {
        let toAdd =  ' ['
        let codeHashMap = new Map()
        const codes = stations_dict[stationsList[i]]
        for (const code of codes) {
            let newCode = code
            if (code.includes('_')) newCode = code.split('_')[0] //STC_x or BPx_a
            else if (code.length === 2) continue //CE or CG, no number codes
            if (!codeHashMap.has(newCode)) { //newCode not found before, can add
                codeHashMap.set(newCode, 1)
                toAdd += newCode + '/'
            }
        }
        toAdd = toAdd.slice(0, -1) + ']'
        stationsList[i] += toAdd
    }
    return res.status(200).json(stationsList)
}

module.exports = {
    solve,
    getStations
}
