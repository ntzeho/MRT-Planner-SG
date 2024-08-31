const {outputJourney, getTimings} = require("./solver.js")
const {stations_dict} = require("./constants/stations.js")

async function solve(req, res) {
    const {start, end} = req.body
    const paths = outputJourney(start, end)

    let fullPathsWithTimings = []
    for (const path of paths) {
        const timings = getTimings(path)
        fullPathsWithTimings.push({path, timings})
    }
    return res.status(200).json(fullPathsWithTimings)
}

async function getStations(req, res) {
    return res.status(200).json(stations_dict)
}

module.exports = {
    solve,
    getStations
}
