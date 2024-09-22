const {outputJourney, getTimings} = require("./solver.js")
const {stations_dict} = require("./constants/stations.js")

async function solve(req, res) {
    const {start, end} = req.body
    const paths = outputJourney(start, end)

    //add code to remove paths that are identical for BP line cos of _a and _b
    for (const path of paths) {
        let pathCode = path.codes
        //add function in utils? to replace _a with _b & vice versa

        for (const path_compare of paths) {
            if (pathCode === path_compare.codes && path.time === path_compare.time) {
                //remove path_compare from paths
            }
        }
    }

    let fullPathsWithTimings = []
    for (const path of paths) {
        const timings = getTimings(path)
        fullPathsWithTimings.push({path, timings})
    }

    //add code to modify station codes back to original codes

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
