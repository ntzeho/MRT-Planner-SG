const {outputJourney, getTimings} = require("./solver.js")
const {stations_dict} = require("./constants/stations.js")
const {arraysEqual} = require("./utils/utils.js")

function addSectionsToPath(path) {
    const sections = [];
    let currentSection = [];

    let codeCount = 0
    let stationCount = 0
    while (codeCount < path.codes.length) {
        if (path.codes && path.walk) { //both walking and taking train
            
        }
        const stationCode = path.codes[codeCount]
        const stationName = path.names[stationCount]

        currentSection.push([stationCode, stationName])

        if (path.transfer.includes(stationName) || codeCount === path.codes.length - 1) {
            sections.push(currentSection);
            //start a new section from the transfer station if not the last station
            if (codeCount !== path.codes.length - 1) {
                codeCount += 1
                currentSection = [[path.codes[codeCount], stationName]];
            }
          }
        codeCount += 1
        stationCount += 1
    }
  
    //add sections to the path object
    path.sections = sections;
  }

async function solve(req, res) {
    const {start, end} = req.body
    const paths = outputJourney(start, end)

    //remove duplicate journeys
    let pathPairs = []
    for (const path of paths) {
        if (!path.codes) { //consider pure walking paths
            pathPairs.push([path, []])
            continue
        }

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
        if (pathOriginal.codes) path.codes = pathFinalCode

        //add code to add a "sections" attribute for path so that path.sections = [[], [], []]
        //each section is an array of code + station name e.g. "CG2 Changi Airport"
        //if more than 1 section, start of 2nd and above section is the end station from previous section
        if (path.codes) addSectionsToPath(path)

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
